import React, { useState, useEffect } from 'react';
import { Card, Form, Input, DatePicker, TimePicker, Select, Button, message } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { getAllDoctors, addAppointment, getAllPatients } from '../services/api';

const HOSPITAL_INFO = {
    name: 'HealthCare Pro',
    logo: 'https://cdn-icons-png.flaticon.com/512/2966/2966484.png',
    address: 'Số 1, Trần Phú, Hà Đông, Hà Nội',
    phone: '024 1234 5678',
    email: 'contact@ptithospital.vn',
    workingHours: 'Thứ 2 - Thứ 7: 7:00 - 17:00',
    description: 'Hệ thống y tế của chúng tôi cung cấp dịch vụ chăm sóc toàn diện với đội ngũ bác sĩ giàu kinh nghiệm.'
};

const SERVICES = [
    'Khám tổng quát',
    'Chuyên khoa',
    'Xét nghiệm & Chẩn đoán',
    'Dược phẩm',
    'Tiêm chủng',
    'Tư vấn sức khỏe',
    'Khám sức khỏe doanh nghiệp',
    'Nha khoa',
];

const PatientBookAppointment = () => {
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const patient = JSON.parse(localStorage.getItem('patient'));
    const [menuVisible, setMenuVisible] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleMenuClick = ({ key }) => {
        setMenuVisible(false);
        if (key === 'info') navigate('/patient/info');
        if (key === 'history') navigate('/patient/appointments/history');
        if (key === 'logout') {
            localStorage.removeItem('patient');
            message.success('Đã đăng xuất!');
            window.location.reload();
        }
    };

    useEffect(() => {
        getAllDoctors().then(setDoctors);
    }, []);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            let patient_id = null;
            const user_id = patient?.id || patient?.user_id || patient?.user;
            if (user_id) {
                const patients = await getAllPatients(user_id);
                patient_id = Array.isArray(patients) && patients.length > 0 ? patients[0].id : patients?.id;
                if (!patient_id) throw new Error('Không tìm thấy patient_id');
            }
            const payload = {
                doctor_id: values.doctor_id,
                patient_id: patient_id,
                service: values.service,
                appointment_date: values.date.format('YYYY-MM-DD'),
                appointment_time: values.time.format('HH:mm'),
                time: values.time.format('HH:mm'),
                note: values.note || ''
            };
            await addAppointment(payload);
            message.success('Đặt lịch thành công!');
            form.resetFields();
            navigate('/patient/appointments/history');
        } catch (err) {
            message.error(err?.response?.data?.detail || err.message || 'Đặt lịch thất bại!');
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)', display: 'flex', flexDirection: 'column' }}>
            <Header
                hospitalInfo={HOSPITAL_INFO}
                patient={patient}
                menuVisible={menuVisible}
                setMenuVisible={setMenuVisible}
                handleMenuClick={handleMenuClick}
                navigate={navigate}
            />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
                <Card style={{ maxWidth: 600, width: '100%', borderRadius: 24, boxShadow: '0 4px 32px #e0e7ff', padding: 0 }} bodyStyle={{ padding: 48 }}>
                    <h2 style={{ textAlign: 'center', fontWeight: 900, fontSize: 34, marginBottom: 12, color: '#4f46e5', letterSpacing: 1 }}>Đặt lịch khám</h2>
                    <div style={{ textAlign: 'center', color: '#666', fontSize: 18, marginBottom: 32 }}>
                        Vui lòng điền đầy đủ thông tin để đặt lịch khám tại <b>{HOSPITAL_INFO.name}</b>.
                    </div>
                    <Form form={form} layout="vertical" onFinish={onFinish} size="large" style={{ marginTop: 8 }}>
                        <Form.Item name="doctor_id" label="Bác sĩ" rules={[{ required: true, message: 'Vui lòng chọn bác sĩ' }]}>
                            <Select placeholder="Chọn bác sĩ">
                                {doctors.map(d => <Select.Option key={d.id} value={d.id}>{d.full_name || d.name}</Select.Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item name="service" label="Dịch vụ" rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}>
                            <Select placeholder="Chọn dịch vụ">
                                {SERVICES.map(s => <Select.Option key={s} value={s}>{s}</Select.Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item name="date" label="Ngày khám" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
                            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                        </Form.Item>
                        <Form.Item name="time" label="Giờ khám" rules={[{ required: true, message: 'Vui lòng chọn giờ' }]}>
                            <TimePicker style={{ width: '100%' }} format="HH:mm" minuteStep={15} />
                        </Form.Item>
                        <Form.Item name="note" label="Ghi chú">
                            <Input.TextArea rows={3} placeholder="Ghi chú thêm (nếu có)" />
                        </Form.Item>
                        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit" loading={loading} style={{ borderRadius: 10, fontWeight: 700, padding: '0 48px', fontSize: 20, height: 48 }}>
                                Đặt lịch
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
            <Footer />
        </div>
    );
};

export default PatientBookAppointment; 