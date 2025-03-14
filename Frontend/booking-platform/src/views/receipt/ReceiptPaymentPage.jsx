import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from '../../components/navbar/CustomNavbar';
import { formatCurrencyVND } from '../../utils/FormatPricePrint';
import { formatDate } from '../../utils/FormatDatePrint';

const Receipt = () => {
  const receiptData = {
    reservationId: 'RES-2025031401',
    user: {
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      phone: '0912345678'
    },
    hotel: {
      hotelName: 'Sài Gòn Luxury Hotel',
      address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
      phoneNumber: '028 1234 5678',
      star: 5
    },
    rooms: [
      {
        name: 'Phòng Deluxe',
        price: 1800000,
        quantity: 1
      },
      {
        name: 'Phòng Superior',
        price: 1500000,
        quantity: 2
      }
    ],
    checkInDate: new Date('2025-03-15'),
    checkOutDate: new Date('2025-03-18'),
    status: 'BOOKED',
    totalPrice: 4800000,
    bookingDate: new Date('2025-03-14')
  };

  const nights = Math.ceil((receiptData.checkOutDate - receiptData.checkInDate) / (1000 * 60 * 60 * 24));

  return (
    <>
      <CustomNavbar />
      <div className="container mt-4 p-4 bg-white shadow rounded">
        <div className="d-flex justify-content-between border-bottom pb-3">
          <div>
            <h1 className="h4 fw-bold">HOÁ ĐƠN ĐẶT PHÒNG</h1>
            <p className="text-muted">Mã đặt phòng: {receiptData.reservationId}</p>
          </div>
          <div className="text-end">
            {[...Array(receiptData.hotel.star)].map((_, i) => (
              <span key={i} className="text-warning">★</span>
            ))}
            <h2 className="h5 fw-bold">{receiptData.hotel.hotelName}</h2>
          </div>
        </div>

        <div className="row my-4">
          <div className="col-md-6">
            <h5 className="fw-semibold">Thông tin khách hàng</h5>
            <p><strong>Họ tên:</strong> {receiptData.user.name}</p>
            <p><strong>Email:</strong> {receiptData.user.email}</p>
            <p><strong>Điện thoại:</strong> {receiptData.user.phone}</p>
          </div>
          <div className="col-md-6">
            <h5 className="fw-semibold">Thông tin khách sạn</h5>
            <p>{receiptData.hotel.hotelName}</p>
            <p>{receiptData.hotel.address}</p>
            <p>{receiptData.hotel.phoneNumber}</p>
          </div>
        </div>

        <div className="bg-light p-3 rounded">
          <div className="row">
            <div className="col-md-3"><strong>Ngày nhận phòng:</strong> {formatDate(receiptData.checkInDate)}</div>
            <div className="col-md-3"><strong>Ngày trả phòng:</strong> {formatDate(receiptData.checkOutDate)}</div>
            <div className="col-md-3"><strong>Số đêm:</strong> {nights} đêm</div>
            <div className="col-md-3"><strong>Trạng thái:</strong> <span className="text-success">Đã đặt</span></div>
          </div>
        </div>

        <div className="my-4">
          <h5 className="fw-semibold">Chi tiết đặt phòng</h5>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Loại phòng</th>
                <th className="text-center">Số lượng</th>
                <th className="text-end">Đơn giá/đêm</th>
                <th className="text-end">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {receiptData.rooms.map((room, idx) => (
                <tr key={idx}>
                  <td>{room.name}</td>
                  <td className="text-center">{room.quantity}</td>
                  <td className="text-end">{formatCurrencyVND(room.price)}</td>
                  <td className="text-end">{formatCurrencyVND(room.price * room.quantity * nights)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between border-top border-bottom py-3">
          <span className="fw-bold">Tổng cộng:</span>
          <span className="fw-bold text-primary">{formatCurrencyVND(receiptData.totalPrice)}</span>
        </div>

        <div className="text-center text-muted mt-4">
          <p>Ngày đặt phòng: {formatDate(receiptData.bookingDate)} <span><button className='btn btn-dark mx-2'>Download</button></span></p>
          <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
          <p>Mọi thắc mắc xin vui lòng liên hệ số điện thoại: {receiptData.hotel.phoneNumber}</p>
        </div>
      </div>
    </>
  );
};

export default Receipt;
