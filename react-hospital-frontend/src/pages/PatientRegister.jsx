import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Row, Col, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { registerUser, addPatient } from '../services/api';

const bgIcons = [
    { icon: <UserOutlined style={{ fontSize: 120, color: '#b3bcf5', opacity: 0.13 }} />, style: { position: 'absolute', left: 32, bottom: 32 } },
    { icon: <MailOutlined style={{ fontSize: 100, color: '#f87171', opacity: 0.10 }} />, style: { position: 'absolute', right: 40, top: 60 } },
    { icon: <PhoneOutlined style={{ fontSize: 90, color: '#4f46e5', opacity: 0.08 }} />, style: { position: 'absolute', right: 80, bottom: 80 } },
];

const PatientRegister = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const payload = {
                phone: values.phone,
                password: values.password,
                profile: {
                    first_name: values.first_name,
                    last_name: values.last_name,
                    dob: values.dob
                }
            };
            const res = await registerUser(payload);
            const user_id = res?.user?.id;
            if (res?.access) localStorage.setItem('access_token', res.access);
            if (!user_id) throw new Error('Không lấy được user_id');
            await addPatient({
                use_id: user_id,
                first_name: values.first_name,
                last_name: values.last_name,
                birth_date: values.dob,
                phone_number: values.phone,
                address: values.address,
                sex: values.sex
            });
            message.success('Đăng ký thành công! Vui lòng đăng nhập.');
            navigate('/patient-login');
        } catch (error) {
            message.error(error?.response?.data?.detail || error.message || 'Đăng ký thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)', padding: 16, overflow: 'hidden' }}>
            {bgIcons.map((item, idx) => (
                <div key={idx} style={item.style}>{item.icon}</div>
            ))}
            <div style={{ maxWidth: 700, width: '100%', zIndex: 1 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <img src="https://cdn-icons-png.flaticon.com/512/2966/2966484.png" alt="logo" style={{ width: 88, height: 88, marginBottom: 10 }} />
                    <h1 style={{ fontWeight: 900, fontSize: 34, color: '#4f46e5', marginBottom: 6 }}>HealthCare Pro</h1>
                    <div style={{ color: '#666', fontSize: 18, marginBottom: 0 }}>Nền tảng tư vấn, đặt lịch & dịch vụ khám bệnh hiện đại</div>
                </div>
                <Card style={{ borderRadius: 24, boxShadow: '0 4px 32px #e0e7ff', padding: 0 }} bodyStyle={{ padding: 40 }}>
                    <h2 style={{ textAlign: 'center', fontWeight: 800, fontSize: 26, marginBottom: 32, marginTop: 8 }}>Đăng ký bệnh nhân</h2>
                    <Form layout="vertical" onFinish={onFinish} size="large">
                        <Row gutter={24}>
                            <Col xs={24} sm={12}>
                                <Form.Item name="first_name" label={<span style={{ fontSize: 16 }}>Họ</span>} rules={[{ required: true, message: 'Vui lòng nhập họ' }]} style={{ marginBottom: 20 }}>
                                    <Input prefix={<UserOutlined />} placeholder="Nhập họ" style={{ borderRadius: 10, height: 48, fontSize: 16 }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item name="last_name" label={<span style={{ fontSize: 16 }}>Tên</span>} rules={[{ required: true, message: 'Vui lòng nhập tên' }]} style={{ marginBottom: 20 }}>
                                    <Input prefix={<UserOutlined />} placeholder="Nhập tên" style={{ borderRadius: 10, height: 48, fontSize: 16 }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col xs={24} sm={12}>
                                <Form.Item name="dob" label={<span style={{ fontSize: 16 }}>Ngày sinh</span>} rules={[{ required: true, message: 'Vui lòng nhập ngày sinh' }]} style={{ marginBottom: 20 }}>
                                    <Input type="date" style={{ borderRadius: 10, height: 48, fontSize: 16 }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item name="phone" label={<span style={{ fontSize: 16 }}>Số điện thoại</span>} rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]} style={{ marginBottom: 20 }}>
                                    <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" style={{ borderRadius: 10, height: 48, fontSize: 16 }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col xs={24} sm={12}>
                                <Form.Item name="address" label={<span style={{ fontSize: 16 }}>Địa chỉ</span>} rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]} style={{ marginBottom: 20 }}>
                                    <Input placeholder="Nhập địa chỉ" style={{ borderRadius: 10, height: 48, fontSize: 16 }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item name="sex" label={<span style={{ fontSize: 16 }}>Giới tính</span>} rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]} style={{ marginBottom: 20 }}>
                                    <Select placeholder="Chọn giới tính" style={{ borderRadius: 10, height: 48, fontSize: 16 }}>
                                        <Select.Option value="male">Nam</Select.Option>
                                        <Select.Option value="female">Nữ</Select.Option>
                                        <Select.Option value="other">Khác</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24}>
                            <Col xs={24} sm={12}>
                                <Form.Item name="password" label={<span style={{ fontSize: 16 }}>Mật khẩu</span>} rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]} style={{ marginBottom: 20 }}>
                                    <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" style={{ borderRadius: 10, height: 48, fontSize: 16 }} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
                                <Form.Item name="confirm" label={<span style={{ fontSize: 16 }}>Xác nhận mật khẩu</span>} dependencies={["password"]} hasFeedback rules={[
                                    { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                        },
                                    }),
                                ]} style={{ marginBottom: 28 }}>
                                    <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" style={{ borderRadius: 10, height: 48, fontSize: 16 }} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Button type="primary" htmlType="submit" block icon={<LoginOutlined />} loading={loading} style={{ borderRadius: 12, height: 52, fontWeight: 700, fontSize: 18, margin: '20px 0 10px 0' }}>
                            Đăng ký
                        </Button>
                    </Form>
                    <div style={{ textAlign: 'center', marginTop: 18 }}>
                        <span style={{ color: '#888', fontSize: 16 }}>Đã có tài khoản? </span>
                        <Button type="link" style={{ padding: 0, fontSize: 16 }} onClick={() => navigate('/patient-login')}>Đăng nhập</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PatientRegister; 