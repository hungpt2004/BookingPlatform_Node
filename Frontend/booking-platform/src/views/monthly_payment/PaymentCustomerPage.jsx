import { useState, useEffect } from "react"
import { Card, Table, Row, Col, Typography, Button, Statistic, Space, Tag, DatePicker, message } from "antd"
import axiosInstance from "../../utils/AxiosInstance"
import { CustomFailedToast, CustomSuccessToast, CustomToast } from "../../components/toast/CustomToast"
import { BASE_URL } from "../../utils/Constant"
import { formatCurrencyVND } from "../../utils/FormatPricePrint"
import dayjs from "dayjs"
import { formatDate } from "../../utils/FormatDatePrint"

const { Title } = Typography
const { RangePicker } = DatePicker

const PaymentCustomerPage = () => {
   const [data, setData] = useState([])
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState("")
   const [dateRange, setDateRange] = useState([])

   // Pay
   const handlePayCustomer = async (refundId, reservationId, customerName, email) => {
      console.log(refundId)
      console.log(reservationId)
      console.log(customerName)
      console.log(email)

      if (!refundId || !reservationId || !customerName || !email) {
         message.error("Thông tin truyền vào lỗi")
         return;
      }
      try {
         const response = await axiosInstance.post(`/monthly-payment/pay-customer`, {
            refundId,
            reservationId,
            customerName,
            email
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


   // Fetch refund data
   const fetchRefunds = async (startDate, endDate) => {
      setLoading(true)
      setError("")

      try {
         const response = await axiosInstance.get(`${BASE_URL}/reservation/search-refund`, {
            params: { startDate, endDate },
         })

         if (response.data && response.data.data) {
            const apiData = response.data.data.map((refund, index) => ({
               key: index + 1,
               id: refund._id,
               reservation: refund.reservation._id || "N/A",
               customerName: refund.reservation.user.name || "N/A",
               customerEmail: refund.reservation.user.email || "N/A",
               refundAmount: refund.refundAmount,
               requestDate: refund.requestDate,
               decisionDate: refund.decisionDate,
               status: refund.status,
            }))
            setData(apiData)
         }
      } catch (error) {
         console.error("Error fetching refund data:", error)
         setError(error.response?.data?.message || "Failed to fetch refund data")
         CustomFailedToast(error.response?.data?.message || "Failed to fetch refund data")
      }

      setLoading(false)
   }

   useEffect(() => {
      fetchRefunds()
   }, [dateRange])

   // Handle date range change
   const handleDateChange = (dates) => {
      if (dates && dates.length === 2) {
         const startDate = dayjs(dates[0]).format("YYYY-MM-DD")
         const endDate = dayjs(dates[1]).format("YYYY-MM-DD")
         setDateRange([startDate, endDate])
      } else {
         setDateRange([])
      }
   }

   // Handle search click
   const handleSearch = () => {
      if (dateRange.length === 2) {
         fetchRefunds(dateRange[0], dateRange[1])
      } else {
         message.warning("Please select a valid date range!")
      }
   }

   const columns = [
      {
         title: "Mã đơn hàng",
         dataIndex: "reservation",
         key: "reservation",
      },
      {
         title: "Khách hàng",
         dataIndex: "customerEmail",
         key: "customerEmail",
      },
      {
         title: "Số tiền hoàn trả",
         dataIndex: "refundAmount",
         key: "refundAmount",
         render: (value) => formatCurrencyVND(value),
      },
      {
         title: "Ngày yêu cầu",
         dataIndex: "requestDate",
         key: "requestDate",
         render: (value) => formatDate(value),
      },
      {
         title: "Ngày được duyệt",
         dataIndex: "decisionDate",
         key: "decisionDate",
         render: (value) => formatDate(value),
      },
      {
         title: "Trạng thái",
         dataIndex: "status",
         key: "status",
         filters: [
            { text: 'Đã thanh toán', value: 'APPROVED' },
            { text: 'Chờ thanh toán', value: 'PENDING' },
         ],
         onFilter: (value, record) => record.paymentStatus === value,
         render: (status) => (
            <Tag color={status === 'APPROVED' ? 'green' : 'orange'}>
               {status === 'APPROVED' ? 'Đã thanh toán' : 'Chờ thanh toán'}
            </Tag>
         ),
      },
      {
         title: "Hành động",
         key: "actions",
         render: (_, record) => (
            <Space size="large">
               {record.status === 'PENDING' ? (
                  <Button
                     type="primary"
                     size="large"
                     onClick={() => handlePayCustomer(record.id, record.reservation, record.customerName,record.customerEmail)}
                  >
                     Thanh toán
                  </Button>
               ) : (
                  <Tag color="green">Đã thanh toán</Tag>
               )}
            </Space>
         ),
      },
   ]

   return (
      <>
         <CustomToast />
         <div style={{ padding: "24px" }}>
            <Title level={3}>Refund Management</Title>
            <Card style={{ marginBottom: 16 }}>
               <Row justify="space-between" align="middle">
                  <Col>
                     <RangePicker onChange={handleDateChange} format="YYYY-MM-DD" />
                  </Col>
                  <Col>
                     <Button className="button" onClick={handleSearch}>Search</Button>
                  </Col>
               </Row>
            </Card>
            <Card>
               <Table columns={columns} dataSource={data} loading={loading} rowKey="id" />
            </Card>
         </div>
      </>
   )
}

export default PaymentCustomerPage
