import React from 'react';
import { Formik } from 'formik';
import { Button, message, Card, Form, Input } from 'antd';
import * as Yup from 'yup';
import { registerUser } from '../services/api';
import { UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const RegisterSchema = Yup.object().shape({
    username: Yup.string().required('Bắt buộc'),
    password: Yup.string().required('Bắt buộc'),
    email: Yup.string().email('Email không hợp lệ').required('Bắt buộc'),
    phone: Yup.string().required('Bắt buộc'),
});

const Register = () => {
    const navigate = useNavigate();
    setTimeout(() => message.error('Test lỗi ngoài Formik!'), 1000);
    return (
        <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
            <Card
                style={{ width: 420, maxWidth: '95vw', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                bodyStyle={{ padding: 32 }}
                bordered={false}
                cover={
                    <div style={{ textAlign: 'center', marginTop: 32 }}>
                        <UserAddOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                    </div>
                }
            >
                <h2 style={{ textAlign: 'center', marginBottom: 8, fontWeight: 700, fontSize: 28 }}>Đăng ký tài khoản</h2>
                <div style={{ textAlign: 'center', color: '#888', marginBottom: 24, fontSize: 15 }}>
                    Tạo tài khoản để sử dụng hệ thống quản lý bệnh viện
                </div>
                <Formik
                    initialValues={{ username: '', password: '', email: '', phone: '' }}
                    validationSchema={RegisterSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            const response = await registerUser(values);
                            console.log('API response:', response);
                            message.success('Đăng ký thành công!');
                            setTimeout(() => navigate('/login'), 1000);
                        } catch (err) {
                            if (err.response && err.response.data) {
                                // Hiển thị tất cả lỗi từ backend
                                const errors = err.response.data;
                                if (typeof errors === 'string') {
                                    message.error(errors);
                                } else if (typeof errors === 'object') {
                                    // Nếu có nhiều lỗi, hiển thị từng lỗi một
                                    Object.values(errors).forEach((error) => {
                                        if (Array.isArray(error)) {
                                            error.forEach((msg) => message.error(msg));
                                        } else {
                                            message.error(error);
                                        }
                                    });
                                } else {
                                    message.error('Đăng ký thất bại!');
                                }
                            } else {
                                message.error('Đăng ký thất bại!');
                            }
                        }
                        setSubmitting(false);
                    }}
                >
                    {({ errors, touched, isSubmitting, handleChange, handleBlur, values, handleSubmit }) => (
                        <form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
                            <Form.Item
                                label={<span style={{ fontWeight: 600 }}>Tên đăng nhập</span>}
                                validateStatus={errors.username && touched.username ? 'error' : ''}
                                help={touched.username && errors.username}
                                style={{ marginBottom: 20 }}
                            >
                                <Input
                                    name="username"
                                    placeholder="Tên đăng nhập"
                                    size="large"
                                    style={{ borderRadius: 8 }}
                                    value={values.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Form.Item>
                            <Form.Item
                                label={<span style={{ fontWeight: 600 }}>Email</span>}
                                validateStatus={errors.email && touched.email ? 'error' : ''}
                                help={touched.email && errors.email}
                                style={{ marginBottom: 20 }}
                            >
                                <Input
                                    name="email"
                                    placeholder="Email"
                                    size="large"
                                    style={{ borderRadius: 8 }}
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Form.Item>
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
                                Đăng ký
                            </Button>
                        </form>
                    )}
                </Formik>
            </Card>
        </div>
    );
};

export default Register; 