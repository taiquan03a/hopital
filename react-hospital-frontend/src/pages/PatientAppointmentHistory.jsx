import React, { useState } from 'react';
import { Card, List, Tag, message, Button, Modal, Descriptions } from 'antd';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getAppointmentsByPatient, getAllPatients } from '../services/api';

const HOSPITAL_INFO = {
    name: 'HealthCare Pro',
    logo: 'https://cdn-icons-png.flaticon.com/512/2966/2966484.png',
    address: 'Số 1, Trần Phú, Hà Đông, Hà Nội',
    phone: '024 1234 5678',
    email: 'contact@ptithospital.vn',
    workingHours: 'Thứ 2 - Thứ 7: 7:00 - 17:00',
    description: 'Hệ thống y tế của chúng tôi cung cấp dịch vụ chăm sóc toàn diện với đội ngũ bác sĩ giàu kinh nghiệm.'
};

const statusColor = {
    'Đã xác nhận': 'blue',
    'Đã hoàn thành': 'green',
    'Đã hủy': 'red',
};

const PatientAppointmentHistory = () => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [history, setHistory] = useState([]);
    const [detail, setDetail] = useState(null);
    const [detailVisible, setDetailVisible] = useState(false);
    const patient = JSON.parse(localStorage.getItem('patient'));
    const handleMenuClick = ({ key }) => {
        setMenuVisible(false);
        if (key === 'info') window.location.href = '/patient/info';
        if (key === 'history') window.location.href = '/patient/appointments/history';
        if (key === 'logout') {
            localStorage.removeItem('patient');
            message.success('Đã đăng xuất!');
            window.location.reload();
        }
    };
    React.useEffect(() => {
        const user_id = patient?.id || patient?.user_id || patient?.user;
        if (user_id) {
            getAllPatients(user_id)
                .then(patients => {
                    const patient_id = Array.isArray(patients) && patients.length > 0 ? patients[0].id : patients?.id;
                    if (!patient_id) throw new Error('Không tìm thấy patient_id');
                    return getAppointmentsByPatient(patient_id);
                })
                .then(setHistory)
                .catch(() => message.error('Không lấy được lịch sử đặt lịch!'));
        }
    }, []);
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)', display: 'flex', flexDirection: 'column' }}>
            <Header
                hospitalInfo={HOSPITAL_INFO}
                patient={patient}
                menuVisible={menuVisible}
                setMenuVisible={setMenuVisible}
                handleMenuClick={handleMenuClick}
            />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
                <Card style={{ maxWidth: 800, width: '100%', borderRadius: 28, boxShadow: '0 4px 32px #e0e7ff', padding: 0 }} bodyStyle={{ padding: 48 }}>
                    <h2 style={{ textAlign: 'center', fontWeight: 900, fontSize: 34, marginBottom: 32, color: '#4f46e5', letterSpacing: 1 }}>Lịch sử đặt lịch</h2>
                    <List
                        itemLayout="horizontal"
                        dataSource={history}
                        renderItem={item => (
                            <List.Item style={{ padding: '24px 0', borderBottom: '1px solid #f0f0f0' }}
                                actions={[<Button type="link" onClick={() => { setDetail(item); setDetailVisible(true); }}>Xem chi tiết</Button>]}
                            >
                                <List.Item.Meta
                                    title={<span style={{ fontWeight: 700, fontSize: 22 }}>{item.service || item.service_name || '---'}</span>}
                                    description={<>
                                        <span style={{ fontSize: 18 }}>
                                            <b>Ngày:</b> {item.appointment_date || item.date || '---'} &nbsp; <b>Giờ:</b> {item.time || item.appointment_time || '---'}<br />
                                            <b>Bác sĩ:</b> {item.doctor_info?.full_name || item.doctor_info?.name || item.doctor_id || '---'}<br />
                                            <b>Bệnh nhân:</b> {item.patient_info?.first_name} {item.patient_info?.last_name} ({item.patient_info?.phone_number})
                                        </span><br />
                                        {item.note && <span style={{ fontSize: 17 }}><b>Ghi chú:</b> {item.note}<br /></span>}
                                        <Tag color={statusColor[item.status] || 'default'} style={{ fontSize: 16, padding: '4px 18px', borderRadius: 8, fontWeight: 600 }}>{item.status}</Tag>
                                    </>}
                                />
                            </List.Item>
                        )}
                    />
                    <Modal
                        open={detailVisible}
                        onCancel={() => setDetailVisible(false)}
                        footer={null}
                        title="Chi tiết đơn đặt lịch"
                        width={600}
                    >
                        {detail && (
                            <Descriptions bordered column={1} size="middle">
                                <Descriptions.Item label="Dịch vụ">{detail.service || detail.service_name || '---'}</Descriptions.Item>
                                <Descriptions.Item label="Ngày khám">{detail.appointment_date || detail.date || '---'}</Descriptions.Item>
                                <Descriptions.Item label="Giờ khám">{detail.time || detail.appointment_time || '---'}</Descriptions.Item>
                                <Descriptions.Item label="Trạng thái">{detail.status}</Descriptions.Item>
                                <Descriptions.Item label="Bác sĩ">
                                    {detail.doctor_info?.full_name || detail.doctor_info?.name || detail.doctor_id || '---'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Bệnh nhân">
                                    {detail.patient_info?.first_name} {detail.patient_info?.last_name}
                                </Descriptions.Item>
                                <Descriptions.Item label="Số điện thoại">
                                    {detail.patient_info?.phone_number}
                                </Descriptions.Item>
                                <Descriptions.Item label="Địa chỉ">
                                    {detail.patient_info?.address}
                                </Descriptions.Item>
                                <Descriptions.Item label="Giới tính">
                                    {detail.patient_info?.sex}
                                </Descriptions.Item>
                                <Descriptions.Item label="Ghi chú">
                                    {detail.note || '---'}
                                </Descriptions.Item>
                            </Descriptions>
                        )}
                    </Modal>
                </Card>
            </div>
            <Footer />
        </div>
    );
};

export default PatientAppointmentHistory; 