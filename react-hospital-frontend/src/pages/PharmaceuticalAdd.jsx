import React from 'react';
import { Formik } from 'formik';
import { Form, Input, Button, message, InputNumber } from 'antd';
import * as Yup from 'yup';
import { addPharmaceutical } from '../services/api';
import { useNavigate } from 'react-router-dom';

const PharmaceuticalAddSchema = Yup.object().shape({
    name: Yup.string().required('Bắt buộc'),
    code: Yup.string().required('Bắt buộc'),
    unit: Yup.string().required('Bắt buộc'),
    price: Yup.number().required('Bắt buộc').min(0, 'Giá phải >= 0'),
});

const PharmaceuticalAdd = () => {
    const navigate = useNavigate();
    return (
        <div>
            <h2>Thêm thuốc mới</h2>
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
                    <form onSubmit={handleSubmit}>
                        <Form.Item
                            label="Tên thuốc"
                            validateStatus={errors.name && touched.name ? 'error' : ''}
                            help={touched.name && errors.name}
                        >
                            <Input
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Tên thuốc"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Mã"
                            validateStatus={errors.code && touched.code ? 'error' : ''}
                            help={touched.code && errors.code}
                        >
                            <Input
                                name="code"
                                value={values.code}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Mã thuốc"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Đơn vị"
                            validateStatus={errors.unit && touched.unit ? 'error' : ''}
                            help={touched.unit && errors.unit}
                        >
                            <Input
                                name="unit"
                                value={values.unit}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Đơn vị"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Giá"
                            validateStatus={errors.price && touched.price ? 'error' : ''}
                            help={touched.price && errors.price}
                        >
                            <InputNumber
                                name="price"
                                value={values.price}
                                onChange={value => handleChange({ target: { name: 'price', value } })}
                                onBlur={handleBlur}
                                min={0}
                                style={{ width: '100%' }}
                                placeholder="Giá"
                            />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" loading={isSubmitting}>
                            Thêm thuốc
                        </Button>
                    </form>
                )}
            </Formik>
        </div>
    );
};

export default PharmaceuticalAdd; 