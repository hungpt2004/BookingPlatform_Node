import dayjs from 'dayjs';  // Hoặc moment.js nếu bạn muốn

// Hàm định dạng ngày
export const formatDate = (date, format = 'DD/MM/YYYY') => {
    return dayjs(date).format(format); // Thay thế dayjs bằng moment nếu bạn dùng moment.js
};