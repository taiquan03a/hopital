import React from 'react';
import { Formik } from 'formik';
import { Form, Input, Button, Select } from 'antd';
import * as Yup from 'yup';
import { addMedicalRecord, updateMedicalRecord, getAllPatients } from '../services/api';

const schema = Yup.object().shape({
    patient_id: Yup.string().required('Bắt buộc'),
    employee_id: Yup.string().required('Bắt buộc'),
    notes: Yup.string(),
});

const MedicalRecordForm = ({ onSuccess, initialData, isEdit }) => {
    const userId = localStorage.getItem('user_id');
    const [patients, setPatients] = React.useState([]);
    React.useEffect(() => {
        if (userId) getAllPatients(userId).then(res => setPatients(res.result || res || []));
    }, [userId]);
    const initialValues = initialData ? {
        patient_id: initialData.patient_id ? String(initialData.patient_id) : '',
        employee_id: initialData.employee_id || '',
        notes: initialData.notes || '',
    } : { patient_id: '', employee_id: '', notes: '' };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={schema}
            enableReinitialize
            onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
                try {
                    if (isEdit && initialData) {
                        await updateMedicalRecord(initialData.id, values);
                    } else {
                        await addMedicalRecord(values);
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
                    <Form.Item label="Bệnh nhân" validateStatus={errors.patient_id && touched.patient_id ? 'error' : ''} help={touched.patient_id && errors.patient_id}>
                        <Select name="patient_id" value={values.patient_id} onChange={v => setFieldValue('patient_id', v)} onBlur={handleBlur} placeholder="Chọn bệnh nhân">
                            {patients.map(p => <Select.Option key={p.id} value={String(p.id)}>{`${p.first_name || ''} ${p.last_name || ''}`.trim()}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Nhân viên" validateStatus={errors.employee_id && touched.employee_id ? 'error' : ''} help={touched.employee_id && errors.employee_id}>
                        <Input name="employee_id" value={values.employee_id} onChange={handleChange} onBlur={handleBlur} placeholder="ID nhân viên" />
                    </Form.Item>
                    <Form.Item label="Ghi chú" validateStatus={errors.notes && touched.notes ? 'error' : ''} help={touched.notes && errors.notes}>
                        <Input.TextArea name="notes" value={values.notes} onChange={handleChange} onBlur={handleBlur} placeholder="Ghi chú" rows={2} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={isSubmitting} block style={{ marginTop: 8 }}>
                        {isEdit ? 'Cập nhật' : 'Thêm'}
                    </Button>
                </form>
            )}
        </Formik>
    );
};
export default MedicalRecordForm; 