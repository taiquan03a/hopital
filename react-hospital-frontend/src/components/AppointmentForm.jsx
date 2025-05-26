import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Input, Button, Select, DatePicker, TimePicker } from 'antd';
import React, { useEffect, useState } from 'react';
import { getAllDoctors, getAllPatients, addAppointment, updateAppointment } from '../services/api';
import dayjs from 'dayjs';

const { Option } = Select;

const schema = Yup.object().shape({
    doctor_id: Yup.string().required('Bắt buộc'),
    patient_id: Yup.string().required('Bắt buộc'),
    appointment_date: Yup.string().required('Bắt buộc'),
    time: Yup.string().required('Bắt buộc'),
});

const AppointmentForm = ({ onSuccess, initialData, isEdit }) => {
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const currentUserId = localStorage.getItem('user_id') || '';
    const initialValues = initialData ? {
        doctor_id: initialData.doctor_id || '',
        patient_id: initialData.patient_id || '',
        appointment_date: initialData.appointment_date || '',
        time: initialData.time || '',
    } : { doctor_id: '', patient_id: '', appointment_date: '', time: '' };

    useEffect(() => {
        // Lấy danh sách bác sĩ
        getAllDoctors().then(res => {
            // Nếu API trả về mảng trực tiếp
            const list = res.result || res || [];
            setDoctors(list);
        });
        // Lấy danh sách bệnh nhân theo user_id hiện tại
        if (currentUserId) {
            getAllPatients(currentUserId).then(res => {
                const list = res.result || res || [];
                setPatients(list);
            });
        }
    }, [currentUserId]);

    const handleSubmitForm = async (values, { setSubmitting, setErrors, resetForm }) => {
        const submitData = {
            ...values,
        };
        try {
            if (isEdit && initialData) {
                await updateAppointment(initialData.id, submitData);
            } else {
                await addAppointment(submitData);
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
            {({ errors, touched, isSubmitting, handleChange, handleBlur, values, handleSubmit, setFieldValue }) => (
                <form onSubmit={handleSubmit}>
                    <Form.Item label="Bác sĩ" validateStatus={errors.doctor_id && touched.doctor_id ? 'error' : ''} help={touched.doctor_id && errors.doctor_id}>
                        <Select
                            name="doctor_id"
                            value={values.doctor_id}
                            onChange={value => setFieldValue('doctor_id', value)}
                            placeholder="Chọn bác sĩ"
                            showSearch
                            optionFilterProp="children"
                        >
                            {doctors.map(d => (
                                <Option key={d.id || d.user_id} value={String(d.id || d.user_id)}>
                                    {d.name || `${d.first_name || ''} ${d.last_name || ''}`.trim() || d.username || d.email || d.id}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Bệnh nhân" validateStatus={errors.patient_id && touched.patient_id ? 'error' : ''} help={touched.patient_id && errors.patient_id}>
                        <Select
                            name="patient_id"
                            value={values.patient_id}
                            onChange={value => setFieldValue('patient_id', value)}
                            placeholder="Chọn bệnh nhân"
                            showSearch
                            optionFilterProp="children"
                        >
                            {patients.map(p => (
                                <Option key={p.id || p.patient_id} value={String(p.id || p.patient_id)}>
                                    {p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || p.username || p.email || p.id}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Ngày hẹn" validateStatus={errors.appointment_date && touched.appointment_date ? 'error' : ''} help={touched.appointment_date && errors.appointment_date}>
                        <DatePicker
                            name="appointment_date"
                            value={values.appointment_date ? dayjs(values.appointment_date) : null}
                            onChange={date => setFieldValue('appointment_date', date ? date.format('YYYY-MM-DD') : '')}
                            format="YYYY-MM-DD"
                            style={{ width: '100%' }}
                            placeholder="Chọn ngày"
                        />
                    </Form.Item>
                    <Form.Item label="Giờ hẹn" validateStatus={errors.time && touched.time ? 'error' : ''} help={touched.time && errors.time}>
                        <TimePicker
                            name="time"
                            value={values.time ? dayjs(values.time, 'HH:mm:ss') : null}
                            onChange={time => setFieldValue('time', time ? time.format('HH:mm:ss') : '')}
                            format="HH:mm:ss"
                            style={{ width: '100%' }}
                            placeholder="Chọn giờ"
                        />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={isSubmitting} block style={{ marginTop: 8 }}>
                        {isEdit ? 'Cập nhật' : 'Thêm'}
                    </Button>
                </form>
            )}
        </Formik>
    );
};

export default AppointmentForm; 