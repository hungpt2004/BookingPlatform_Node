import { AiOutlineUser, AiFillStar } from "react-icons/ai";

// Hiển thị icon người dựa trên số lượng capacity
export const renderPersonIcon = (capacity) => {
   return Array.from({ length: capacity }, (_, i) => (
      <AiOutlineUser key={i} className="me-1" size={16} />
   ));
};

// Hiển thị icon sao dựa trên số lượng star
export const renderStarIcon = (star) => {
   return Array.from({ length: star }, (_, i) => (
      <AiFillStar key={i} className="me-1 text-warning" size={16} />
   ));
};
