const cloudinary = require("../utils/cloudinary"); // Cấu hình Cloudinary
const asyncHandler = require("../middlewares/asyncHandler"); 
/**
 * Upload nhiều ảnh lên Cloudinary
 * @param {Array|Object} files - File hoặc mảng các file cần upload
 * @param {String} folder - Tên thư mục trên Cloudinary (mặc định: 'products')
 * @param {Object} options - Các tùy chọn cho việc upload (width, height, crop,...)
 * @param {Boolean} returnFullInfo - Trả về thông tin đầy đủ hoặc chỉ URL (mặc định: false)
 * @returns {Promise<Array>} - Mảng các thông tin ảnh đã upload hoặc mảng URL
 */
exports.uploadMultipleImages = async (files, folder = "products", options = {}, returnFullInfo = false) => {
    try {
        // Kiểm tra nếu không có file nào
        if (!files) {
            throw new Error("No files provided");
        }

        // Chuyển đổi file thành mảng
        const fileArray = Array.isArray(files) ? files : [files];

        // Upload từng file lên Cloudinary
        const uploadResults = await Promise.all(
            fileArray.map(async (file) => {
                const filePath = file.tempFilePath || file.path;
                const result = await cloudinary.uploader.upload(filePath, {
                    folder,
                    width: options.width || 150,
                    crop: options.crop || "scale",
                    ...options
                });

                return returnFullInfo
                    ? {
                        public_ID: result.public_id,
                        url: result.secure_url,
                        width: result.width,
                        height: result.height,
                        format: result.format,
                        resource_type: result.resource_type
                    }
                    : result.secure_url;
            })
        );

        return uploadResults;
    } catch (error) {
        console.error("Error uploading images:", error);
        throw error;
    }
};
/**
 * Xóa một hoặc nhiều ảnh khỏi Cloudinary
 * @param {String|Array} publicIds - public_id hoặc mảng public_id cần xóa
 * @returns {Promise<Object>} - Kết quả xóa ảnh
 */
exports.deleteImages = async (publicIds) => {
    try {
        if (!publicIds || (Array.isArray(publicIds) && publicIds.length === 0)) {
            throw new Error("No public IDs provided");
        }

        const ids = Array.isArray(publicIds) ? publicIds : [publicIds];
        const result = await cloudinary.api.delete_resources(ids);

        return {
            success: true,
            message: `Successfully deleted ${ids.length} images`,
            result
        };
    } catch (error) {
        console.error("Error deleting images:", error);
        throw error;
    }
};

/**
 * Trích xuất public_id từ Cloudinary URL
 * @param {String} url - URL của ảnh trên Cloudinary
 * @returns {String|null} - public_id của ảnh hoặc null nếu không tìm thấy
 */
exports.getPublicIdFromUrl = (url) => {
    if (!url) return null;

    try {
        // Cloudinary URLs thường có dạng: https://res.cloudinary.com/cloud_name/image/upload/v123456/folder/public_id.jpg
        const urlParts = url.split('/');
        const fileNameWithExtension = urlParts[urlParts.length - 1];
        const fileName = fileNameWithExtension.split('.')[0];

        // Lấy folder từ URL (nếu có)
        const uploadIndex = urlParts.findIndex(part => part === 'upload');
        if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
            const folderPath = urlParts.slice(uploadIndex + 2, -1).join('/');
            if (folderPath) {
                return `${folderPath}/${fileName}`;
            }
        }

        return fileName;
    } catch (error) {
        console.error("Error extracting public_id from URL:", error);
        return null;
    }
};


// API để tải file ZIP lên Cloudinary và lưu URL vào MongoDB

exports.uploadZipFile = asyncHandler(async (req, res) => {
    try {
        const ownerID = req.user?.id || req.body.id;
        if (!req.files || !req.files.file) {
            return res.status(400).json({ success: false, message: "Vui lòng tải lên một file ZIP" });
        }

        const zipFile = req.files.file; // Lấy file ZIP từ request
        //console.log(`Nhận file ZIP: ${zipFile.name} - Dung lượng: ${zipFile.size} bytes`);

        const tempFilePath = zipFile.tempFilePath; 

        const hotelDocument = `hotels/${ownerID}/document`; // Tên thư mục trên Cloudinary
        // Upload file ZIP lên Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(tempFilePath, {
            folder: hotelDocument,
            resource_type: "raw" // Quan trọng: Chỉ định đây là file không phải ảnh
        });
      

        res.status(200).json({ success: true, documentUrl: uploadResponse.secure_url });
    } catch (error) {
        console.error("Lỗi khi tải file ZIP:", error);
        res.status(500).json({ success: false, message: "Lỗi máy chủ", error: error.message });
    }
});