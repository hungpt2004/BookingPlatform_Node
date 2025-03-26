import { useState, useEffect } from 'react';
import { Table, Switch, Tag, message, Modal, Button, Descriptions, Spin, Select } from 'antd';
import axiosInstance from '../../utils/AxiosInstance';
import { EyeOutlined } from '@ant-design/icons';

const OwnerManagementPage = () => {
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
    const fetchOwnerHotels = async (ownerId, page = 1) => {
        setHotelsLoading(true);
        try {
            const response = await axiosInstance.get(`/hotel/get-owner-hotel/${ownerId}`, {
                params: {
                    page: page,
                    limit: pagination.pageSize
                }
            });

            setOwnerHotels(response.data.hotels);
            setPagination(prev => ({
                ...prev,
                total: response.data.total,
                current: page,
            }));
        } catch (error) {
            message.error('Failed to fetch hotels');
        } finally {
            setHotelsLoading(false);
        }
    };

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
            const response = await axiosInstance.get('/customer/get-all-owner');
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
                        title="Owner Details"
                        open={isModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                        width={800}
                    >
                        {selectedOwner && (
                            <>
                                <Descriptions bordered column={2}>
                                    <Descriptions.Item label="Profile Image" span={2}>
                                        {selectedOwner.image?.url ? (
                                            <img
                                                src={selectedOwner.image.url}
                                                alt="Profile"
                                                style={{
                                                    width: 100,
                                                    height: 100,
                                                    borderRadius: 8
                                                }}
                                            />
                                        ) : 'No image'}
                                    </Descriptions.Item>

                                    <Descriptions.Item label="Name">{selectedOwner.name}</Descriptions.Item>
                                    <Descriptions.Item label="Email">{selectedOwner.email}</Descriptions.Item>
                                    <Descriptions.Item label="Phone">{selectedOwner.phoneNumber || 'N/A'}</Descriptions.Item>
                                    <Descriptions.Item label="Address">{selectedOwner.address || 'N/A'}</Descriptions.Item>
                                    <Descriptions.Item label="CMND ">{selectedOwner.cmnd || 'N/A'}</Descriptions.Item>
                                    <Descriptions.Item label="Status">
                                        <Tag color={selectedOwner.isVerified ? 'green' : 'red'}>
                                            {selectedOwner.isVerified ? 'Verified' : 'Unverified'}
                                        </Tag>
                                    </Descriptions.Item>
                                </Descriptions>
                                <div className='d-flex justify-content-center mt-2' >
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={() => {
                                            fetchOwnerHotels(selectedOwner._id);
                                            setIsHotelsModalVisible(true);
                                        }}
                                    >
                                        Hotel Owned List
                                    </Button>
                                </div>
                            </>
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

export default OwnerManagementPage;
