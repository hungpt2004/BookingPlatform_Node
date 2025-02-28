import { useEffect, useState } from "react";
import axiosInstance from '../../utils/AxiosInstance';
import bg1 from "../../assets/images/hero/bg5.jpg";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import { toast } from "react-toastify";
import { FiCamera } from "../../assets/icons/vander";

export default function CustomerProfileSetting() {

    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [name, setName] = useState("");
    const [cmnd, setCmnd] = useState("");
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const response = await axiosInstance.get("/customer/current-user");
            const userData = response.data.user;
            setPhone(userData.phone || "");
            setAddress(userData.address || "");
            setAvatar(userData.image?.url || null);
            setName(userData.name || "");
            setCmnd(userData.cmnd || "");
            setId(userData._id);
            setEmail(userData.email);
        } catch (error) {
            toast.error("Error fetching user data");
            console.log(error);
        }
    };
    // Handle profile update
    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        const updates = {};
        if (phone) updates.phone = phone;
        if (address) updates.address = address;
        if (name) updates.name = name;
        if (cmnd) updates.cmnd = cmnd;
        if (Object.keys(updates).length === 0) {
            toast.error("No data provided for update");
            return;
        }

        setIsUpdating(true);
        try {
            await axiosInstance.patch(`/customer/update-profile`, updates);
            toast.success("Profile updated successfully");
            await fetchCurrentUser(); // Will update both profile and navbar
            console.log("Profile updated successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update profile");
        } finally {
            setIsUpdating(false);
        }
    };

    // Handle avatar update
    const handleAvatarUpdate = async (e) => {
        e.preventDefault();
        if (!avatarFile) {
            toast.error("Please select an image");
            return;
        }

        const formData = new FormData();
        formData.append("image", avatarFile);

        setIsUploadingAvatar(true);
        try {
            const response = await axiosInstance.put(`/customer/update-avatar/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
            setAvatar(response.data.image.url);
            toast.success("Avatar updated successfully");
            setShowModal(false);
            setAvatarFile(null);
            await fetchCurrentUser(); // Will update both profile and navbar
        } catch (error) {
            toast.error("Failed to update avatar");
            console.log(error);
        } finally {
            setIsUploadingAvatar(false);
        }
    };


    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
    return (
        <>
            <CustomNavbar />
            <div className="container">
                <div className="position-relative">
                    <img
                        src={bg1}
                        className="w-100 rounded shadow"
                        alt="Profile banner"
                        style={{ height: "250px", objectFit: "cover" }}
                    />
                    <div className="d-flex align-items-end position-absolute" style={{ bottom: "-40px", left: "20px" }}>
                        <div className="position-relative d-inline-block">
                            <img
                                src={avatar || "/default-avatar.png"}
                                alt="Profile"
                                className="rounded-circle border shadow"
                                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                            />
                            <button
                                className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle"
                                onClick={() => setShowModal(true)}
                                style={{ width: "32px", height: "32px", padding: "0" }}
                            >
                                <FiCamera className="m-auto" />
                            </button>
                        </div>
                        <div className="ms-3 mb-0">
                            <h5 className="mb-1">{"Mr: " + name || "User Name"}</h5>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Section Below Avatar */}
            <div className="container mt-5">
                <div className="rounded shadow p-4">
                    <form onSubmit={handleUpdateProfile}>
                        <h5>Personal Detail :</h5>
                        <div className="row mt-4">
                            {/* 1 module update */}
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={name || ""}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Email</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={email}
                                        disabled={true}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Cmnd:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={cmnd || ""}
                                        pattern="[0-9]{12}"
                                        onChange={(e) => setCmnd(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Phone:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={phone || ""}
                                        pattern="[0-9]{4}-[0-9]{3}-[0-9]{3}"
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Address:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={address || ""}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-12">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Profile"
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Bootstrap Modal for Avatar Update */}
            <div className={`modal fade ${showModal ? 'show' : ''}`}
                style={{ display: showModal ? 'block' : 'none' }}
                tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Profile Picture</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowModal(false)}
                            ></button>
                        </div>
                        <form onSubmit={handleAvatarUpdate}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Choose Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={(e) => setAvatarFile(e.target.files[0])}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={!avatarFile || isUploadingAvatar}
                                >
                                    {isUploadingAvatar ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Uploading...
                                        </>
                                    ) : (
                                        "Upload"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {showModal && <div className="modal-backdrop fade show"></div>}
        </>
    );
}