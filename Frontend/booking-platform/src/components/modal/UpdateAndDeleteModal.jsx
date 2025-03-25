import { useEffect } from "react";

// Update Modal
import { Modal, Form, Input, InputNumber } from "antd";

export const UpdateModal = ({ visible, onClose, service, onUpdate }) => {
   const [form] = Form.useForm();

   useEffect(() => {
      if (service) {
         form.setFieldsValue({
            name: service.name,
            description: service.description,
            price: service.price,
         });
      }
   }, [service]);

   const handleUpdate = () => {
      form.validateFields()
         .then((values) => {
            const updatedService = {
               ...service,
               ...values,
               id: service.id,
            };
            console.log("Sending data: ", updatedService);
            onUpdate(updatedService);
            onClose();
         })
         .catch((error) => {
            console.error("Validation failed:", error);
         });
   };

   return (
      <Modal
         title="Update Service"
         visible={visible}
         onCancel={onClose}
         onOk={handleUpdate}
      >
         <Form form={form} layout="vertical">
            <Form.Item
               label="Name"
               name="name"
               rules={[{ required: true, message: "Please enter service name" }]}
            >
               <Input />
            </Form.Item>

            <Form.Item
               label="Description"
               name="description"
               rules={[{ required: true, message: "Please enter description" }]}
            >
               <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
               label="Price"
               name="price"
               rules={[
                  { required: true, message: "Please enter price" },
                  { type: "number", min: 1, message: "Price must be greater than 0" },
               ]}
            >
               <InputNumber 
                  min={1} 
                  style={{ width: "100%" }} 
                  placeholder="Enter price" 
               />
            </Form.Item>
         </Form>
      </Modal>
   );
};


// Delete Confirm Modal
export const DeleteConfirmModal = ({ visible, onClose, service, onDelete }) => (
   <Modal
      title="Confirm Delete"
      visible={visible}
      onCancel={onClose}
      onOk={() => {
         onDelete(service);
         onClose();
      }}
      okText="Delete"
      okButtonProps={{ danger: true }}
      cancelText="Cancel"
   >
      <p>Are you sure you want to delete <b>{service?.name}</b>?</p>
   </Modal>
);
