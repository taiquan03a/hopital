import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, message } from 'antd';
import MedicalRecordForm from '../components/MedicalRecordForm';
import { getAllPatients, getMedicalRecordsByPatient, addMedicalRecord, updateMedicalRecord } from '../services/api';

const MedicalRecords = () => {
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
            const patients = await getAllPatients(userId);
            let allRecords = [];
            for (const patient of patients.result || patients || []) {
                const records = await getMedicalRecordsByPatient(patient.id);
                if (Array.isArray(records)) {
                    allRecords = allRecords.concat(records);
                } else if (records.result) {
                    allRecords = allRecords.concat(records.result);
                }
            }
            setData(allRecords);
        } catch {
            message.error('Không thể tải danh sách hồ sơ bệnh án');
        }
        setLoading(false);
    };
    useEffect(() => { fetchData(); }, [userId]);

    const columns = [
        { title: 'Mã hồ sơ', dataIndex: 'id', key: 'id' },
        { title: 'Bệnh nhân', dataIndex: ['patient_info', 'first_name'], key: 'patient', render: (_, r) => r.patient_info ? `${r.patient_info.first_name || ''} ${r.patient_info.last_name || ''}` : '-' },
        { title: 'Nhân viên', dataIndex: ['employee_info', 'name'], key: 'employee', render: (_, r) => r.employee_info?.name || '-' },
        { title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
        { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at' },
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
                <h2 style={{ margin: 0 }}>Danh sách hồ sơ bệnh án</h2>
                <Button type="primary" onClick={() => setModalOpen(true)}>Thêm hồ sơ</Button>
            </div>
            <Table columns={columns} dataSource={data} loading={loading} rowKey="id" bordered style={{ borderRadius: 8 }} pagination={{ pageSize: 8 }} />
            <Modal open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} title="Thêm hồ sơ" destroyOnClose>
                <MedicalRecordForm onSuccess={() => { setModalOpen(false); fetchData(); }} />
            </Modal>
            <Modal open={editModal} onCancel={() => setEditModal(false)} footer={null} title="Sửa hồ sơ" destroyOnClose>
                {editModal && selected && <MedicalRecordForm initialData={selected} isEdit onSuccess={() => { setEditModal(false); fetchData(); }} />}
            </Modal>
            <Modal open={detailModal} onCancel={() => setDetailModal(false)} footer={null} title="Chi tiết hồ sơ">
                {selected && (
                    <div style={{ lineHeight: 2 }}>
                        <div><b>Mã hồ sơ:</b> {selected.id}</div>
                        <div><b>Bệnh nhân:</b> {selected.patient_info ? `${selected.patient_info.first_name || ''} ${selected.patient_info.last_name || ''}` : '-'}</div>
                        <div><b>Nhân viên:</b> {selected.employee_info?.name || '-'}</div>
                        <div><b>Ghi chú:</b> {selected.notes}</div>
                        <div><b>Ngày tạo:</b> {selected.created_at}</div>
                    </div>
                )}
            </Modal>
        </Card>
    );
};
export default MedicalRecords; 