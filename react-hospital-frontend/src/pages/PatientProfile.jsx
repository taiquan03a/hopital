import React from 'react';
import { Card, Button, Descriptions, Avatar } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PatientProfile = () => {
    const patient = JSON.parse(localStorage.getItem('patient')) || {};
    const { first_name, last_name, phone, dob } = patient;
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
                <Card
                    style={{ maxWidth: 520, width: '100%', borderRadius: 24, boxShadow: '0 4px 32px #e0e7ff' }}
                    bodyStyle={{ padding: 36 }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
                        <Avatar size={96} icon={<UserOutlined />} style={{ background: '#4f46e5', marginBottom: 12 }} />
                        <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 0 }}>
                            {first_name || ''} {last_name || ''}
                        </h2>
                        <div style={{ color: '#888', fontSize: 18 }}>{phone}</div>
                    </div>
                    <Descriptions column={1} bordered size="middle" labelStyle={{ fontWeight: 700, width: 160 }} contentStyle={{ fontSize: 18 }}>
                        <Descriptions.Item label="Họ tên">
                            {first_name || ''} {last_name || ''}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            {phone || '---'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh">
                            {dob || '---'}
                        </Descriptions.Item>
                    </Descriptions>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        style={{ marginTop: 32, borderRadius: 10, height: 48, fontWeight: 700, fontSize: 18 }}
                        block
                        disabled
                    >
                        Chỉnh sửa thông tin
                    </Button>
                </Card>
            </div>
            <Footer />
        </div>
    );
};

export default PatientProfile; 