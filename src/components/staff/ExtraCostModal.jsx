import React from 'react';
import { Modal, Form, Input, InputNumber, Button } from 'antd';

export default function ExtraCostModal({ visible, onCancel, onSubmit }) {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    // Gọi hàm onSubmit truyền từ component cha (TaskDetail) xuống
    onSubmit(values);
    form.resetFields(); // Reset form sau khi submit thành công
  };

  return (
    <Modal
      title="Thêm Vật Tư / Dịch Vụ Phát Sinh"
      open={visible}
      onCancel={onCancel}
      footer={null} // Ẩn footer mặc định để dùng footer của Form
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="mt-4"
      >
        <Form.Item
          name="name"
          label="Tên vật tư / dịch vụ"
          rules={[{ required: true, message: 'Vui lòng nhập tên hạng mục!' }]}
        >
          <Input placeholder="VD: Tẩy ố kính, Nước làm mát..." />
        </Form.Item>

        <Form.Item
          name="price"
          label="Giá tiền (VNĐ)"
          rules={[{ required: true, message: 'Vui lòng nhập giá tiền!' }]}
        >
          <InputNumber 
            className="w-full"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            placeholder="VD: 150000"
            min={0}
          />
        </Form.Item>

        <Form.Item className="text-right mb-0 mt-6">
          <Space>
            <Button onClick={onCancel}>Hủy bỏ</Button>
            <Button type="primary" htmlType="submit">
              Xác nhận thêm
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}