import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, message } from 'antd';
import PatientForm from '../components/PatientForm';
import { getAllPatients, addPatient, updatePatient } from '../services/api';

const Patients = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [selected, setSelected] = useState(null);
    const userId = localStorage.getItem('user_id');

    const fetchData = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await getAllPatients(userId);
            setData(res.result || res || []);
        } catch {
            message.error('Không thể tải danh sách bệnh nhân');
        }
        setLoading(false);
    };
    useEffect(() => { fetchData(); }, [userId]);

    const columns = [
        { title: 'Họ', dataIndex: 'first_name', key: 'first_name' },
        { title: 'Tên', dataIndex: 'last_name', key: 'last_name' },
        { title: 'Ngày sinh', dataIndex: 'birth_date', key: 'birth_date' },
        { title: 'Giới tính', dataIndex: 'sex', key: 'sex' },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
        { title: 'SĐT', dataIndex: 'phone_number', key: 'phone_number' },
        {
            title: 'Hành động', key: 'actions', render: (_, record) => (
                <>
                    <Button size="small" onClick={() => { setSelected(record); setDetailModal(true); }}>Xem</Button>
                    <Button size="small" style={{ marginLeft: 8 }} onClick={() => { setSelected(record); setEditModal(true); }}>Sửa</Button>
                </>
            )
        }
    ];

    return (
        <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px #f0f1f2', margin: 16 }} bodyStyle={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Danh sách bệnh nhân</h2>
                <Button type="primary" onClick={() => setModalOpen(true)}>Thêm bệnh nhân</Button>
            </div>
            <Table columns={columns} dataSource={data} loading={loading} rowKey="id" bordered style={{ borderRadius: 8 }} pagination={{ pageSize: 8 }} />
            <Modal open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} title="Thêm bệnh nhân" destroyOnClose>
                <PatientForm userId={userId} onSuccess={() => { setModalOpen(false); fetchData(); }} />
            </Modal>
            <Modal open={editModal} onCancel={() => setEditModal(false)} footer={null} title="Sửa bệnh nhân" destroyOnClose>
                {editModal && selected && <PatientForm userId={userId} initialData={selected} isEdit onSuccess={() => { setEditModal(false); fetchData(); }} />}
            </Modal>
            <Modal open={detailModal} onCancel={() => setDetailModal(false)} footer={null} title="Chi tiết bệnh nhân">
                {selected && (
                    <div style={{ lineHeight: 2 }}>
                        <div><b>Họ:</b> {selected.first_name}</div>
                        <div><b>Tên:</b> {selected.last_name}</div>
                        <div><b>Ngày sinh:</b> {selected.birth_date}</div>
                        <div><b>Giới tính:</b> {selected.sex}</div>
                        <div><b>Địa chỉ:</b> {selected.address}</div>
                        <div><b>SĐT:</b> {selected.phone_number}</div>
                    </div>
                )}
            </Modal>
        </Card>
    );
};
export default Patients; 