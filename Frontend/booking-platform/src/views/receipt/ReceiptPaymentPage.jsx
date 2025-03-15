import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomNavbar from '../../components/navbar/CustomNavbar';
import { formatCurrencyVND } from '../../utils/FormatPricePrint';
import { formatDate } from '../../utils/FormatDatePrint';
import { useLocation, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/AxiosInstance';
import { CustomFailedToast, CustomSuccessToast, CustomToast } from '../../components/toast/CustomToast';
import axios from 'axios';
import { BASE_URL } from '../../utils/Constant';

const Receipt = () => {

  const { id } = useParams();
  const location = useLocation();

  const user = location.state?.user;
  const [hotel, setHotel] = useState({});
  const [rooms, setRooms] = useState([]);
  const [room, setRoom] = useState({});
  const [reservation, setReservation] = useState({});
  const [loading, setLoading] = useState(false);

  const getDataReservation = async () => {

    setLoading(true)

    try {

      const response = await axiosInstance.get(`/reservation/detail/${id}`)

      if (response.data.reservation && response.data.message) {
        setReservation(response.data.reservation)
      }

      CustomSuccessToast(response.data.message);

    } catch (error) { 
      
      if (error.response.data && error.response.data.message) {
        CustomFailedToast(error.response.data.message);
        setLoading(true)
      };
    
    } finally {
      
      setTimeout(() => {
        setLoading(true)
      }, 800)
    
    }
  }

  const downloadBookingBill = async () => {
    try {
      
      const response = await axios.get(`${BASE_URL}/pdf/${id}/download-pdf`,{
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `booking_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if(response.data && response.data.message){
        CustomSuccessToast(response.data.message);
      }

    } catch (error) {
      if(error.response.data.message){
        CustomFailedToast(error.response.data.message);
      }
    }
  }

  useEffect(() => {
    getDataReservation()
  }, [id] )

  console.log(id);
  console.log(user);
  console.log(JSON.stringify(reservation, null, 2));

  const nights = Math.ceil((new Date(reservation.checkOutDate) - new Date(reservation.checkInDate)) / (1000 * 60 * 60 * 24));

  return (
    <>
      <CustomToast/>
      <CustomNavbar />
      <div className="container p-4 bg-white shadow rounded" style={{marginTop: '150px'}}>
        <div className="d-flex justify-content-between border-bottom pb-3">
          <div>
            <h1 className="h4 fw-bold">HOÁ ĐƠN ĐẶT PHÒNG</h1>
            <p className="text-muted">Mã đặt phòng: {id}</p>
          </div>
          <div className="text-end">
            {[...Array(reservation.hotel?.star)].map((_, i) => (
              <span key={i} className="text-warning">★</span>
            ))}
            <h2 className="h5 fw-bold">{reservation.hotel?.hotelName}</h2>
          </div>
        </div>

        <div className="row my-4">
          <div className="col-md-6">
            <h5 className="fw-semibold">Thông tin khách hàng</h5>
            <p><strong>Họ tên:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Điện thoại:</strong> {user.phoneNumber}</p>
          </div>
          <div className="col-md-6">
            <h5 className="fw-semibold">Thông tin khách sạn</h5>
            <p><strong>Tên khách sạn: </strong>{reservation.hotel?.hotelName}</p>
            <p><strong>Địa chỉ: </strong>{reservation.hotel?.address}</p>
            <p><strong>Điện thoại: </strong>23456789</p>
          </div>
        </div>

        <div className="bg-light p-3 rounded">
          <div className="row">
            <div className="col-md-3"><strong>Ngày nhận phòng:</strong> {formatDate(reservation.checkInDate)}</div>
            <div className="col-md-3"><strong>Ngày trả phòng:</strong> {formatDate(reservation.checkOutDate)}</div>
            <div className="col-md-3"><strong>Số đêm:</strong> {nights} đêm</div>
            <div className="col-md-3"><strong>Trạng thái:</strong> <span className="text-success">{reservation.status}</span></div>
          </div>
        </div>

        <div className="my-4">
          <h5 className="fw-semibold">Chi tiết đặt phòng</h5>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Tên phòng</th>
                <th className='text-center'>Loại phòng</th>
                <th className="text-center">Số lượng</th>
                <th className="text-end">Đơn giá/đêm</th>
                <th className="text-end">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {reservation.rooms?.map((room, idx) => (
                <tr key={idx}>
                  <td>{room.room?.name}</td>
                  <td className='text-center'>{room.room?.type}</td>
                  <td className="text-center">{room.quantity}</td>
                  <td className="text-end">{formatCurrencyVND(room.room.price)}</td>
                  <td className="text-end">{formatCurrencyVND(room.room.price * room.quantity * nights)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between border-top border-bottom py-3">
          <span className="fw-bold">Tổng cộng:</span>
          <span className="fw-bold text-primary">{formatCurrencyVND(reservation.totalPrice + reservation.hotel?.pricePerNight)}</span>
        </div>

        <div className="text-center text-muted mt-4">
          <p>Ngày đặt phòng: {formatDate(reservation.checkInDate)} <span><button onClick={() => downloadBookingBill()} className='btn btn-dark mx-2'>Download</button></span></p>
          <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
          <p>Mọi thắc mắc xin vui lòng liên hệ số điện thoại: {reservation.hotel?.phoneNumber}</p>
        </div>
      </div>
    </>
  );
};

export default Receipt;
