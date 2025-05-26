import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, MedicineBoxOutlined, HeartFilled, PlusCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

const bgIcons = [
    { icon: <MedicineBoxOutlined style={{ fontSize: 120, color: '#b3bcf5', opacity: 0.13 }} />, style: { position: 'absolute', left: 32, bottom: 32 } },
    { icon: <HeartFilled style={{ fontSize: 100, color: '#f87171', opacity: 0.10 }} />, style: { position: 'absolute', right: 40, top: 60 } },
    { icon: <PlusCircleFilled style={{ fontSize: 90, color: '#4f46e5', opacity: 0.08 }} />, style: { position: 'absolute', right: 80, bottom: 80 } },
];

const PatientLogin = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                phone: values.username,
                password: values.password
            };
            const res = await loginUser(payload);
            // Lưu access token và thông tin user nếu có
            if (res.access) localStorage.setItem('access_token', res.access);
            if (res.refresh) localStorage.setItem('refresh_token', res.refresh);
            if (res.user) localStorage.setItem('patient', JSON.stringify(res.user));
            message.success('Đăng nhập thành công!');
            setTimeout(() => navigate('/patient/home'), 500);
        } catch (err) {
            message.error(err?.response?.data?.detail || 'Đăng nhập thất bại!');
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)', padding: 16, overflow: 'hidden' }}>
            {bgIcons.map((item, idx) => (
                <div key={idx} style={item.style}>{item.icon}</div>
            ))}
            <div style={{ maxWidth: 480, width: '100%', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <img src="https://cdn-icons-png.flaticon.com/512/2966/2966484.png" alt="logo" style={{ width: 88, height: 88, marginBottom: 10 }} />
                    <h1 style={{ fontWeight: 900, fontSize: 34, color: '#4f46e5', marginBottom: 6 }}>HealthCare Pro</h1>
                    <div style={{ color: '#666', fontSize: 18, marginBottom: 0 }}>Nền tảng tư vấn, đặt lịch & dịch vụ khám bệnh hiện đại</div>
                </div>
                <Card style={{ borderRadius: 24, boxShadow: '0 4px 32px #e0e7ff', padding: 0 }} bodyStyle={{ padding: 40 }}>
                    <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: 26, marginBottom: 32, marginTop: 8 }}>Đăng nhập bệnh nhân</h2>
                    <Form layout="vertical" onFinish={onFinish} size="large">
                        <Form.Item name="username" label="Số điện thoại hoặc Email" rules={[{ required: true, message: 'Bắt buộc' }]} style={{ marginBottom: 24 }}>
                            <Input prefix={<UserOutlined />} placeholder="Nhập số điện thoại hoặc email" style={{ borderRadius: 10, height: 52, fontSize: 18 }} />
                        </Form.Item>
                        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Bắt buộc' }]} style={{ marginBottom: 32 }}>
                            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" style={{ borderRadius: 10, height: 52, fontSize: 18 }} />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" block icon={<LoginOutlined />} loading={loading} style={{ borderRadius: 12, height: 56, fontWeight: 700, fontSize: 20, marginBottom: 12 }}>
                            Đăng nhập
                        </Button>
                    </Form>
                    <div style={{ textAlign: 'center', marginTop: 18 }}>
                        <span style={{ color: '#888', fontSize: 16 }}>Chưa có tài khoản? </span>
                        <Button type="link" style={{ padding: 0, fontSize: 16 }} onClick={() => navigate('/patient/register')}>Đăng ký</Button>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 10 }}>
                        <Button type="link" style={{ color: '#4f46e5', fontWeight: 700, fontSize: 16, padding: 0 }} onClick={() => navigate('/patient/home')}>Về trang chủ</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PatientLogin; 