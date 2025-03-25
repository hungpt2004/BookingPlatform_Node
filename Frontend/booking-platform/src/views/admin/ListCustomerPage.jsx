import { useState, useEffect } from 'react';
import { Table, Switch, Tag, message, Modal, Button, Descriptions, Spin, Select } from 'antd';
import './customerModal.css';
import axiosInstance from '../../utils/AxiosInstance';
import { EyeOutlined } from '@ant-design/icons';

const ListCustomerPage = () => {
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isHotelsModalVisible, setIsHotelsModalVisible] = useState(false);
    const [ownerHotels, setOwnerHotels] = useState([]);
    const [hotelsLoading, setHotelsLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
    });

    const hotelColumns = [
        {
            title: 'Hotel Name',
            dataIndex: 'hotelName',
            key: 'hotelName',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Status',
            key: 'adminStatus',
            render: (_, record) => (
                <Tag color={record.adminStatus === 'APPROVED' ? 'green' : 'orange'}>
                    {record.adminStatus}
                </Tag>
            ),
        },
        {
            title: 'Stars',
            dataIndex: 'star',
            key: 'star',
            render: stars => `${stars} ★`,
        },
        {
            title: 'Price/Night',
            dataIndex: 'pricePerNight',
            key: 'price',
            render: price => `$${price}`,
        },
    ];

    const handleHotelsTableChange = (pagination) => {
        fetchOwnerHotels(selectedOwner._id, pagination.current);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                <Tag color={!record.isLocked ? 'green' : 'volcano'}>
                    {!record.isLocked ? 'Active' : 'Locked'}
                </Tag>
            ),
        },
        {
            title: 'Details',
            key: 'details',
            render: (_, record) => (
                <Button
                    icon={<EyeOutlined />}
                    onClick={() => showOwnerDetails(record)}
                >
                    View
                </Button>
            ),
        },
        {
            title: 'Ban Status',
            key: 'ban status',
            render: (_, record) => (
                <Select
                    value={!record.isLocked ? "active" : "locked"}
                    onChange={(value) => handleStatusChange(record._id, value)}
                    options={[
                        { label: "Locked", value: "locked" },
                        { label: "Active", value: "active" },
                    ]}
                />
            ),
        },
    ];

    const showOwnerDetails = (owner) => {
        setSelectedOwner(owner);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedOwner(null);
    };


    const fetchOwners = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/customer/get-all-customer');
            setOwners(response.data.users);
        } catch (error) {
            message.error('Failed to fetch owners');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, status) => {
        // Map select value to the isLocked boolean
        const newIsLocked = status === "locked";
        try {
            setOwners(prev => prev.map(owner =>
                owner._id === userId ? { ...owner, updating: true } : owner
            ));

            // Call the toggleLock API endpoint (ensure your backend route is set up accordingly)
            await axiosInstance.put(`/customer/toggle-lock/${userId}`, {
                isLocked: newIsLocked,
            });

            setOwners(prev => prev.map(owner =>
                owner._id === userId ? { ...owner, isLocked: newIsLocked, updating: false } : owner
            ));

            message.success('Status updated successfully');
        } catch (error) {
            message.error('Failed to update status');
            setOwners(prev => prev.map(owner =>
                owner._id === userId ? { ...owner, updating: false } : owner
            ));
        }
    };

    useEffect(() => {
        fetchOwners();
    }, []);

    return (
        <div className="d-flex">
            <div className="flex-grow-1">
                <div style={{ padding: '24px' }}>
                    <h2 style={{ marginBottom: '24px' }}>Hotel Owner Management</h2>
                    <Table
                        columns={columns}
                        dataSource={owners}
                        loading={loading}
                        rowKey="_id"
                        bordered
                        pagination={{ pageSize: 10 }}
                    />

                    <Modal
                        title={<div className="modal-title">Owner Details</div>}
                        open={isModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                        width={600}
                        centered
                        className="owner-modal"
                    >
                        {selectedOwner && (
                            <div className="owner-details-container">
                                <div className="owner-profile">
                                    {selectedOwner.image?.url ? (
                                        <img
                                            src={selectedOwner.image.url}
                                            alt="Profile"
                                            className="profile-img"
                                        />
                                    ) : (
                                        <div className="no-image">No Image</div>
                                    )}
                                </div>
                                <div className="owner-info">
                                    <p>
                                        <strong>Name:</strong> {selectedOwner.name}
                                    </p>
                                    <p>
                                        <strong>Email:</strong> {selectedOwner.email}
                                    </p>
                                    <p>
                                        <strong>Phone:</strong> {selectedOwner.phoneNumber || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Address:</strong> {selectedOwner.address || "N/A"}
                                    </p>
                                    <p>
                                        <strong>CMND:</strong> {selectedOwner.cmnd || "N/A"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </Modal>
                    <Modal
                        title={`${selectedOwner?.name}'s Hotels`}
                        open={isHotelsModalVisible}
                        onCancel={() => setIsHotelsModalVisible(false)}
                        footer={null}
                        width={1000}
                    >
                        <Spin spinning={hotelsLoading}>
                            <Table
                                columns={hotelColumns}
                                dataSource={ownerHotels}
                                rowKey="_id"
                                pagination={{
                                    ...pagination,
                                    showSizeChanger: false,
                                }}
                                onChange={handleHotelsTableChange}
                            />
                        </Spin>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default ListCustomerPage;
