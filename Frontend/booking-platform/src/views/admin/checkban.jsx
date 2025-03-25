import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/AxiosInstance";
import { Modal, Button } from "antd";

const LockStatusChecker = () => {
  const navigate = useNavigate();
  const [isBanned, setIsBanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const checkLockStatus = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axiosInstance.get("/customer/current-user");
        const currentUser = response.data.user;

        if (currentUser?.isLocked) {
          setIsBanned(true);
          setModalVisible(true);
        }
      } catch (error) {
        console.error("Error checking lock status", error);
      }
    };

    checkLockStatus();
    const interval = setInterval(checkLockStatus, 5000); 
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setModalVisible(false);
    navigate("/"); 
  };

  return (
    <>
      {isBanned && (
        <Modal
          title="Account Banned"
          visible={modalVisible}
          onCancel={handleLogout}
          footer={[
            <Button key="logout" type="primary" danger onClick={handleLogout}>
              Logout
            </Button>,
          ]}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl transform animate-fadeIn">
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                        Account Banned
                    </h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            Your account has been banned due to violation of our terms. 
                            Please contact support for assistance.
                        </p>
                    </div>
                    
                </div>
            </div>
        </div>
        </Modal>
      )}
    </>
  );
};

export default LockStatusChecker;
