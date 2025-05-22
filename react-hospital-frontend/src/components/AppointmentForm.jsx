const AppointmentForm = ({ onSuccess, initialData, isEdit }) => {
    const currentUserId = localStorage.getItem('user_id') || '';
    const initialValues = initialData ? {
        doctor_id: initialData.doctor_id || '',
        patient_id: initialData.patient_id || currentUserId,
        appointment_date: initialData.appointment_date || '',
        time: initialData.time || '',
    } : { doctor_id: '', patient_id: currentUserId, appointment_date: '', time: '' };

    const handleSubmitForm = async (values, { setSubmitting, setErrors, resetForm }) => {
        const submitData = {
            ...values,
            patient_id: currentUserId, // luôn lấy user_id hiện tại
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
                    <Form.Item label="Mã bác sĩ" validateStatus={errors.doctor_id && touched.doctor_id ? 'error' : ''} help={touched.doctor_id && errors.doctor_id}>
                        <Input name="doctor_id" value={values.doctor_id} onChange={handleChange} onBlur={handleBlur} placeholder="Doctor ID" />
                    </Form.Item>
                    <Form.Item label="Mã bệnh nhân" validateStatus={errors.patient_id && touched.patient_id ? 'error' : ''} help={touched.patient_id && errors.patient_id}>
                        <Input name="patient_id" value={currentUserId} disabled />
                    </Form.Item>
                    <Form.Item label="Ngày hẹn" validateStatus={errors.appointment_date && touched.appointment_date ? 'error' : ''} help={touched.appointment_date && errors.appointment_date}>
                        <Input name="appointment_date" value={values.appointment_date} onChange={handleChange} onBlur={handleBlur} placeholder="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item label="Giờ hẹn" validateStatus={errors.time && touched.time ? 'error' : ''} help={touched.time && errors.time}>
                        <Input name="time" value={values.time} onChange={handleChange} onBlur={handleBlur} placeholder="HH:mm:ss" />
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