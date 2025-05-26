import React from 'react';
import { Card, Typography } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, MailOutlined, ClockCircleOutlined, CompassOutlined } from '@ant-design/icons';

const { Text } = Typography;

const Service = ({ hospitalInfo }) => (
    <Card style={{ borderRadius: 16, boxShadow: '0 2px 8px #f0f1f2', textAlign: 'center', padding: 32, maxWidth: 700, margin: '0 auto 48px auto' }}>
        <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 8, color: '#1890ff' }}>{hospitalInfo.name}</h2>
        <div style={{ color: '#888', fontSize: 16, marginBottom: 20 }}>{hospitalInfo.description}</div>
        <div style={{ textAlign: 'left', fontSize: 16, margin: '0 auto', maxWidth: 350 }}>
            <div style={{ marginBottom: 10 }}>
                <EnvironmentOutlined style={{ color: '#52c41a', marginRight: 8 }} /> <b>Địa chỉ:</b> {hospitalInfo.address}
                <a href="https://maps.google.com/?q=Số 1, Trần Phú, Hà Đông, Hà Nội" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8 }}><CompassOutlined style={{ color: '#4f46e5' }} /></a>
            </div>
            <div style={{ marginBottom: 10 }}>
                <PhoneOutlined style={{ color: '#1890ff', marginRight: 8 }} /> <b>Điện thoại:</b> <a href={`tel:${hospitalInfo.phone.replace(/\s/g, '')}`}>{hospitalInfo.phone}</a>
            </div>
            <div style={{ marginBottom: 10 }}>
                <MailOutlined style={{ color: '#faad14', marginRight: 8 }} /> <b>Email:</b> <a href={`mailto:${hospitalInfo.email}`}>{hospitalInfo.email}</a>
            </div>
            <div style={{ marginBottom: 10 }}>
                <ClockCircleOutlined style={{ color: '#eb2f96', marginRight: 8 }} /> <b>Giờ làm việc:</b> <Text strong style={{ color: '#eb2f96' }}>{hospitalInfo.workingHours}</Text>
            </div>
        </div>
    </Card>
);

export default Service; 