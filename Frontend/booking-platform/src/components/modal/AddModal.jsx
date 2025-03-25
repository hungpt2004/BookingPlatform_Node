import { useEffect } from "react";
import { Modal, Form, Input, InputNumber } from "antd";

// Add Service Modal
export const AddServiceModal = ({ visible, onClose, onAdd }) => {
  const [form] = Form.useForm();

  // Reset form fields when modal is opened or closed
  useEffect(() => {
    if (visible) {
      form.resetFields(); // Clear form when modal opens
    }
  }, [visible, form]);

  const handleAdd = () => {
    form
      .validateFields()
      .then((values) => {
        const newService = {
          ...values,
        };
        console.log("Adding new service: ", newService);
        onAdd(newService); // Pass the new service data to the parent component
        onClose(); // Close the modal
        form.resetFields(); // Reset form after submission
      })
      .catch((error) => {
        console.error("Validation failed:", error);
      });
  };

  return (
    <Modal
      title="Add New Service"
      visible={visible}
      onCancel={onClose}
      onOk={handleAdd}
      okText="Add"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter service name" }]}
        >
          <Input placeholder="Enter service name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter service description" />
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