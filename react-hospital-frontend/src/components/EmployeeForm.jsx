import React from 'react';
import { Formik } from 'formik';
import { Form, Input, Button, Select, Modal } from 'antd';
import * as Yup from 'yup';
import { addEmployee, updateEmployee, getAllPositions, addPosition } from '../services/api';

const schema = Yup.object().shape({
    user_id: Yup.string().required('Bắt buộc'),
    specialist_id: Yup.string().required('Bắt buộc'),
    position: Yup.string().required('Bắt buộc'),
});

const EmployeeForm = ({ onSuccess, initialData, isEdit }) => {
    const [positions, setPositions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [showAddPosition, setShowAddPosition] = React.useState(false);
    const [newPosition, setNewPosition] = React.useState({ name: '', description: '' });
    const [addingPosition, setAddingPosition] = React.useState(false);

    const fetchPositions = async () => {
        setLoading(true);
        try {
            const res = await getAllPositions();
            setPositions(res.result || res || []);
        } catch {
            setPositions([]);
        }
        setLoading(false);
    };
    React.useEffect(() => { fetchPositions(); }, []);

    const currentUserId = localStorage.getItem('user_id') || '';
    const initialValues = initialData ? {
        user_id: initialData.user_id || '',
        specialist_id: initialData.specialist_id || '',
        position: initialData.position?.id ? String(initialData.position.id) : '',
    } : { user_id: currentUserId, specialist_id: '', position: '' };

    const handleAddPosition = async () => {
        setAddingPosition(true);
        try {
            await addPosition(newPosition);
            setShowAddPosition(false);
            setNewPosition({ name: '', description: '' });
            fetchPositions();
        } catch { }
        setAddingPosition(false);
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={schema}
            enableReinitialize
            onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
                try {
                    if (isEdit && initialData) {
                        await updateEmployee(initialData.id, values);
                    } else {
                        await addEmployee(values);
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
                    <Form.Item label="User ID" validateStatus={errors.user_id && touched.user_id ? 'error' : ''} help={touched.user_id && errors.user_id}>
                        <Input name="user_id" value={values.user_id} onChange={handleChange} onBlur={handleBlur} placeholder="User ID" disabled={!isEdit} />
                    </Form.Item>
                    <Form.Item label="Specialist ID" validateStatus={errors.specialist_id && touched.specialist_id ? 'error' : ''} help={touched.specialist_id && errors.specialist_id}>
                        <Input name="specialist_id" value={values.specialist_id} onChange={handleChange} onBlur={handleBlur} placeholder="Specialist ID" />
                    </Form.Item>
                    <Form.Item label="Vị trí" validateStatus={errors.position && touched.position ? 'error' : ''} help={touched.position && errors.position}>
                        <Select
                            name="position"
                            value={values.position}
                            onChange={v => setFieldValue('position', v)}
                            onBlur={handleBlur}
                            placeholder="Chọn vị trí"
                            loading={loading}
                            dropdownRender={menu => (
                                <>
                                    {menu}
                                    <div style={{ padding: 8, textAlign: 'center' }}>
                                        <Button type="link" onClick={() => setShowAddPosition(true)}>
                                            + Thêm vị trí mới
                                        </Button>
                                    </div>
                                </>
                            )}
                        >
                            {positions.map(p => <Select.Option key={p.id} value={String(p.id)}>{p.name}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={isSubmitting} block style={{ marginTop: 8 }}>
                        {isEdit ? 'Cập nhật' : 'Thêm'}
                    </Button>
                    <Modal
                        open={showAddPosition}
                        onCancel={() => setShowAddPosition(false)}
                        onOk={handleAddPosition}
                        confirmLoading={addingPosition}
                        title="Thêm vị trí mới"
                        okText="Thêm"
                        cancelText="Hủy"
                    >
                        <Form layout="vertical">
                            <Form.Item label="Tên vị trí">
                                <Input value={newPosition.name} onChange={e => setNewPosition({ ...newPosition, name: e.target.value })} />
                            </Form.Item>
                            <Form.Item label="Mô tả">
                                <Input.TextArea value={newPosition.description} onChange={e => setNewPosition({ ...newPosition, description: e.target.value })} />
                            </Form.Item>
                        </Form>
                    </Modal>
                </form>
            )}
        </Formik>
    );
};
export default EmployeeForm; 