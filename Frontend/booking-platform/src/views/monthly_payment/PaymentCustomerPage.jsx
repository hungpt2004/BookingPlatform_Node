"use client"

import { useState, useEffect } from "react"
import { Card, Select, Table, Row, Col, Typography, Button, Statistic, Space, Tag, Input } from "antd"
import { SearchOutlined, UserOutlined, ExportOutlined } from "@ant-design/icons"
import axiosInstance from "../../utils/AxiosInstance"
import { CustomFailedToast, CustomToast } from "../../components/toast/CustomToast"
import { BASE_URL } from "../../utils/Constant"
import { formatCurrencyVND } from "../../utils/FormatPricePrint"

const { Title } = Typography
const { Option } = Select

const PaymentCustomerPage = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUserType, setSelectedUserType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [error, setError] = useState("")

  // Fetch data function
  const fetchData = async () => {
    setLoading(true)
    setError("")

    try {
      const params = {}

      if (searchTerm) {
        params.search = searchTerm
      }

      if (selectedUserType !== "all") {
        params.userType = selectedUserType
      }

      if (selectedStatus !== "all") {
        params.status = selectedStatus
      }

      // Replace with your actual API endpoint for users
      const response = await axiosInstance.get(`${BASE_URL}/customer/get-all-user`, { params })

      if (response.data && response.data.users) {
        const apiData = response.data.users.map((user, index) => ({
          key: index + 1,
          id: user._id,
          name: user.fullName || `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phoneNumber,
          userType: user.userType,
          status: user.status,
          totalBookings: user.totalBookings || 0,
          totalSpent: user.totalSpent || 0,
          registrationDate: user.createdAt ? new Date(user.createdAt).toISOString().split("T")[0] : null,
        }))

        setData(apiData)
        setTotalUsers(response.data.total || apiData.length)
        console.log("User data fetched successfully")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      setError(error.response?.data?.message || "Failed to fetch user data")
      CustomFailedToast(error.response?.data?.message || "Failed to fetch user data")
    }

    setLoading(false)
  }

  // Fetch data initially and when filters change
  useEffect(() => {
    fetchData()
  }, [selectedUserType, selectedStatus])

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 180,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 150,
    },
    {
      title: "User Type",
      dataIndex: "userType",
      key: "userType",
      width: 120,
      filters: [
        { text: "Customer", value: "CUSTOMER" },
        { text: "Owner", value: "OWNER" },
        { text: "Admin", value: "ADMIN" },
      ],
      onFilter: (value, record) => record.userType === value,
      render: (type) => <Tag color={type === "ADMIN" ? "purple" : type === "OWNER" ? "blue" : "green"}>{type}</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      filters: [
        { text: "Active", value: "ACTIVE" },
        { text: "Inactive", value: "INACTIVE" },
        { text: "Suspended", value: "SUSPENDED" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => (
        <Tag color={status === "ACTIVE" ? "green" : status === "INACTIVE" ? "orange" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Total Bookings",
      dataIndex: "totalBookings",
      key: "totalBookings",
      width: 140,
      sorter: (a, b) => a.totalBookings - b.totalBookings,
    },
    {
      title: "Total Spent",
      dataIndex: "totalSpent",
      key: "totalSpent",
      width: 160,
      sorter: (a, b) => a.totalSpent - b.totalSpent,
      render: (value) => formatCurrencyVND(value),
    },
    {
      title: "Registration Date",
      dataIndex: "registrationDate",
      key: "registrationDate",
      width: 150,
    },
    {
      title: "Actions",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" icon={<UserOutlined />} onClick={() => handleViewUserDetails(record.id)}>
            View
          </Button>
        </Space>
      ),
    },
  ]

  // Handle view user details
  const handleViewUserDetails = (userId) => {
    console.log(`View details for user: ${userId}`)
    // Implement navigation to user details page or modal
    // For example: history.push(`/users/${userId}`);
  }

  // Calculate summary statistics
  const activeUsers = data.filter((user) => user.status === "ACTIVE").length
  const customerUsers = data.filter((user) => user.userType === "CUSTOMER").length
  const ownerUsers = data.filter((user) => user.userType === "OWNER").length

  return (
    <>
      <CustomToast />
      <div className="d-flex">
        <div className="content w-100">
          <div style={{ padding: "24px" }}>
            <Title level={3}>User Management</Title>

            {/* Filters */}
            <Card style={{ marginBottom: "24px" }}>
              <Row gutter={24} align="middle">
                <Col xs={24} sm={24} md={8} lg={8}>
                  <div style={{ marginBottom: "8px" }}>Search User</div>
                  <Input
                    placeholder="Search by name, email or phone"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: "100%" }}
                    allowClear
                  />
                </Col>
                <Col xs={24} sm={12} md={6} lg={4}>
                  <div style={{ marginBottom: "8px" }}>User Type</div>
                  <Select style={{ width: "100%" }} value={selectedUserType} onChange={setSelectedUserType}>
                    <Option value="all">All Types</Option>
                    <Option value="CUSTOMER">Customer</Option>
                    <Option value="OWNER">Owner</Option>
                    <Option value="ADMIN">Admin</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={6} lg={4}>
                  <div style={{ marginBottom: "8px" }}>Status</div>
                  <Select style={{ width: "100%" }} value={selectedStatus} onChange={setSelectedStatus}>
                    <Option value="all">All Status</Option>
                    <Option value="ACTIVE">Active</Option>
                    <Option value="INACTIVE">Inactive</Option>
                    <Option value="SUSPENDED">Suspended</Option>
                  </Select>
                </Col>
                <Col
                  xs={24}
                  md={24}
                  lg={8}
                  style={{ display: "flex", justifyContent: "flex-end", marginTop: { xs: "16px", lg: "28px" } }}
                >
                  <Button type="primary" icon={<SearchOutlined />} onClick={fetchData} loading={loading}>
                    Search
                  </Button>
                  <Button
                    style={{ marginLeft: "8px" }}
                    icon={<ExportOutlined />}
                    onClick={() => console.log("Export user data")}
                  >
                    Export
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* Statistics Cards */}
            <Row gutter={16} style={{ marginBottom: "24px" }}>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="Total Users" value={totalUsers} precision={0} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="Active Users" value={activeUsers} precision={0} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="Customers" value={customerUsers} precision={0} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card>
                  <Statistic title="Owners" value={ownerUsers} precision={0} />
                </Card>
              </Col>
            </Row>

            {/* Error message */}
            {error && <div style={{ color: "red", marginBottom: "16px" }}>{error}</div>}

            {/* Table */}
            <Card>
              <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                scroll={{ x: 1300 }}
                pagination={{
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} records`,
                  defaultPageSize: 10,
                  pageSizeOptions: ["10", "20", "50"],
                }}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={3}>
                        <strong>Total</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={3}>
                        <strong>{totalUsers} users</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={4} colSpan={5}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentCustomerPage

