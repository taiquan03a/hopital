import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, message, Tag } from 'antd';
import AppointmentForm from '../components/AppointmentForm';
import { getAppointmentsByPatient, deleteAppointment } from '../services/api';

const Appointments = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [selected, setSelected] = useState(null);
    const userId = localStorage.getItem('user_id') || '';

    const fetchData = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await getAppointmentsByPatient(userId);
            setData(res.result || res || []);
        } catch {
            message.error('Không thể tải danh sách lịch hẹn');
        }
        setLoading(false);
    };
    useEffect(() => { fetchData(); }, [userId]);

    const columns = [
        { title: 'Bác sĩ', dataIndex: 'doctor_id', key: 'doctor_id' },
        { title: 'Bệnh nhân', dataIndex: 'patient_id', key: 'patient_id' },
        { title: 'Ngày hẹn', dataIndex: 'appointment_date', key: 'appointment_date' },
        { title: 'Giờ', dataIndex: 'time', key: 'time' },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: s => <Tag color={s === 0 ? 'blue' : 'green'}>{s === 0 ? 'Chờ' : 'Hoàn thành'}</Tag> },
        { title: 'Ngày tạo', dataIndex: 'create_date', key: 'create_date' },
        {
            title: 'Hành động', key: 'actions', render: (_, record) => (
                <>
                    <Button size="small" onClick={() => { setSelected(record); setDetailModal(true); }}>Xem</Button>
                    <Button size="small" style={{ marginLeft: 8 }} onClick={() => { setSelected(record); setEditModal(true); }}>Sửa</Button>
                    <Button size="small" danger style={{ marginLeft: 8 }} onClick={async () => {
                        try {
                            await deleteAppointment(record.id);
                            message.success('Đã xóa lịch hẹn');
                            fetchData();
                        } catch {
                            message.error('Không thể xóa');
                        }
                    }}>Xóa</Button>
                </>
            )
        }
    ];

    return (
        <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2', margin: 16 }} bodyStyle={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Lịch hẹn của bạn</h2>
                <Button type="primary" onClick={() => setModalOpen(true)}>Thêm lịch hẹn</Button>
            </div>
            <Table columns={columns} dataSource={data} loading={loading} rowKey="id" bordered style={{ borderRadius: 8 }} pagination={{ pageSize: 8 }} />
            <Modal open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} title="Thêm lịch hẹn" destroyOnClose>
                <AppointmentForm onSuccess={() => { setModalOpen(false); fetchData(); }} />
            </Modal>
            <Modal open={editModal} onCancel={() => setEditModal(false)} footer={null} title="Sửa lịch hẹn" destroyOnClose>
                {editModal && selected && <AppointmentForm initialData={selected} isEdit onSuccess={() => { setEditModal(false); fetchData(); }} />}
            </Modal>
            <Modal open={detailModal} onCancel={() => setDetailModal(false)} footer={null} title="Chi tiết lịch hẹn">
                {selected && (
                    <div style={{ lineHeight: 2 }}>
                        <div><b>Bác sĩ:</b> {selected.doctor_id}</div>
                        <div><b>Bệnh nhân:</b> {selected.patient_id}</div>
                        <div><b>Ngày hẹn:</b> {selected.appointment_date}</div>
                        <div><b>Giờ:</b> {selected.time}</div>
                        <div><b>Trạng thái:</b> {selected.status === 0 ? 'Chờ' : 'Hoàn thành'}</div>
                        <div><b>Ngày tạo:</b> {selected.create_date}</div>
                    </div>
                )}
            </Modal>
        </Card>
    );
};
export default Appointments; 