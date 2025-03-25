import React, { useState, useEffect } from 'react';
import {
   Card,
   Select,
   DatePicker,
   Table,
   Row,
   Col,
   Typography,
   Button,
   Statistic,
   Space,
   Tag
} from 'antd';
import { SearchOutlined, PrinterOutlined, ExportOutlined, CreditCardFilled } from '@ant-design/icons';
import axiosInstance from '../../utils/AxiosInstance';
import { CustomFailedToast, CustomSuccessToast, CustomToast } from '../../components/toast/CustomToast';
import { BASE_URL } from '../../utils/Constant';
import axios from 'axios';
import { formatCurrencyVND } from '../../utils/FormatPricePrint';

const { Title } = Typography;
const { Option } = Select;

const PaymentOwnerPage = () => {
   // State for filters
   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month by default
   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Current year by default
   const [selectedHotel, setSelectedHotel] = useState('all');
   const [loading, setLoading] = useState(false);
   const [data, setData] = useState([]);
   const [ownerHotels, setOwnerHotels] = useState([]);
   const [totalReservation, setTotalReservations] = useState();
   const [error, setError] = useState('')

   //GET OWNER HOTEL DATA
   const getOwnerHotel = async (req, res) => {
      setError('')
      try {
         const response = await axios.get(`${BASE_URL}/hotel/get-all-hotel`);
         if (response.data && response.data.hotels) {
            setOwnerHotels(response.data.hotels);
         }
      } catch (error) {
         if (error.response.data.message) {
            console.log(error.reponse.data.message);
         }
      }
   }

   const handlePaymentForOwner = async (hotelId, monthlyId) => {

      console.log(hotelId)
      console.log(monthlyId)

      if (!hotelId || !monthlyId) {
         return;
      }

      try {
         const response = await axiosInstance.post(`/monthly-payment/pay-owner`, {
            hotelId,
            monthlyId
         });

         if (response.data.message && response.status === 200) {
            CustomSuccessToast(response.data.message)
            fetchData()
         } else {
            CustomFailedToast("Payment for owner have some error")
         }
      } catch (error) {
         console.error('Error:', error.response?.data?.message);
         CustomFailedToast(error.response?.data?.message)
      }
   };

   // Generate months options
   const months = [];
   for (let i = 1; i <= 12; i++) {
      months.push({ value: i, label: `Tháng ${i}` });
   }

   // Generate years options (last 5 years to next year)
   const currentYear = new Date().getFullYear();
   const years = [];
   for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      years.push({ value: i, label: `Năm ${i}` });
   }

   // Mock data fetch table
   const fetchData = async () => {
      setLoading(true);

      try {
         const params = {
            year: selectedYear,
            month: selectedMonth,
         };

         if (selectedHotel !== "all") {
            params.hotelId = selectedHotel;
         }

         const response = await axiosInstance.get(`${BASE_URL}/monthly-payment/monthly-data-admin`, { params });

         if (response.data && response.data.data) {
            setTotalReservations(response.data.reservations)
            const apiData = response.data.data.map((item, index) => ({
               key: index + 1,
               id: item._id,
               hotelName: item.hotel.hotelName,
               hotelId: item.hotel._id,
               revenue: item.amount || 0,
               paymentStatus: item.status,
               paymentDate: item.paymentDate ? new Date(item.paymentDate).toISOString().split("T")[0] : null,
            }));

            setData(apiData);

            console.log("Get data of revenue successfully");

         }

      } catch (error) {
         console.error("Error fetching data:", error);
         console.log(error.response.data.message);
      }

      setLoading(false);
   };

   // Fetch data initially and when filters change
   useEffect(() => {
      fetchData();
   }, [selectedMonth, selectedYear, selectedHotel]);

   useEffect(() => {
      getOwnerHotel();
   }, []);

   // Table columns
   const columns = [
      {
         title: 'Khách sạn',
         dataIndex: 'hotelName',
         key: 'hotelName',
         width: 240,
      },
      {
         title: 'Doanh thu',
         dataIndex: 'revenue',
         key: 'revenue',
         width: 180,
         sorter: (a, b) => a.revenue - b.revenue,
         render: (value) => formatCurrencyVND(value),
      },
      {
         title: 'Phí Phải Trả (Lấy 10%)',
         dataIndex: 'revenue', // Dùng totalRevenue làm dữ liệu gốc
         key: 'commission',
         width: 180,
         sorter: (a, b) => (a.revenue * 0.9) - (b.revenue * 0.9),
         render: (value) => formatCurrencyVND(value * 0.9),
      },
      {
         title: 'Trạng thái',
         dataIndex: 'paymentStatus',
         key: 'paymentStatus',
         width: 120,
         filters: [
            { text: 'Đã thanh toán', value: 'PAID' },
            { text: 'Chờ thanh toán', value: 'PENDING' },
         ],
         onFilter: (value, record) => record.paymentStatus === value,
         render: (status) => (
            <Tag color={status === 'PAID' ? 'green' : 'orange'}>
               {status === 'PAID' ? 'Đã thanh toán' : 'Chờ thanh toán'}
            </Tag>
         ),
      },
      {
         title: 'Ngày thanh toán',
         dataIndex: 'paymentDate',
         key: 'paymentDate',
         width: 140,
         render: (date) => date ? date : '-',
      },
      {
         title: 'Hành động',
         key: 'action',
         width: 120,
         render: (_, record) => (
            <Space size="large">
               {record.paymentStatus === 'PENDING' ? (
                  <Button
                     type="primary"
                     size="large"
                     onClick={() => handlePaymentForOwner(record.hotelId, record.id)}
                  >
                     Thanh toán
                  </Button>
               ) : (
                  <Tag color="green">Đã thanh toán</Tag>
               )}
            </Space>
         ),
      },

   ];

   // Calculate summary statistics
   const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
   const paidReservations = data.filter(item => item.paymentStatus === 'PAID').length;

   return (
      <>
         <CustomToast />
         <div className='d-flex'>
            <div className='content w-100'>
               <div style={{ padding: '24px' }}>
                  <Title level={3}>Báo cáo thanh toán theo tháng</Title>

                  {/* Filters */}
                  <Card style={{ marginBottom: '24px' }}>
                     <Row gutter={24} align="middle">
                        <Col xs={24} sm={8} md={6} lg={4}>
                           <div style={{ marginBottom: '8px' }}>Tháng</div>
                           <Select
                              style={{ width: '100%' }}
                              value={selectedMonth}
                              onChange={setSelectedMonth}
                              options={months}
                           />
                        </Col>
                        <Col xs={24} sm={8} md={6} lg={4}>
                           <div style={{ marginBottom: '8px' }}>Năm</div>
                           <Select
                              style={{ width: '100%' }}
                              value={selectedYear}
                              onChange={setSelectedYear}
                              options={years}
                           />
                        </Col>
                        <Col xs={24} sm={8} md={12} lg={8}>
                           <div style={{ marginBottom: '8px' }}>Khách sạn</div>
                           <Select
                              style={{ width: '100%' }}
                              value={selectedHotel}
                              onChange={setSelectedHotel}
                              placeholder="Chọn khách sạn"
                           >
                              <Option value="all">Tất cả khách sạn</Option>
                              {ownerHotels.map(hotel => (
                                 <Option key={hotel._id} value={hotel?.id}>{hotel?.hotelName}</Option>
                              ))}
                           </Select>
                        </Col>
                        <Col xs={24} md={24} lg={8} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: { xs: '16px', lg: '28px' } }}>
                           <Button
                              type="primary"
                              icon={<SearchOutlined />}
                              onClick={fetchData}
                              loading={loading}
                           >
                              Tìm kiếm
                           </Button>
                        </Col>
                     </Row>
                  </Card>

                  {/* Statistics Cards */}
                  <Row gutter={16} style={{ marginBottom: '24px' }}>
                     <Col xs={24} sm={12} md={6}>
                        <Card>
                           <Statistic
                              title="Tổng doanh thu"
                              value={totalRevenue}
                              precision={0}
                              formatter={(value) => formatCurrencyVND(value)}
                           />
                        </Card>
                     </Col>
                     <Col xs={24} sm={12} md={6}>
                        <Card>
                           <Statistic
                              title="Tổng hóa đơn"
                              value={totalReservation}
                              precision={0}
                           />
                        </Card>
                     </Col>
                     <Col xs={24} sm={12} md={6}>
                        <Card>
                           <Statistic
                              title="Đã thanh toán"
                              value={paidReservations}
                              suffix={`/ ${totalReservation}`}
                           />
                        </Card>
                     </Col>
                  </Row>

                  {/* Table */}
                  <Card>
                     <Table
                        columns={columns}
                        dataSource={data}
                        loading={loading}
                        scroll={{ x: 1200 }}
                        pagination={{
                           showSizeChanger: true,
                           showTotal: (total) => `Tổng ${total} bản ghi`,
                           defaultPageSize: 10,
                           pageSizeOptions: ['10', '20', '50'],
                        }}
                        summary={() => (
                           <Table.Summary fixed>
                              <Table.Summary.Row>
                                 <Table.Summary.Cell index={0} colSpan={2}><strong>Tổng cộng</strong></Table.Summary.Cell>
                                 <Table.Summary.Cell index={2}><strong>{totalReservation} đơn</strong></Table.Summary.Cell>
                                 <Table.Summary.Cell index={3}>
                                    <strong>{formatCurrencyVND(totalRevenue)}</strong>
                                 </Table.Summary.Cell>
                                 <Table.Summary.Cell index={5} colSpan={3}></Table.Summary.Cell>
                              </Table.Summary.Row>
                           </Table.Summary>
                        )}
                     />
                  </Card>
               </div>
            </div>
         </div>
      </>
   );
};

export default PaymentOwnerPage;