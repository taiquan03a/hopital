import React from 'react';
import { Formik } from 'formik';
import { Form, Input, Button, message, InputNumber } from 'antd';
import * as Yup from 'yup';
import { addPharmaceutical } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';

const PharmaceuticalAddSchema = Yup.object().shape({
    name: Yup.string().required('Bắt buộc'),
    code: Yup.string().required('Bắt buộc'),
    unit: Yup.string().required('Bắt buộc'),
    price: Yup.number().required('Bắt buộc').min(0, 'Giá phải >= 0'),
});

const PharmaceuticalAdd = () => {
    const navigate = useNavigate();
    return (
        <div style={{ maxWidth: 480, margin: '32px auto', background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #f0f1f2', padding: 32 }}>
            <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: 28, marginBottom: 24 }}>Thêm thuốc mới</h2>
            <Formik
                initialValues={{ name: '', code: '', unit: '', price: 0 }}
                validationSchema={PharmaceuticalAddSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        await addPharmaceutical(values);
                        message.success('Thêm thuốc thành công!');
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
                                message.error('Thêm thuốc thất bại!');
                            }
                        } else {
                            message.error('Thêm thuốc thất bại!');
                        }
                    }
                    setSubmitting(false);
                }}
            >
                {({ errors, touched, isSubmitting, handleChange, handleBlur, values, handleSubmit }) => (
                    <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
                        <Form.Item
                            label="Tên thuốc"
                            validateStatus={errors.name && touched.name ? 'error' : ''}
                            help={touched.name && errors.name}
                            style={{ marginBottom: 20 }}
                        >
                            <Input
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Tên thuốc"
                                style={{ borderRadius: 8 }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Mã"
                            validateStatus={errors.code && touched.code ? 'error' : ''}
                            help={touched.code && errors.code}
                            style={{ marginBottom: 20 }}
                        >
                            <Input
                                name="code"
                                value={values.code}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Mã thuốc"
                                style={{ borderRadius: 8 }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Đơn vị"
                            validateStatus={errors.unit && touched.unit ? 'error' : ''}
                            help={touched.unit && errors.unit}
                            style={{ marginBottom: 20 }}
                        >
                            <Input
                                name="unit"
                                value={values.unit}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Đơn vị"
                                style={{ borderRadius: 8 }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Giá"
                            validateStatus={errors.price && touched.price ? 'error' : ''}
                            help={touched.price && errors.price}
                            style={{ marginBottom: 28 }}
                        >
                            <InputNumber
                                name="price"
                                value={values.price}
                                onChange={value => handleChange({ target: { name: 'price', value } })}
                                onBlur={handleBlur}
                                min={0}
                                style={{ width: '100%', borderRadius: 8 }}
                                placeholder="Giá"
                            />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" loading={isSubmitting} icon={<PlusOutlined />} style={{ width: '100%', borderRadius: 8, height: 44, fontWeight: 600, fontSize: 16 }}>
                            Thêm thuốc
                        </Button>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default PharmaceuticalAdd; 