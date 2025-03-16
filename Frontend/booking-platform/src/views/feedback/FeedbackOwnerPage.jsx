import { useState, useEffect } from "react"
import { Table, Space, Rate, Input, Button, Tag, DatePicker, Typography, Divider } from "antd"
import { Container, Row, Col, Card } from "react-bootstrap"
import {
   SearchOutlined,
   ReloadOutlined,
   UserOutlined,
   HomeOutlined,
   CalendarOutlined,
   EyeOutlined,
   MessageOutlined,
} from "@ant-design/icons"
import moment from "moment"
import Sidebar from "../../components/navbar/AdminSidebar"
import { AdminCustomNavbar } from "../../components/navbar/AdminCustomNavbar"
import { BASE_URL } from "../../utils/Constant"
import { CustomFailedToast, CustomSuccessToast } from "../../components/toast/CustomToast"
import axiosInstance from "../../utils/AxiosInstance"
import axios from "axios"

const { Title, Text } = Typography
const { RangePicker } = DatePicker

const FeedbackTable = () => {
   const [feedbacks, setFeedbacks] = useState([])
   const [loading, setLoading] = useState(false)
   const [user, setUser] = useState(null);
   const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 10,
   })
   const [searchText, setSearchText] = useState("")
   const [filterRating, setFilterRating] = useState(null)
   // Add a new state for selected hotel after the filterRating state
   const [selectedHotel, setSelectedHotel] = useState('')
   const [hotels, setHotels] = useState([]);

   feedbacks.forEach((item) => console.log(item.content))

   const fetchFeedbacks = async () => {
      setLoading(true);
      try {
         const response = await axios.get(`${BASE_URL}/feedback/get-feedback-hotel/${selectedHotel}`);

         if (typeof response.data === "string") {
            setFeedbacks([]); // Nếu không có feedback, đặt danh sách rỗng
            setPagination({ ...pagination, total: 0 });
            return;
         }

         setFeedbacks(response.data.listFeedback); // Cập nhật danh sách feedbacks
         setUser(response.data.userFeedback)
         setPagination({ ...pagination, total: response.data.listFeedback.length });
      } catch (error) {
         console.error("Error fetching feedbacks:", error);
         setFeedbacks([]); // Đảm bảo UI không bị lỗi khi gặp lỗi request
      } finally {
         setLoading(false);
      }
   };

   const getOwnerHotel = async (req, res) => {

      try {

         const response = await axiosInstance.get('/hotel/get-owned-hotel');

         if (response.data && response.data.hotels) {
            setHotels(response.data.hotels);
            CustomSuccessToast("Get owner hotel success");
         }

      } catch (error) {
         if (error.response.data.message) {
            CustomFailedToast(error.response.data.message);
         }

      }

   }

   const handleTableChange = (pagination) => {
      setPagination(pagination)
   }

   const handleSearch = (value) => {
      setSearchText(value)
      setPagination({ ...pagination, current: 1 })
   }

   const handleRatingFilter = (value) => {
      setFilterRating(value)
      setPagination({ ...pagination, current: 1 })
   }

   // Update the resetFilters function to also reset the hotel filter
   const resetFilters = () => {
      setSearchText("")
      setFilterRating(null)
      setSelectedHotel(null)
      setPagination({ ...pagination, current: 1 })
   }


   useEffect(() => {
      fetchFeedbacks()
   }, [pagination.current, pagination.pageSize, selectedHotel])

   useEffect(() => {
      getOwnerHotel()
   }, [])


   // Update the filteredData function to also filter by selected hotel
   const filteredData = feedbacks.filter((feedback) => {
      let matchesSearch = true
      let matchesRating = true
      let matchesHotel = true

      if (searchText) {
         matchesSearch =
            feedback.user.name.toLowerCase().includes(searchText.toLowerCase()) ||
            feedback.hotel.hotelName.toLowerCase().includes(searchText.toLowerCase()) ||
            feedback.content.toLowerCase().includes(searchText.toLowerCase())
      }

      if (filterRating !== null) {
         matchesRating = feedback.rating === filterRating
      }

      if (selectedHotel !== null) {
         matchesHotel = feedback.hotel._id.toString() === selectedHotel
      }

      return matchesSearch && matchesRating && matchesHotel

   })


   const getRatingColor = (rating) => {
      if (rating >= 4) return "success"
      if (rating >= 3) return "warning"
      return "error"
   }

   const columns = [
      {
         title: "User",
         dataIndex: "user",
         key: "user",
         render: (user) => (
            <Space direction="vertical" size="small" style={{ marginBottom: 0 }}>
               <Text strong style={{ fontSize: "14px" }}>
                  <UserOutlined style={{ marginRight: 8 }} />
                  {user.name}
               </Text>
               <Text type="secondary" style={{ fontSize: "12px" }}>
                  {user.email}
               </Text>
            </Space>
         ),
      },
      {
         title: "Hotel",
         dataIndex: "hotel",
         key: "hotel",
         render: (hotel) => (
            <Space direction="vertical" size="small" style={{ marginBottom: 0 }}>
               <Text strong style={{ fontSize: "14px" }}>
                  <HomeOutlined style={{ marginRight: 8 }} />
                  {hotel.hotelName}
               </Text>
               <Text type="secondary" style={{ fontSize: "12px" }}>
                  {hotel.address}
               </Text>
            </Space>
         ),
      },
      {
         title: "Rating",
         dataIndex: "rating",
         key: "rating",
         render: (rating) => (
            <Space>
               <Rate disabled defaultValue={rating} style={{ fontSize: "16px" }} />
               <Tag color={getRatingColor(rating)} style={{ marginLeft: 8 }}>
                  {rating}/5
               </Tag>
            </Space>
         ),
         sorter: (a, b) => a.rating - b.rating,
         width: 200,
      },
      {
         title: "Feedback",
         dataIndex: "content",
         key: "content",
         render: (content) => (
            <div style={{ maxWidth: 300, whiteSpace: "normal", fontSize: "14px" }}>
               {content.length > 100 ? `${content.substring(0, 100)}...` : content}
            </div>
         ),
      },
      {
         title: "Date",
         dataIndex: "createdAt",
         key: "createdAt",
         render: (date) => (
            <Space>
               <CalendarOutlined style={{ color: "#1890ff" }} />
               <span>{moment(date).format("DD/MM/YYYY")}</span>
            </Space>
         ),
         sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
         width: 150,
      },
      {
         title: "Actions",
         key: "actions",
         render: (_, record) => (
            <Space size="small">
               <Button type="primary" icon={<EyeOutlined />} size="small">
                  View
               </Button>
               <Button type="default" icon={<MessageOutlined />} size="small">
                  Reply
               </Button>
            </Space>
         ),
         width: 150,
         align: "center",
      },
   ]

   const renderStats = () => {
      const totalFeedbacks = feedbacks.length
      const averageRating =
         feedbacks.length > 0 ? (feedbacks.reduce((sum, item) => sum + item.rating, 0) / totalFeedbacks).toFixed(1) : 0

      const ratingDistribution = [0, 0, 0, 0, 0] // Index 0 = 1 star, Index 4 = 5 stars
      feedbacks.forEach((feedback) => {
         ratingDistribution[feedback.rating - 1]++
      })

      const getColorClass = (rating) => {
         if (Number.parseFloat(rating) >= 4) return "success"
         if (Number.parseFloat(rating) >= 3) return "warning"
         return "danger"
      }

      return (
         <Row className="mb-4 g-3">
            <Col md={4}>
               <Card className="text-center h-100 shadow-sm border-0">
                  <Card.Body className="d-flex flex-column justify-content-center">
                     <div className="mb-2">
                        <span className="text-primary" style={{ fontSize: "42px", fontWeight: "bold" }}>
                           {totalFeedbacks}
                        </span>
                     </div>
                     <Card.Title className="mb-0" style={{ fontSize: "16px", color: "#666" }}>
                        Total Feedbacks
                     </Card.Title>
                  </Card.Body>
               </Card>
            </Col>
            <Col md={4}>
               <Card className="text-center h-100 shadow-sm border-0">
                  <Card.Body className="d-flex flex-column justify-content-center">
                     <div className="mb-2">
                        <span
                           className={`text-${getColorClass(averageRating)}`}
                           style={{ fontSize: "42px", fontWeight: "bold" }}
                        >
                           {averageRating}
                        </span>
                        <small style={{ fontSize: "18px", color: "#666" }}> / 5</small>
                     </div>
                     <Card.Title className="mb-2" style={{ fontSize: "16px", color: "#666" }}>
                        Average Rating
                     </Card.Title>
                     <div className="d-flex justify-content-center">
                        <Rate disabled allowHalf defaultValue={Number.parseFloat(averageRating)} style={{ fontSize: "16px" }} />
                     </div>
                  </Card.Body>
               </Card>
            </Col>
            <Col md={4}>
               <Card className="h-100 shadow-sm border-0">
                  <Card.Body>
                     <Card.Title className="text-center mb-3" style={{ fontSize: "16px", color: "#666" }}>
                        Rating Distribution
                     </Card.Title>
                     <div>
                        {[5, 4, 3, 2, 1].map((star) => {
                           const percentage = totalFeedbacks ? (ratingDistribution[star - 1] / totalFeedbacks) * 100 : 0
                           let barColor = "success"
                           if (star <= 2) barColor = "danger"
                           else if (star === 3) barColor = "warning"

                           return (
                              <div key={star} className="d-flex align-items-center mb-2">
                                 <div style={{ width: "60px", fontSize: "14px" }}>
                                    {star} <span className="text-warning">★</span>
                                 </div>
                                 <div className="flex-grow-1">
                                    <div className="progress" style={{ height: "8px", borderRadius: "4px" }}>
                                       <div
                                          className={`progress-bar bg-${barColor}`}
                                          role="progressbar"
                                          style={{ width: `${percentage}%` }}
                                          aria-valuenow={ratingDistribution[star - 1]}
                                          aria-valuemin="0"
                                          aria-valuemax={totalFeedbacks}
                                       ></div>
                                    </div>
                                 </div>
                                 <div style={{ width: "30px", textAlign: "right", fontSize: "14px" }}>
                                    {ratingDistribution[star - 1]}
                                 </div>
                              </div>
                           )
                        })}
                     </div>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      )
   }

   return (
      <div className="d-flex row w-100">
         <div className="col-md-3">
            <Sidebar />
         </div>
         <div className="col-md-8">
            <div className="d-flex flex-column">
               <AdminCustomNavbar />
               <div className="d-flex justify-content-between align-items-center mb-4">
                  <Title level={3} style={{ margin: 0 }}>
                     <span style={{ borderBottom: "3px solid #1890ff", paddingBottom: "5px" }}>Customer Feedbacks</span>
                  </Title>
                  <Button type="primary" onClick={fetchFeedbacks} icon={<ReloadOutlined />}>
                     Refresh Data
                  </Button>
               </div>

               {renderStats()}

               <Card className="mb-4 shadow-sm border-0">
                  <Card.Body>
                     <Row className="mb-4">
                        <Col md={4} className="mb-3 mb-md-0">
                           <Input
                              placeholder="Search by user, hotel or content"
                              prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
                              value={searchText}
                              onChange={(e) => handleSearch(e.target.value)}
                              allowClear
                              size="large"
                              style={{ width: "100%" }}
                           />
                        </Col>
                        <Col md={4} className="mb-3 mb-md-0">
                           <div className="d-flex align-items-center">
                              <Text style={{ marginRight: "8px", whiteSpace: "nowrap" }}>Select Hotel:</Text>
                              <select
                                 className="form-select"
                                 value={selectedHotel || ""}
                                 onChange={(e) => setSelectedHotel(e.target.value || null)}
                                 style={{ flex: 1 }}
                              >
                                 <option value="">All Hotels</option>
                                 {hotels.map((hotel) => (
                                    <option key={hotel?._id} value={hotel?._id}>
                                       {hotel?.hotelName}
                                    </option>
                                 ))}
                              </select>
                           </div>
                        </Col>
                        <Col md={4} className="d-flex justify-content-md-end align-items-center">
                           <Space size="middle">
                              <div>
                                 <Text style={{ marginRight: "8px" }}>Filter by rating:</Text>
                                 <Rate value={filterRating} onChange={handleRatingFilter} style={{ fontSize: "18px" }} />
                              </div>
                              <Button icon={<ReloadOutlined />} onClick={resetFilters} type="default">
                                 Reset Filters
                              </Button>
                           </Space>
                        </Col>
                     </Row>

                     <Divider style={{ margin: "0 0 16px 0" }} />

                     <Table
                        columns={columns}
                        dataSource={filteredData}
                        rowKey="_id"
                        pagination={{
                           ...pagination,
                           showSizeChanger: true,
                           showTotal: (total) => `Total ${total} items`,
                           pageSizeOptions: ["5", "10", "20", "50"],
                        }}
                        loading={loading}
                        onChange={handleTableChange}
                        bordered={false}
                        size="middle"
                        rowClassName={() => "custom-row-hover"}
                        style={{ overflowX: "auto" }}
                     />
                  </Card.Body>
               </Card>
            </div>
         </div>
      </div>
   )
}

// Add this CSS to your global styles or component
const styles = `
  .custom-row-hover:hover {
    background-color: #f5f5f5;
  }
  
  .ant-table-thead > tr > th {
    background-color: #f0f7ff !important;
    color: #1890ff;
    font-weight: 600;
  }
  
  .ant-pagination-item-active {
    border-color: #1890ff !important;
  }
  
  .ant-pagination-item-active a {
    color: #1890ff !important;
  }
`

export default FeedbackTable

