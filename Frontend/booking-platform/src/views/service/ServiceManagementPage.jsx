/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import {
  Table,
  Space,
  Rate,
  Input,
  Button,
  Tag,
  DatePicker,
  Typography,
  Divider,
} from "antd";
import { Container, Row, Col, Card } from "react-bootstrap";
import {
  SearchOutlined,
  ReloadOutlined,
  UserOutlined,
  HomeOutlined,
  CalendarOutlined,
  EyeOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Sidebar from "../../components/navbar/OwnerSidebar";
import { AdminCustomNavbar } from "../../components/navbar/AdminCustomNavbar";
import { BASE_URL } from "../../utils/Constant";
import {
  CustomFailedToast,
  CustomSuccessToast,
} from "../../components/toast/CustomToast";
import axiosInstance from "../../utils/AxiosInstance";
import axios from "axios";
import { services } from "../../components/data/HotelOption";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const ServiceTable = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [searchText, setSearchText] = useState("");
  const [filterRating, setFilterRating] = useState(null);
  // Add a new state for selected hotel after the filterRating state
  const [selectedHotel, setSelectedHotel] = useState("");
  const [hotels, setHotels] = useState([]);

  feedbacks.forEach((item) => console.log(item.name));

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/hotel-service/get-all-hotel-services/${selectedHotel}`
      );

      if (typeof response.data === "string") {
        setFeedbacks([]); // Nếu không có feedback, đặt danh sách rỗng
        setPagination({ ...pagination, total: 0 });
        return;
      }

      setFeedbacks(response.data.hotelServices.services); // Cập nhật danh sách feedbacks
      setUser(response.data.userFeedback);
      setPagination({
        ...pagination,
        total: response.data.hotelServices.services.length,
      });
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setFeedbacks([]); // Đảm bảo UI không bị lỗi khi gặp lỗi request
    } finally {
      setLoading(false);
    }
  };

  const getOwnerHotel = async (req, res) => {
    try {
      const response = await axiosInstance.get("/hotel/get-owned-hotel");

      if (response.data && response.data.hotels) {
        setHotels(response.data.hotels);
        CustomSuccessToast("Get owner hotel success");
      }
    } catch (error) {
      if (error.response.data.message) {
        CustomFailedToast(error.response.data.message);
      }
    }
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleRatingFilter = (value) => {
    setFilterRating(value);
    setPagination({ ...pagination, current: 1 });
  };

  // Update the resetFilters function to also reset the hotel filter
  const resetFilters = () => {
    setSearchText("");
    setSelectedHotel(null);
    setPagination({ ...pagination, current: 1 });
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [pagination.current, pagination.pageSize, selectedHotel]);

  useEffect(() => {
    getOwnerHotel();
  }, []);

  // Update the filteredData function to also filter by selected hotel
  const filteredData = () => {
    return (
      services?.map((service) => {
        const matchesSearch =
          !searchText ||
          service.name.toLowerCase().includes(searchText.toLowerCase());

        const matchesPrice =
          !priceRange ||
          (service.price >= priceRange.min && service.price <= priceRange.max);

        return matchesSearch && matchesPrice;
      }) || []
    );
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => (
        <Space direction="vertical" size="small" style={{ marginBottom: 0 }}>
          <Text strong style={{ fontSize: "14px" }}>
            <UserOutlined style={{ marginRight: 8 }} />
            {name}
          </Text>
        </Space>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (des) => (
        <Space direction="vertical" size="small" style={{ marginBottom: 0 }}>
          <Text strong style={{ fontSize: "14px" }}>
            <HomeOutlined style={{ marginRight: 8 }} />
            {des}
          </Text>
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <Space direction="vertical" size="small" style={{ marginBottom: 0 }}>
          <Text strong style={{ fontSize: "14px" }}>
            <HomeOutlined style={{ marginRight: 8 }} />
            {price}
          </Text>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" icon={<EyeOutlined />} size="small">
            Add
          </Button>
          <Button type="default" icon={<MessageOutlined />} size="small">
            Update
          </Button>
          <Button type="default" icon={<MessageOutlined />} size="small">
            Delete
          </Button>
        </Space>
      ),
      width: 150,
      align: "center",
    },
  ];

  const dataSource = feedbacks.map((service) => ({
    key: service._id,
    name: service.name,
    description: service.description,
    price: service.price,
  }));

  return (
    <div className="d-flex row w-100">
      <div className="col-md-3"></div>
      <div className="col-md-8">
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Title level={3} style={{ margin: 0 }}>
              <span
                style={{
                  borderBottom: "3px solid #1890ff",
                  paddingBottom: "5px",
                }}
              >
                Customer Feedbacks
              </span>
            </Title>
            <Button
              type="primary"
              onClick={fetchFeedbacks}
              icon={<ReloadOutlined />}
            >
              Refresh Data
            </Button>
          </div>

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
                    <Text style={{ marginRight: "8px", whiteSpace: "nowrap" }}>
                      Select Hotel:
                    </Text>
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
                <Col
                  md={4}
                  className="d-flex justify-content-md-end align-items-center"
                >
                  <Space size="middle">
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={resetFilters}
                      type="default"
                    >
                      Reset Filters
                    </Button>
                  </Space>
                </Col>
              </Row>

              <Divider style={{ margin: "0 0 16px 0" }} />

              <Table
                columns={columns}
                dataSource={dataSource}
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
  );
};

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
`;

export default ServiceTable;
