import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import "./EditAccountModal.css";

const EditUserModal = ({ isVisible, onClose, userInfo, onSave }) => {
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (values) => {
    try {
      setIsSaving(true);
      // Giả lập cập nhật thành công sau 1 giây
      setTimeout(() => {
        onSave(values); 
        message.success("Cập nhật thông tin thành công!");
        setIsSaving(false);
        onClose();
      }, 1000);
    } catch (error) {
      message.error("Có lỗi xảy ra!");
      setIsSaving(false);
    }
  };

  return (
    <Modal
      className="custom-modal"
      title={<div className="modal-title"> Chỉnh sửa thông tin </div>}
      open={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={userInfo}
      >
        <div className="form-row1">
          <Form.Item
            label="Họ tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input placeholder="Nhập họ tên" />
          </Form.Item>
        </div>

        <div className="form-row2">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
        </div>

        <div className="form-row2">
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </div>

        <div className="form-row2">
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>
        </div>

        <div className="save">
          <Button type="primary" htmlType="submit" loading={isSaving}>
            Lưu thông tin
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
