"use client"

import { useEffect, useState } from "react"
import { Table, Space, Input, Button as AntButton } from "antd"
import { Button, Container, Row, Col } from "react-bootstrap"
import { SearchOutlined, EditOutlined, DeleteOutlined, FileImageOutlined, PlusOutlined } from "@ant-design/icons"
import Sidebar from "../../components/navbar/AdminSidebar"
import { AdminCustomNavbar } from "../../components/navbar/AdminCustomNavbar"
import { CustomSuccessToast } from "../../components/toast/CustomToast"
import axiosInstance from "../../utils/AxiosInstance"
import { useNavigate } from "react-router-dom"

const HotelManagementPage = () => {
   // Sample data - in a real app, this would come from an API
   const [hotels, setHotels] = useState([])
   const [error, setError] = useState('')
   const navigate = useNavigate();

   const getOwnerHotel = async (req, res) => {

      setError('')
  
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

    useEffect(() => {
      getOwnerHotel();
    }, [])

   // Handlers for actions
   const handleUpdate = (record) => {
      console.log("Update hotel:", record)
      // Implement update logic here
   }

   const handleDelete = (record) => {
      console.log("Delete hotel:", record)
      // Implement delete logic here
   }

   const handleViewImages = (record) => {
      console.log("View images for hotel:", record)
      // Implement image viewing logic here
   }

   const handleCreateHotel = () => {
      console.log("Create new hotel")
      // Implement hotel creation logic here
   }

   // Table columns configuration
   const columns = [
      {
         title: "Hotel Name",
         dataIndex: "hotelName",
         key: "hotelName",
         sorter: (a, b) => a.hotelName.localeCompare(b.hotelName),
         filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
               <Input
                  placeholder="Search hotel name"
                  value={selectedKeys[0]}
                  onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                  onPressEnter={() => confirm()}
                  style={{ width: 188, marginBottom: 8, display: "block" }}
               />
               <Space>
                  <AntButton
                     type="primary"
                     onClick={() => confirm()}
                     icon={<SearchOutlined />}
                     size="small"
                     style={{ width: 90 }}
                  >
                     Search
                  </AntButton>
                  <AntButton onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
                     Reset
                  </AntButton>
               </Space>
            </div>
         ),
         filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
         onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
      },
      {
         title: "Location",
         dataIndex: "address",
         key: "address",
         sorter: (a, b) => a.address.localeCompare(b.address),
      },
      {
         title: "Rating",
         dataIndex: "rating",
         key: "rating",
         sorter: (a, b) => a.rating - b.rating,
      },
      {
         title: "Start",
         dataIndex: "star",
         key: "star",
         sorter: (a, b) => a.star - b.star,
      },
      {
         title: "Phone Number",
         dataIndex: "phoneNumber",
         key: "phoneNumber",
         sorter: (a, b) => a.phoneNumber - b.phoneNumber,
      },
      {
         title: "Status",
         dataIndex: "ownerStatus",
         key: "ownerStatus",
         sorter: (a, b) => a.pricePerNight - b.pricePerNight,
      },
      {
         title: "Actions",
         key: "actions",
         render: (_, record) => (
            <Space size="middle">
               <Button variant="outline-primary" size="sm" onClick={() => handleUpdate(record)}>
                  <EditOutlined /> Update
               </Button>
               <Button variant="outline-danger" size="sm" onClick={() => handleDelete(record)}>
                  <DeleteOutlined /> Delete
               </Button>
               <Button variant="outline-info" size="sm" onClick={() => handleViewImages(record)}>
                  <FileImageOutlined /> Images
               </Button>
            </Space>
         ),
      },
   ]

   return (
      <>
         <div className="d-flex row">
            <div className="col-md-3">
               <Sidebar />
            </div>
            <div className="col-md-8">
               <div className="d-flex flex-column">
                  <AdminCustomNavbar/>
                  <Container fluid className="mt-4">
                  <Row className="mb-4">
                     <Col>
                        <h2>Hotel Management</h2>
                     </Col>
                     <Col className="text-end">
                        <Button variant="success" size="lg" onClick={() => navigate('/create-hotel')}>
                           <PlusOutlined /> Thêm khách sạn mới
                        </Button>
                     </Col>
                  </Row>
                  <Row>
                     <Col>
                        <Table
                           columns={columns}
                           dataSource={hotels}
                           rowKey="id"
                           pagination={{ pageSize: 10 }}
                           bordered
                           scroll={{ x: true }}
                        />
                     </Col>
                  </Row>
               </Container>
               </div>
            </div>
         </div>
      </>
   )
}

export default HotelManagementPage

