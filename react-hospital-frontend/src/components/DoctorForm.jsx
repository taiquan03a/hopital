import React from 'react';
import { Formik } from 'formik';
import { Form, Input, Button, InputNumber } from 'antd';
import * as Yup from 'yup';
import { addDoctor, updateDoctor } from '../services/api';

const schema = Yup.object().shape({
    user_id: Yup.string().required('Bắt buộc'),
    wage: Yup.number().required('Bắt buộc'),
    specialist_id: Yup.string().required('Bắt buộc'),
});

const DoctorForm = ({ onSuccess, initialData, isEdit }) => {
    const currentUserId = localStorage.getItem('user_id') || '';
    const initialValues = initialData ? {
        user_id: initialData.user_id || '',
        wage: initialData.wage || '',
        specialist_id: initialData.specialist_id || '',
    } : { user_id: currentUserId, wage: '', specialist_id: '' };

    // Chỉ lấy các trường cần thiết khi submit
    const handleSubmitForm = async (values, { setSubmitting, setErrors, resetForm }) => {
        const submitData = {
            user_id: values.user_id,
            wage: values.wage,
            specialist_id: values.specialist_id,
        };
        try {
            if (isEdit && initialData) {
                await updateDoctor(initialData.id, submitData);
            } else {
                await addDoctor(submitData);
            }
            if (onSuccess) onSuccess();
            resetForm();
        } catch (err) {
            if (err.response && err.response.data) setErrors(err.response.data);
        }
        setSubmitting(false);
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={schema}
            enableReinitialize
            onSubmit={handleSubmitForm}
        >
            {({ errors, touched, isSubmitting, handleChange, handleBlur, values, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <Form.Item label="User ID" validateStatus={errors.user_id && touched.user_id ? 'error' : ''} help={touched.user_id && errors.user_id}>
                        <Input name="user_id" value={values.user_id} onChange={handleChange} onBlur={handleBlur} placeholder="User ID" disabled={!isEdit} />
                    </Form.Item>
                    <Form.Item label="Lương" validateStatus={errors.wage && touched.wage ? 'error' : ''} help={touched.wage && errors.wage}>
                        <InputNumber name="wage" value={values.wage} onChange={v => handleChange({ target: { name: 'wage', value: v } })} onBlur={handleBlur} placeholder="Lương" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Specialist ID" validateStatus={errors.specialist_id && touched.specialist_id ? 'error' : ''} help={touched.specialist_id && errors.specialist_id}>
                        <Input name="specialist_id" value={values.specialist_id} onChange={handleChange} onBlur={handleBlur} placeholder="Specialist ID" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={isSubmitting} block style={{ marginTop: 8 }}>
                        {isEdit ? 'Cập nhật' : 'Thêm'}
                    </Button>
                </form>
            )}
        </Formik>
    );
};
export default DoctorForm; 