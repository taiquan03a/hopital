import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, message } from 'antd';
import DoctorForm from '../components/DoctorForm';
import { getAllDoctors, getDoctorDetail, deleteDoctor } from '../services/api';

const Doctors = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [selected, setSelected] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllDoctors();
            setData(res.result || res || []);
        } catch {
            message.error('Không thể tải danh sách bác sĩ');
        }
        setLoading(false);
    };
    useEffect(() => { fetchData(); }, []);

    const columns = [
        { title: 'User ID', dataIndex: 'user_id', key: 'user_id' },
        { title: 'Lương', dataIndex: 'wage', key: 'wage' },
        { title: 'Specialist ID', dataIndex: 'specialist_id', key: 'specialist_id' },
        { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at' },
        { title: 'Ngày cập nhật', dataIndex: 'updated_at', key: 'updated_at' },
        {
            title: 'Hành động', key: 'actions', render: (_, record) => (
                <>
                    <Button size="small" onClick={() => { setSelected(record); setDetailModal(true); }}>Xem</Button>
                    <Button size="small" style={{ marginLeft: 8 }} onClick={() => { setSelected(record); setEditModal(true); }}>Sửa</Button>
                    <Button size="small" danger style={{ marginLeft: 8 }} onClick={async () => {
                        try {
                            await deleteDoctor(record.id);
                            message.success('Đã xóa bác sĩ');
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
                <h2 style={{ margin: 0 }}>Danh sách bác sĩ</h2>
                <Button type="primary" onClick={() => setModalOpen(true)}>Thêm bác sĩ</Button>
            </div>
            <Table columns={columns} dataSource={data} loading={loading} rowKey="id" bordered style={{ borderRadius: 8 }} pagination={{ pageSize: 8 }} />
            <Modal open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} title="Thêm bác sĩ" destroyOnClose>
                <DoctorForm onSuccess={() => { setModalOpen(false); fetchData(); }} />
            </Modal>
            <Modal open={editModal} onCancel={() => setEditModal(false)} footer={null} title="Sửa bác sĩ" destroyOnClose>
                {editModal && selected && <DoctorForm initialData={selected} isEdit onSuccess={() => { setEditModal(false); fetchData(); }} />}
            </Modal>
            <Modal open={detailModal} onCancel={() => setDetailModal(false)} footer={null} title="Chi tiết bác sĩ">
                {selected && (
                    <div style={{ lineHeight: 2 }}>
                        <div><b>User ID:</b> {selected.user_id}</div>
                        <div><b>Lương:</b> {selected.wage}</div>
                        <div><b>Specialist ID:</b> {selected.specialist_id}</div>
                        <div><b>Ngày tạo:</b> {selected.created_at}</div>
                        <div><b>Ngày cập nhật:</b> {selected.updated_at}</div>
                    </div>
                )}
            </Modal>
        </Card>
    );
};
export default Doctors; 