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
import { SearchOutlined, PrinterOutlined, ExportOutlined } from '@ant-design/icons';
import { AdminCustomNavbar } from '../../components/navbar/AdminCustomNavbar';
import Sidebar from '../../components/navbar/CustomeSidebar';
import AdminSideBar from '../../components/navbar/AdminSidebarSecond';

const { Title } = Typography;
const { Option } = Select;

const CustomPartnerPage = () => {
  // State for filters
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month by default
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Current year by default
  const [selectedHotel, setSelectedHotel] = useState('all');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  // Demo hotels list
  const hotels = [
    { id: '1', name: 'Sài Gòn Luxury Hotel' },
    { id: '2', name: 'Hà Nội Grand Plaza' },
    { id: '3', name: 'Đà Nẵng Beach Resort' },
    { id: '4', name: 'Hội An Ancient House' },
    { id: '5', name: 'Nha Trang Seaside Hotel' },
  ];

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

  // Mock data fetch function
  const fetchData = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate mock data
      const mockData = [];
      for (let i = 1; i <= 20; i++) {
        const hotelId = Math.floor(Math.random() * 5) + 1;
        const hotel = hotels.find(h => h.id === hotelId.toString());
        
        mockData.push({
          key: i,
          id: `INV-${selectedYear}${selectedMonth.toString().padStart(2, '0')}${i.toString().padStart(3, '0')}`,
          hotelId: hotelId.toString(),
          hotelName: hotel.name,
          reservations: Math.floor(Math.random() * 100) + 10,
          revenue: Math.floor(Math.random() * 100000000) + 5000000,
          commission: Math.floor(Math.random() * 10000000) + 500000,
          paymentStatus: Math.random() > 0.3 ? 'PAID' : 'PENDING',
          paymentDate: Math.random() > 0.3 ? `${selectedYear}-${selectedMonth}-${Math.floor(Math.random() * 28) + 1}` : null,
        });
      }
      
      // Filter by selected hotel if not 'all'
      const filteredData = selectedHotel === 'all' 
        ? mockData 
        : mockData.filter(item => item.hotelId === selectedHotel);
      
      setData(filteredData);
      setLoading(false);
    }, 1000);
  };

  // Fetch data initially and when filters change
  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear, selectedHotel]);

  // Table columns
  const columns = [
    {
      title: 'Mã thanh toán',
      dataIndex: 'id',
      key: 'id',
      width: 200,
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Khách sạn',
      dataIndex: 'hotelName',
      key: 'hotelName',
      width: 240,
    },
    {
      title: 'Số lượng đặt phòng',
      dataIndex: 'reservations',
      key: 'reservations',
      width: 150,
      sorter: (a, b) => a.reservations - b.reservations,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 180,
      sorter: (a, b) => a.revenue - b.revenue,
      render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
    },
    {
      title: 'Phí hoa hồng',
      dataIndex: 'commission',
      key: 'commission',
      width: 180,
      sorter: (a, b) => a.commission - b.commission,
      render: (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
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
        <Space size="small">
          <Button size="small" icon={<PrinterOutlined />} />
          <Button size="small" icon={<ExportOutlined />} />
        </Space>
      ),
    },
  ];

  // Calculate summary statistics
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalCommission = data.reduce((sum, item) => sum + item.commission, 0);
  const totalReservations = data.reduce((sum, item) => sum + item.reservations, 0);
  const paidReservations = data.filter(item => item.paymentStatus === 'PAID').length;

  return (
    <>
      <div className='d-flex'>
         <AdminSideBar/>
         <div className='content w-100'>
            <AdminCustomNavbar/>
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
              {hotels.map(hotel => (
                <Option key={hotel.id} value={hotel.id}>{hotel.name}</Option>
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
              formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng hoa hồng"
              value={totalCommission}
              precision={0}
              formatter={(value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Số lượng đặt phòng"
              value={totalReservations}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đã thanh toán"
              value={paidReservations}
              suffix={`/ ${data.length}`}
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
                <Table.Summary.Cell index={2}><strong>{totalReservations}</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue)}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <strong>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalCommission)}</strong>
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

export default CustomPartnerPage;