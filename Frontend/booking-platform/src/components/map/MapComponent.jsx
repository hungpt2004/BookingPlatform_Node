import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

const ClickableMap = ({ setPosition, setLocationName }) => {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      // Gọi API Nominatim để lấy tên địa điểm
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await response.json();
        setLocationName(data.display_name || "Không xác định");
      } catch (error) {
        console.error("Lỗi lấy tên địa điểm:", error);
        setLocationName("Không thể lấy tên vị trí");
      }
    },
  });

  return null;
};

const MapComponent = () => {
  const [position, setPosition] = useState([21.0285, 105.8542]); // Hà Nội, Việt Nam
  const [locationName, setLocationName] = useState("Hà Nội, Việt Nam");

  return (
    <motion.div
      className="rounded-4"
      style={{ height: "300px", backgroundColor: "#e0e0e0" }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%", borderRadius: "16px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {/* Component xử lý click để cập nhật vị trí và lấy tên địa điểm */}
        <ClickableMap setPosition={setPosition} setLocationName={setLocationName} />

        {/* Marker di chuyển theo vị trí đã chọn */}
        <Marker position={position}>
          <Popup>{locationName}</Popup>
        </Marker>
      </MapContainer>
    </motion.div>
  );
};

export default MapComponent;
