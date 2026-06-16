import React from 'react';
import { Tag } from 'antd';
import { ClockCircleOutlined, CarOutlined, CheckCircleOutlined } from '@ant-design/icons';

export default function StatusUpdateBadge({ status }) {
  switch (status) {
    case 'completed':
      return (
        <Tag icon={<CheckCircleOutlined />} color="success" className="m-0">
          Hoàn thành
        </Tag>
      );
    case 'processing':
      return (
        <Tag icon={<CarOutlined />} color="processing" className="m-0">
          Đang rửa / Xử lý
        </Tag>
      );
    case 'pending':
    default:
      return (
        <Tag icon={<ClockCircleOutlined />} color="default" className="m-0">
          Đang chờ
        </Tag>
      );
  }
}