import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, message } from 'antd';
import EmployeeForm from '../components/EmployeeForm';
import { getAllEmployees } from '../services/api';

const Employees = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [selected, setSelected] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllEmployees();
            setData(res.result || res || []);
        } catch {
            message.error('Không thể tải danh sách nhân viên');
        }
        setLoading(false);
    };
    useEffect(() => { fetchData(); }, []);

    const columns = [
        { title: 'User ID', dataIndex: 'user_id', key: 'user_id' },
        { title: 'Specialist ID', dataIndex: 'specialist_id', key: 'specialist_id' },
        { title: 'Vị trí', dataIndex: ['position', 'name'], key: 'position', render: (_, r) => r.position?.name || '-' },
        { title: 'Mô tả vị trí', dataIndex: ['position', 'description'], key: 'position_desc', render: (_, r) => r.position?.description || '-' },
        { title: 'Ngày tạo', dataIndex: 'created_at', key: 'created_at' },
        { title: 'Ngày cập nhật', dataIndex: 'updated_at', key: 'updated_at' },
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
                <h2 style={{ margin: 0 }}>Danh sách nhân viên</h2>
                <Button type="primary" onClick={() => setModalOpen(true)}>Thêm nhân viên</Button>
            </div>
            <Table columns={columns} dataSource={data} loading={loading} rowKey="id" bordered style={{ borderRadius: 8 }} pagination={{ pageSize: 8 }} />
            <Modal open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} title="Thêm nhân viên" destroyOnClose>
                <EmployeeForm onSuccess={() => { setModalOpen(false); fetchData(); }} />
            </Modal>
            <Modal open={editModal} onCancel={() => setEditModal(false)} footer={null} title="Sửa nhân viên" destroyOnClose>
                {editModal && selected && <EmployeeForm initialData={selected} isEdit onSuccess={() => { setEditModal(false); fetchData(); }} />}
            </Modal>
            <Modal open={detailModal} onCancel={() => setDetailModal(false)} footer={null} title="Chi tiết nhân viên">
                {selected && (
                    <div style={{ lineHeight: 2 }}>
                        <div><b>User ID:</b> {selected.user_id}</div>
                        <div><b>Specialist ID:</b> {selected.specialist_id}</div>
                        <div><b>Vị trí:</b> {selected.position?.name || '-'}</div>
                        <div><b>Mô tả vị trí:</b> {selected.position?.description || '-'}</div>
                        <div><b>Ngày tạo:</b> {selected.created_at}</div>
                        <div><b>Ngày cập nhật:</b> {selected.updated_at}</div>
                    </div>
                )}
            </Modal>
        </Card>
    );
};
export default Employees; 