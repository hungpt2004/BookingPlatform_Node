const hotelType = [
    { id: 1, title: '1 khách sạn với nhiều phòng' },
    // { id: 2, title: 'Nhiều khách sạn với nhiều phòng' },
];

const mainOptions = [
    { id: 1, title: "Khách sạn", desc: "Chỗ nghỉ cho khách du lịch, thường có nhà hàng, phòng họp và các dịch vụ khác." },
    { id: 2, title: "Nhà khách", desc: "Nhà riêng với tiện nghi sống riêng cho chủ nhà và khách." },
    { id: 3, title: "Nhà nghỉ B&B", desc: "Nhà riêng có chỗ nghỉ qua đêm và phục vụ bữa sáng." },
    { id: 4, title: "Chỗ nghỉ nhà dân", desc: "Nơi khách có phòng riêng và host ở đó khi khách đến nghỉ." },
    { id: 5, title: "Nhà trọ", desc: "Chỗ nghỉ tiết kiệm với nhiều giường theo kiểu ký túc xá." },
    { id: 6, title: "Khách sạn căn hộ", desc: "Căn hộ tự phục vụ với tiện nghi khách sạn." },
    { id: 7, title: "Khách sạn khoang ngủ (capsule)", desc: "Buồng ngủ nhỏ gọn, giá rẻ cho khách." },
    { id: 8, title: "Nhà nghỉ nông thôn", desc: "Nhà riêng ở vùng quê, không gian yên tĩnh." },
    { id: 9, title: "Nhà nghỉ trang trại", desc: "Nông trại tư nhân với chỗ nghỉ đơn giản." }
];

const extraOptions = [
    { id: 10, title: "Khách sạn khoang ngủ (capsule)", desc: "Buồng ngủ nhỏ gọn, giá rẻ cho khách." },
    { id: 11, title: "Nhà nghỉ nông thôn", desc: "Nhà riêng ở vùng quê, không gian yên tĩnh." },
    { id: 12, title: "Nhà nghỉ trang trại", desc: "Nông trại tư nhân với chỗ nghỉ đơn giản." }
];

const hotelStar = [
    { id: 1, star: 1 },
    { id: 2, star: 2 },
    { id: 3, star: 3 },
    { id: 4, star: 4 },
    { id: 5, star: 5 },
];

const yesNo = [
    { id: 1, title: "Có" },
    { id: 2, title: "Không" },
]

const services = [
    { id: 1, name: "Nhà hàng" },
    { id: 2, name: "Dịch vụ phòng" },
    { id: 3, name: "Quầy bar" },
    { id: 4, name: "Lễ tân 24 giờ" },
    { id: 5, name: "Phòng xông hơi" },
    { id: 6, name: "Trung tâm thể dục" },
    { id: 7, name: "Sân vườn" },
    { id: 8, name: "Sân thượng / hiên" },
    { id: 9, name: "Phòng không hút thuốc" },
    { id: 10, name: "Xe đưa đón sân bay" },
    { id: 11, name: "WiFi miễn phí" },
    { id: 12, name: "Bồn tắm nóng / bể sục (Jacuzzi)" },
    { id: 13, name: "Hồ bơi" },
    { id: 14, name: "Bãi biển" },
];

const typeOption = [
    { id: 1, type: "Ca Nhan", desc: "Mot ca nhanh hoac chu so huu duy nhat va dieu hanh mot nghiep khong co tu cach phap nhan" },
    { id: 2, type: "Doanh Nghiep", desc: "Mot chuc the kinh doanh co the duoc so huu boi nhieu ca nhan, chang han nhu cong ty hop danh, cong ty dai chung hoac tu, to chuc phi loi nhan,v.v." }
];

const nation = [
    { id: 1, name: "Viet Nam" },
    { id: 2, name: "United States" },
    { id: 3, name: "United Kingdom" },
    { id: 4, name: "Japan" },
];

const documentTypes = [
    { type: "businessRegistration", label: "Thủ tục đăng ký kinh doanh khách sạn" },
    { type: "fireProtection", label: "Giấy phép đủ điều kiện Phòng cháy chữa cháy" },
    { type: "securityCertificate", label: "Giấy chứng nhận an ninh trật tự" },
    { type: "foodSafety", label: "Giấy chứng nhận cơ sở đủ điều kiện vệ sinh an toàn thực phẩm" },
    { type: "environmentalProtection", label: "Giấy phép cam kết bảo vệ môi trường" },
    { type: "hotelRating", label: "Đăng ký xếp hạng sao/Quyết định công nhận hạng tiêu chuẩn cơ sở lưu trú du lịch" }
];

export { hotelType, mainOptions, extraOptions, hotelStar, yesNo, services, typeOption, nation, documentTypes };
