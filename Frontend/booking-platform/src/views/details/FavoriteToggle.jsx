import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../utils/AxiosInstance";
import { CustomFailedToast, CustomSuccessToast, CustomToast } from "../../components/toast/CustomToast";

const FavoriteToggle = ({ hotelId }) => {
  const [favorites, setFavorites] = useState([]); // Sử dụng mảng thay vì Set

  // Fetch danh sách yêu thích khi component mount
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axiosInstance.get("/favorite/list-favorites");
        const favoriteHotels = response.data.map((hotel) => hotel.id);
        setFavorites(favoriteHotels); // Cập nhật danh sách yêu thích
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  // Thêm/Xóa khách sạn khỏi danh sách yêu thích
  const toggleFavorite = async () => {
    try {
      let updatedFavorites = new Set(favorites);

      if (updatedFavorites.has(hotelId)) {
        await axiosInstance.delete("/favorite/remove-favorite", { data: { hotelId } });
        updatedFavorites.delete(hotelId);
        CustomSuccessToast("Removed from favorites");
      } else {
        await axiosInstance.post("/favorite/add-favorite", { hotelId });
        updatedFavorites.add(hotelId);
        CustomSuccessToast("Added to favorites");
      }

      // Tạo Set mới để React nhận diện sự thay đổi và re-render
      setFavorites(Array.from(updatedFavorites));

    } catch (error) {
      CustomFailedToast(error.message);
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <>
      <CustomToast/>
      <Form>
        <Form.Check
          type="switch"
          id={`favorite-switch-${hotelId}`}
          label="Add favorite hotel"
          onChange={toggleFavorite}
          checked={favorites.includes(hotelId)} // Kiểm tra giá trị
        />
      </Form>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default FavoriteToggle;
