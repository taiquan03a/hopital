import React from 'react';
import { Formik } from 'formik';
import { Button, message, Card, Form, Input } from 'antd';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LoginOutlined } from '@ant-design/icons';
import axios from 'axios';

// Giả lập login, chỉ lưu token mẫu
const LoginSchema = Yup.object().shape({
    phone: Yup.string().required('Bắt buộc'),
    password: Yup.string().required('Bắt buộc'),
});

const loginUser = async (data) => {
    // Gọi API login đúng endpoint backend
    // Đổi lại URL nếu cần
    const res = await axios.post('http://localhost:6886/api/user/login/', data, {
        headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
};

const Login = () => {
    const navigate = useNavigate();
    return (
        <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
            <Card
                style={{ width: 420, maxWidth: '95vw', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                bodyStyle={{ padding: 32 }}
                bordered={false}
                cover={
                    <div style={{ textAlign: 'center', marginTop: 32 }}>
                        <LoginOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                    </div>
                }
            >
                <h2 style={{ textAlign: 'center', marginBottom: 8, fontWeight: 700, fontSize: 28 }}>Đăng nhập</h2>
                <div style={{ textAlign: 'center', color: '#888', marginBottom: 24, fontSize: 15 }}>
                    Đăng nhập để sử dụng hệ thống quản lý bệnh viện
                </div>
                <Formik
                    initialValues={{ phone: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            const response = await loginUser(values);
                            // Lưu token vào localStorage
                            localStorage.setItem('access_token', response.access);
                            localStorage.setItem('refresh_token', response.refresh);
                            // Lưu user_id nếu có
                            if (response.user_id) {
                                localStorage.setItem('user_id', response.user_id);
                            } else if (response.user && response.user.id) {
                                localStorage.setItem('user_id', response.user.id);
                            }
                            message.success('Đăng nhập thành công!');
                            setTimeout(() => navigate('/pharmaceuticals'), 1000);
                        } catch (err) {
                            if (err.response && err.response.data) {
                                const errors = err.response.data;
                                if (typeof errors === 'string') {
                                    message.error(errors);
                                } else if (typeof errors === 'object') {
                                    Object.values(errors).forEach((error) => {
                                        if (Array.isArray(error)) {
                                            error.forEach((msg) => message.error(msg));
                                        } else {
                                            message.error(error);
                                        }
                                    });
                                } else {
                                    message.error('Đăng nhập thất bại!');
                                }
                            } else {
                                message.error('Đăng nhập thất bại!');
                            }
                        }
                        setSubmitting(false);
                    }}
                >
                    {({ errors, touched, isSubmitting, handleChange, handleBlur, values, handleSubmit }) => (
                        <form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
                            <Form.Item
                                label={<span style={{ fontWeight: 600 }}>Số điện thoại</span>}
                                validateStatus={errors.phone && touched.phone ? 'error' : ''}
                                help={touched.phone && errors.phone}
                                style={{ marginBottom: 20 }}
                            >
                                <Input
                                    name="phone"
                                    placeholder="Số điện thoại"
                                    size="large"
                                    prefix={<UserOutlined />}
                                    style={{ borderRadius: 8 }}
                                    value={values.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span style={{ fontWeight: 600 }}>Mật khẩu</span>}
                                validateStatus={errors.password && touched.password ? 'error' : ''}
                                help={touched.password && errors.password}
                                style={{ marginBottom: 28 }}
                            >
                                <Input.Password
                                    name="password"
                                    placeholder="Mật khẩu"
                                    size="large"
                                    style={{ borderRadius: 8 }}
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" loading={isSubmitting} block size="large" style={{ borderRadius: 8, fontWeight: 600 }}>
                                Đăng nhập
                            </Button>
                        </form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};

export default Login; 