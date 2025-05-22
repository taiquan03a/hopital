import React from 'react';
import { Formik } from 'formik';
import { Form, Input, Button, Select } from 'antd';
import * as Yup from 'yup';
import { addPatient, updatePatient } from '../services/api';

const schema = Yup.object().shape({
    use_id: Yup.string().required('Bắt buộc'),
    first_name: Yup.string().required('Bắt buộc'),
    last_name: Yup.string().required('Bắt buộc'),
    birth_date: Yup.string().required('Bắt buộc'),
    sex: Yup.string().required('Bắt buộc'),
    address: Yup.string().required('Bắt buộc'),
    phone_number: Yup.string().required('Bắt buộc'),
});

const PatientForm = ({ onSuccess, initialData, isEdit, userId }) => {
    const initialValues = initialData ? {
        use_id: initialData.use_id ? String(initialData.use_id) : (userId || ''),
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        birth_date: initialData.birth_date || '',
        sex: initialData.sex || '',
        address: initialData.address || '',
        phone_number: initialData.phone_number || '',
    } : { use_id: userId || '', first_name: '', last_name: '', birth_date: '', sex: '', address: '', phone_number: '' };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={schema}
            enableReinitialize
            onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
                try {
                    const submitValues = { ...values, use_id: userId };
                    console.log('Submit values:', submitValues);
                    if (isEdit && initialData) {
                        await updatePatient(initialData.id, submitValues);
                    } else {
                        await addPatient(submitValues);
                    }
                    if (onSuccess) onSuccess();
                    resetForm();
                } catch (err) {
                    if (err.response && err.response.data) setErrors(err.response.data);
                }
                setSubmitting(false);
            }}
        >
            {({ errors, touched, isSubmitting, handleChange, handleBlur, values, handleSubmit, setFieldValue }) => (
                <form onSubmit={handleSubmit}>
                    <Form.Item label="Họ" validateStatus={errors.first_name && touched.first_name ? 'error' : ''} help={touched.first_name && errors.first_name}>
                        <Input name="first_name" value={values.first_name} onChange={handleChange} onBlur={handleBlur} placeholder="Họ" />
                    </Form.Item>
                    <Form.Item label="Tên" validateStatus={errors.last_name && touched.last_name ? 'error' : ''} help={touched.last_name && errors.last_name}>
                        <Input name="last_name" value={values.last_name} onChange={handleChange} onBlur={handleBlur} placeholder="Tên" />
                    </Form.Item>
                    <Form.Item label="Ngày sinh" validateStatus={errors.birth_date && touched.birth_date ? 'error' : ''} help={touched.birth_date && errors.birth_date}>
                        <Input name="birth_date" type="date" value={values.birth_date} onChange={handleChange} onBlur={handleBlur} placeholder="Ngày sinh" />
                    </Form.Item>
                    <Form.Item label="Giới tính" validateStatus={errors.sex && touched.sex ? 'error' : ''} help={touched.sex && errors.sex}>
                        <Select name="sex" value={values.sex} onChange={v => setFieldValue('sex', v)} onBlur={handleBlur} placeholder="Chọn giới tính">
                            <Select.Option value="male">Nam</Select.Option>
                            <Select.Option value="female">Nữ</Select.Option>
                            <Select.Option value="other">Khác</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Địa chỉ" validateStatus={errors.address && touched.address ? 'error' : ''} help={touched.address && errors.address}>
                        <Input name="address" value={values.address} onChange={handleChange} onBlur={handleBlur} placeholder="Địa chỉ" />
                    </Form.Item>
                    <Form.Item label="Số điện thoại" validateStatus={errors.phone_number && touched.phone_number ? 'error' : ''} help={touched.phone_number && errors.phone_number}>
                        <Input name="phone_number" value={values.phone_number} onChange={handleChange} onBlur={handleBlur} placeholder="Số điện thoại" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={isSubmitting} block style={{ marginTop: 8 }}>
                        {isEdit ? 'Cập nhật' : 'Thêm'}
                    </Button>
                </form>
            )}
        </Formik>
    );
};
export default PatientForm; 