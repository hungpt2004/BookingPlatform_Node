import { useEffect, useState } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import bg1 from "../../assets/images/hero/bg5.jpg";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import { toast } from "react-toastify";
import { FiCamera } from "react-icons/fi";

export default function CustomerProfileSetting() {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
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
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const updates = { phone, address, name, cmnd };
    setIsUpdating(true);
    try {
      await axiosInstance.patch(`/customer/update-profile`, updates);
      toast.success("Profile updated successfully");
      await fetchCurrentUser();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

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
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatar(response.data.image.url);
      toast.success("Avatar updated successfully");
      setShowModal(false);
      setAvatarFile(null);
      await fetchCurrentUser();
    } catch (error) {
      toast.error("Failed to update avatar");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <>
      <CustomNavbar />
      <div className="container mt-4">
        <div className="position-relative">
          <img
            src={bg1}
            className="w-100 rounded shadow-lg"
            alt="Profile banner"
            style={{ height: "250px", objectFit: "cover" }}
          />
          <div className="position-absolute d-flex align-items-end" style={{ bottom: "-40px", left: "20px" }}>
            <div className="position-relative d-inline-block">
              <img
                src={avatar || "/default-avatar.png"}
                alt="Profile"
                className="rounded-circle border shadow-lg"
                style={{ width: "120px", height: "120px", objectFit: "cover", cursor: "pointer" }}
                onClick={() => setShowModal(true)}
              />
              <button
                className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle"
                onClick={() => setShowModal(true)}
                style={{ width: "36px", height: "36px", padding: "6px" }}
              >
                <FiCamera className="m-auto fs-5" />
              </button>
            </div>
            <div className="ms-3">
              <h4 className="fw-bold">Mr. {name || "User Name"}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="bg-white p-4 rounded shadow-lg">
          <h5 className="fw-bold">Personal Details</h5>
          <form onSubmit={handleUpdateProfile} className="mt-3">
            <div className="row">
              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                  <label>Name</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" value={email} disabled />
                  <label>Email</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" value={cmnd} onChange={(e) => setCmnd(e.target.value)} />
                  <label>CMND</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <label>Phone</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
                  <label>Address</label>
                </div>
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {showModal && (
  <>
    <div className="modal d-block" tabIndex="-1">
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
    <div className="modal-backdrop show" onClick={() => setShowModal(false)}></div>
  </>
)}
    </>
  );
}
