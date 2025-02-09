import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

const MapComponent = () => {
  return (
    <motion.div
      className="rounded-4"
      style={{ height: "250px", backgroundColor: "#e0e0e0" }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <MapContainer
        center={[21.0285, 105.8542]} // Hà Nội, Việt Nam
        zoom={13}
        style={{ height: "100%", width: "100%", borderRadius: "16px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[21.0285, 105.8542]}>
          <Popup>Vị trí của bạn ở đây!</Popup>
        </Marker>
      </MapContainer>
    </motion.div>
  );
};

export default MapComponent;
