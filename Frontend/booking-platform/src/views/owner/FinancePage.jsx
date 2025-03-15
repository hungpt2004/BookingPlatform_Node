import { FaThumbsDown, FaThumbsUp } from "react-icons/fa6";
import { OwnerNavbar } from "../../components/navbar/OwnerNavbar";
import { FaCalendarCheck } from "react-icons/fa";

export default function FinancePage() {
    return (
        <>
            <OwnerNavbar />
            <div className="container py-4">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0">Hóa đơn</h1>
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center">
                            <span className="me-2 text-muted w-75 text-end">Trang này có hữu ích không?</span>
                            <div className="d-flex align-items-center w-25">
                                <button className="btn btn-light rounded-circle p-3 ">
                                    <FaThumbsUp className="text-success" />
                                </button>
                                <button className="btn btn-light rounded-circle p-3 ms-2">
                                    <FaThumbsDown className="text-danger" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Success Message Card */}
                <div className="card border-0 shadow-sm mb-4 bg-light">
                    <div className="card-body d-flex justify-content-center align-items-center gap-4">
                        <FaCalendarCheck size={75} className="text-primary" />
                        <div>
                            <h4 className="mb-2 text-success">Quý vị đã thanh toán tất cả hóa đơn!</h4>
                            <p className="text-muted mb-0">
                                Các hóa đơn hoa hồng mới và giấy tờ cần thanh toán sẽ hiển thị vào đầu chu kỳ thanh toán tiếp theo.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Download Section */}
                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title mb-3 fw-bold">Tải hóa đơn và các loại giấy tờ khác                        </h5>
                        <p className="text-muted mb-4">
                            Tại đây, Quý vị có thể tải xuống các loại giấy tờ tài chính theo tháng trả phòng và chỉ dành cho các chỗ nghỉ đang thuộc sở hữu của nhóm. Tùy vào số lượng tập tin Quý vị có, có thể mất chút thời gian để tạo đường link tải xuống và các đường link này sẽ có hiệu lực trong 6 giờ.

                        </p>
                        <div className="row g-3">
                            <div className="col-md-2">
                                <select className="form-select">
                                    <option>2025</option>
                                    <option>2024</option>
                                </select>
                            </div>
                            <div className="col-md-2">
                                <select className="form-select">
                                    {[...Array(12)].map((_, i) => (
                                        <option key={i}>Tháng {i + 1}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <select className="form-select">
                                    <option>Tóm tắt các loại giấy tờ (XLS)</option>
                                    <option>Hóa đơn chi tiết (PDF)</option>
                                </select>
                            </div>
                            <div className="col-md-6 text-end mt-3">
                                <button className="btn btn-primary shadow-sm">
                                    Tạo tập tin
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}