import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ rating }) => {
  const fullStars = Math.floor(rating);  // Số sao đầy đủ
  const halfStar = rating % 1 !== 0;     // Kiểm tra nếu có sao nửa
  const emptyStars = 5 - Math.ceil(rating); // Số sao trống

  return (
    <div className="d-flex justify-content-center">
      {/* Hiển thị sao đầy đủ */}
      {Array(fullStars).fill().map((_, index) => (
        <FaStar key={`full-${index}`} color="#ffbc00" />
      ))}
      
      {/* Hiển thị sao nửa */}
      {halfStar && <FaStarHalfAlt color="#ffbc00" />}
      
      {/* Hiển thị sao trống */}
      {Array(emptyStars).fill().map((_, index) => (
        <FaRegStar key={`empty-${index}`} color="#ffbc00" />
      ))}
    </div>
  );
};

export default Rating