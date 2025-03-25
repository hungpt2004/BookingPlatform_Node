import { useEffect, useState } from "react"
import { Table, Space, Input, Button as AntButton, Modal } from "antd"
import { Button, Container, Row, Col, Form } from "react-bootstrap"
import { SearchOutlined, EditOutlined, DeleteOutlined, FileImageOutlined, PlusOutlined } from "@ant-design/icons"
import Sidebar from "../../components/navbar/OwnerSidebar"
import { AdminCustomNavbar } from "../../components/navbar/AdminCustomNavbar"
import { CustomSuccessToast } from "../../components/toast/CustomToast"
import { CustomFailedToast } from "../../components/toast/CustomToast"
import axiosInstance from "../../utils/AxiosInstance"
import { useNavigate, Link } from "react-router-dom"
import DeleteHotelModal from "../../components/modal/DeleteHotelModal"
import { FaTimes, FaTimesCircle } from "react-icons/fa"

const HotelManagementPage = () => {
   const [hotels, setHotels] = useState([])
   const [error, setError] = useState('')
   const [selectedHotel, setSelectedHotel] = useState(null)
   const [showDeleteModal, setShowDeleteModal] = useState(false)
   const [showUpdateModal, setShowUpdateModal] = useState(false)
   const [deleteInput, setDeleteInput] = useState('')
   const [updateData, setUpdateData] = useState({})
   const [showImageModal, setShowImageModal] = useState(false);
   const [hotelImages, setHotelImages] = useState([]);
   const [selectedFiles, setSelectedFiles] = useState([]);
   const [isUploading, setIsUploading] = useState(false);
   const [deletingImages, setDeletingImages] = useState(new Set());


   const navigate = useNavigate()

   const getOwnerHotel = async () => {
      setError('')
      try {
         const response = await axiosInstance.get('/hotel/get-owned-hotel')
         if (response.data?.hotels) {
            setHotels(response.data.hotels)
            CustomSuccessToast("Hotels loaded successfully")
         }
      } catch (error) {
         CustomFailedToast(error.response?.data?.message || "Failed to load hotels")
      }
   }


   useEffect(() => { getOwnerHotel() }, [])

   // Delete Hotel Logic
   const handleDeleteConfirm = async () => {
      try {
         await axiosInstance.delete(`/hotel/delete/${selectedHotel._id}`)
         await getOwnerHotel()
         CustomSuccessToast("Hotel deleted successfully")
         setShowDeleteModal(false)
      } catch (error) {
         CustomFailedToast(error.response?.data?.message || "Delete failed")
      }
   }

   const validateVietnamesePhone = (phone) => {
      // Regular expression for Vietnamese phone numbers
      const regex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
      return regex.test(phone);
   };

   // Update Hotel Logic
   const handleUpdateSubmit = async () => {
      // Validate phone number
      if (!validateVietnamesePhone(updateData.phoneNumber)) {
         setError('Invalid Vietnamese phone number format');
         return;
      }
      try {
         await axiosInstance.put(`/hotel/update/${selectedHotel._id}`, updateData);
         await getOwnerHotel();
         CustomSuccessToast("Hotel updated successfully");
         setShowUpdateModal(false);
         setError('');
      } catch (error) {
         CustomFailedToast(error.response?.data?.message || "Update failed");
      }
   };

   const handleViewImages = async (record) => {
      setSelectedHotel(record);
      try {
         const response = await axiosInstance.get(`/hotel/get-images/${record._id}`);
         if (response.data.images) {
            setHotelImages(response.data.images);
            setShowImageModal(true);
         }
      } catch (error) {
         CustomFailedToast(error.response?.data?.message || "Failed to load images");
      }
   };

   // Image upload
   const handleImageUpload = async (files) => {
      try {
         // Validate file types
         const invalidFiles = files.filter(file =>
            !['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)
         );

         if (invalidFiles.length > 0) {
            CustomFailedToast("Only JPG/PNG images are allowed");
            return;
         }

         setIsUploading(true);
         const formData = new FormData();
         files.forEach(file => formData.append('images', file));

         await axiosInstance.post(
            `/hotel/add-img/${selectedHotel._id}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
         );

         const newImagesResponse = await axiosInstance.get(`/hotel/get-images/${selectedHotel._id}`);
         setHotelImages(newImagesResponse.data.images);
         CustomSuccessToast("Images added successfully");
      } catch (error) {
         CustomFailedToast(error.response?.data?.message || "Image upload failed");
      } finally {
         setIsUploading(false);
      }
   };

   // Delete Image
   const handleDeleteImage = async (imageUrl) => {
      try {
         setDeletingImages(prev => new Set([...prev, imageUrl]));

         await axiosInstance.delete(`/hotel/delete-img/${selectedHotel._id}`, {
            data: { imageUrl }
         });

         setHotelImages(prev => prev.filter(img => img !== imageUrl));
         CustomSuccessToast("Image deleted successfully");
      } catch (error) {
         CustomFailedToast(error.response?.data?.message || "Delete failed");
      } finally {
         setDeletingImages(prev => {
            const newSet = new Set(prev);
            newSet.delete(imageUrl);
            return newSet;
         });
      }
   };

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
         sorter: (a, b) => (a.address || "").localeCompare(b.address || "") // Sort by address if available
      },
      {
         title: "Rating",
         dataIndex: "rating",
         key: "rating",
         sorter: (a, b) => a.rating - b.rating,
      },
      {
         title: "Star",
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
               <Button variant="outline-primary" size="sm" onClick={() => {
                  setSelectedHotel(record)
                  setUpdateData({
                     phoneNumber: record.phoneNumber,
                     star: record.star,
                     ownerStatus: record.ownerStatus
                  })
                  setShowUpdateModal(true)
               }}>
                  <EditOutlined /> Update
               </Button>
               <Button variant="outline-danger" size="sm" onClick={() => {
                  setSelectedHotel(record)
                  setShowDeleteModal(true)
               }}>
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
            <div className="col-md-2">
            </div>
            <div className="col-md-8">
               <div className="d-flex flex-column">
                  <Container fluid className="mt-4">
                     <Row className="mb-4">
                        <Col>
                           <h2>Hotel Management</h2>
                        </Col>
                        <Col className="text-end">
                           <Button variant="success" size="lg" style={{ width: "fit-content" }} onClick={() => navigate('/create-hotel')}>
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
                     <DeleteHotelModal
                        show={showDeleteModal}
                        onHide={() => setShowDeleteModal(false)}
                        hotel={selectedHotel}
                        onConfirm={handleDeleteConfirm}
                     />
                     <Modal
                        title="Update Hotel Details"
                        visible={showUpdateModal}
                        onCancel={() => setShowUpdateModal(false)}
                        footer={[
                           <Button key="back" onClick={() => setShowUpdateModal(false)} className="me-2 btn-secondary">
                              Cancel
                           </Button>,
                           <Button
                              key="submit"
                              variant="primary"
                              onClick={handleUpdateSubmit}
                           >
                              Save Changes
                           </Button>
                        ]}
                     >
                        <Form>
                           <Form.Group className="mb-3">
                              <Form.Label>Phone Number</Form.Label>
                              <Form.Control
                                 type="tel"
                                 value={updateData.phoneNumber || ''}
                                 onChange={(e) => {
                                    setUpdateData({ ...updateData, phoneNumber: e.target.value });
                                    setError(''); // Clear error on change
                                 }}
                                 isInvalid={!!error}
                                 placeholder="Enter Vietnamese phone number"
                              />
                              <Form.Text className="text-muted">
                                 Valid formats: 09xxxxxxxx, 03xxxxxxxx, 07xxxxxxxx, 08xxxxxxxx, 84xxxxxxxxx
                              </Form.Text>
                              {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
                           </Form.Group>
                           <Form.Group className="mb-3">
                              <Form.Label>Star Rating</Form.Label>
                              <Form.Select
                                 value={updateData.star}
                                 onChange={(e) => setUpdateData({ ...updateData, star: e.target.value })}
                              >
                                 {[1, 2, 3, 4, 5].map(num => (
                                    <option key={num} value={num}>{num} Stars</option>
                                 ))}
                              </Form.Select>
                           </Form.Group>

                           <Form.Group className="mb-3">
                              <Form.Label>Status</Form.Label>
                              <Form.Select
                                 value={updateData.ownerStatus}
                                 onChange={(e) => setUpdateData({ ...updateData, ownerStatus: e.target.value })}
                              >
                                 <option value="ACTIVE">Active</option>
                                 <option value="NONACTIVE">Inactive</option>
                              </Form.Select>
                           </Form.Group>
                        </Form>
                     </Modal>

                     <Modal
                        title={`Images for ${selectedHotel?.hotelName}`}
                        visible={showImageModal}
                        onCancel={() => {
                           setShowImageModal(false);
                           setSelectedFiles([]);
                        }}
                        width={800}
                        footer={[
                           <div key="footer" className="d-flex justify-content-end w-100">
                              <input
                                 type="file"
                                 multiple
                                 accept="image/jpeg, image/png"
                                 onChange={(e) => {
                                    const files = Array.from(e.target.files);
                                    if (files.length > 0) {
                                       handleImageUpload(files);
                                    }
                                 }}
                                 style={{ display: 'none' }}
                                 id="imageUpload"
                                 disabled={isUploading}
                              />
                              <label
                                 htmlFor="imageUpload"
                                 className={`btn btn-${isUploading ? 'secondary' : 'primary'}`}
                                 style={{ cursor: isUploading ? 'not-allowed' : 'pointer' }}
                              >
                                 {isUploading ? (
                                    <>
                                       <span className="spinner-border spinner-border-sm me-2" role="status" />
                                       Uploading...
                                    </>
                                 ) : (
                                    <>
                                       <PlusOutlined /> Select Images
                                    </>
                                 )}
                              </label>
                           </div>
                        ]}
                     >
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                           {hotelImages.map((img, index) => (
                              <div key={index} style={{ position: 'relative' }}>
                                 <img
                                    src={img}
                                    alt={`Hotel image ${index + 1}`}
                                    style={{
                                       width: '100%',
                                       height: '200px',
                                       objectFit: 'cover',
                                       borderRadius: '8px',
                                       opacity: deletingImages.has(img) ? 0.5 : 1
                                    }}
                                 />
                                 {hotelImages.length > 5 && (
                                    <FaTimesCircle
                                       className="position-absolute top-0 end-0 m-1 text-danger bg-white rounded-circle"
                                       style={{
                                          cursor: 'pointer',
                                          width: "1.5rem",
                                          height: "1.5rem",
                                          padding: "2px"
                                       }}
                                       onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteImage(img);
                                       }}
                                    />
                                 )}
                                 {deletingImages.has(img) && (
                                    <div className="position-absolute top-50 start-50 translate-middle">
                                       <div className="spinner-border text-primary" role="status">
                                          <span className="visually-hidden">Loading...</span>
                                       </div>
                                    </div>
                                 )}
                              </div>
                           ))}
                           {hotelImages.length === 0 && !isUploading && (
                              <div className="w-100 text-center py-5">
                                 <p className="text-muted">No images available</p>
                              </div>
                           )}
                        </div>
                     </Modal>
                  </Container>
               </div>
            </div>
         </div>
      </>
   )
}
export default HotelManagementPage
