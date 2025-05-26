import React, { useEffect, useState } from 'react';
import { Table, message, Card, Modal, Select, Spin, Button } from 'antd';
import { getAllPharmaceuticals, getAllCategories, getAllSuppliers, addPharmaceutical } from '../services/api';
import { MedicineBoxOutlined, PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AddPharmaceuticalForm from '../components/AddPharmaceuticalForm';

const PharmaceuticalList = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await getAllPharmaceuticals();
                setData(res.result || res || []);
            } catch (err) {
                message.error('Không thể tải danh sách thuốc');
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const columns = [
        { title: 'Tên thuốc', dataIndex: 'name', key: 'name' },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity' },
        { title: 'Giá', dataIndex: 'price', key: 'price' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description', render: v => v || '-' },
        { title: 'Xuất xứ', dataIndex: 'origin', key: 'origin', render: v => v || '-' },
        { title: 'Ngày sản xuất', dataIndex: 'manufacturing_date', key: 'manufacturing_date', render: v => v || '-' },
        { title: 'Hạn sử dụng', dataIndex: 'expiry_date', key: 'expiry_date', render: v => v || '-' },
        { title: 'Danh mục', dataIndex: ['category', 'name'], key: 'category', render: (_, record) => record.category?.name || '-' },
        { title: 'Nhà cung cấp', dataIndex: ['supplier', 'name'], key: 'supplier', render: (_, record) => record.supplier?.name || '-' },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <div style={{ display: 'flex', gap: 8 }}>
                    <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewDetail(record)} />
                    <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
                </div>
            )
        }
    ];

    const openAddModal = async () => {
        setModalOpen(true);
        setModalLoading(true);
        try {
            const cats = await getAllCategories();
            setCategories(cats);
            const sups = await getAllSuppliers();
            setSuppliers(sups);
        } catch (e) {
            message.error('Không thể tải danh mục hoặc nhà cung cấp');
        }
        setModalLoading(false);
    };

    const handleViewDetail = (item) => {
        setSelectedItem(item);
        setDetailModal(true);
    };
    const handleEdit = (item) => {
        setSelectedItem(item);
        setEditModal(true);
    };

    return (
        <div>
            <Card
                bordered={false}
                style={{ borderRadius: 16, boxShadow: '0 2px 8px #f0f1f2', margin: 24 }}
                cover={
                    <div style={{ textAlign: 'center', padding: 16 }}>
                        <MedicineBoxOutlined style={{ fontSize: 48, color: '#52c41a' }} />
                    </div>
                }
            >
                <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: 28, marginBottom: 8 }}>Danh sách thuốc</h2>
                <div style={{ textAlign: 'center', marginBottom: 16, color: '#666' }}>
                    Quản lý, tra cứu thông tin các loại thuốc trong hệ thống
                </div>
                <div style={{ textAlign: 'right', marginBottom: 16 }}>
                    <Button type="primary" icon={<PlusOutlined />} size="large" style={{ borderRadius: 8 }} onClick={openAddModal}>
                        Thêm thuốc
                    </Button>
                </div>
                <Modal
                    open={modalOpen}
                    onCancel={() => setModalOpen(false)}
                    footer={null}
                    title={<div style={{ textAlign: 'center', fontWeight: 600, fontSize: 20 }}>Thêm thuốc mới</div>}
                    destroyOnClose
                    bodyStyle={{ padding: 32, borderRadius: 16 }}
                >
                    {modalLoading ? (
                        <div style={{ textAlign: 'center', padding: '32px 0' }}><Spin /></div>
                    ) : (
                        <AddPharmaceuticalForm
                            categories={categories}
                            suppliers={suppliers}
                            onSuccess={() => {
                                setModalOpen(false);
                                message.success('Thêm thuốc thành công!');
                                setLoading(true);
                                getAllPharmaceuticals().then(res => setData(res.result || res || [])).finally(() => setLoading(false));
                            }}
                        />
                    )}
                </Modal>
                <Modal
                    open={detailModal}
                    onCancel={() => setDetailModal(false)}
                    footer={null}
                    title={<div style={{ textAlign: 'center', fontWeight: 600, fontSize: 20 }}>Chi tiết thuốc</div>}
                    bodyStyle={{ padding: 32, borderRadius: 16 }}
                >
                    {selectedItem && (
                        <div style={{ lineHeight: 2, fontSize: 16 }}>
                            <div><b>Tên thuốc:</b> {selectedItem.name}</div>
                            <div><b>Số lượng:</b> {selectedItem.quantity}</div>
                            <div><b>Giá:</b> {selectedItem.price}</div>
                            <div><b>Mô tả:</b> {selectedItem.description || '-'}</div>
                            <div><b>Xuất xứ:</b> {selectedItem.origin || '-'}</div>
                            <div><b>Ngày sản xuất:</b> {selectedItem.manufacturing_date || '-'}</div>
                            <div><b>Hạn sử dụng:</b> {selectedItem.expiry_date || '-'}</div>
                            <div><b>Danh mục:</b> {selectedItem.category?.name || '-'}</div>
                            <div><b>Nhà cung cấp:</b> {selectedItem.supplier?.name || '-'}</div>
                        </div>
                    )}
                </Modal>
                <Modal
                    open={editModal}
                    onCancel={() => setEditModal(false)}
                    footer={null}
                    title={<div style={{ textAlign: 'center', fontWeight: 600, fontSize: 20 }}>Chỉnh sửa thuốc</div>}
                    destroyOnClose
                    bodyStyle={{ padding: 32, borderRadius: 16 }}
                >
                    {editModal && selectedItem && (
                        <AddPharmaceuticalForm
                            categories={categories}
                            suppliers={suppliers}
                            onSuccess={() => {
                                setEditModal(false);
                                setLoading(true);
                                getAllPharmaceuticals().then(res => setData(res.result || res || [])).finally(() => setLoading(false));
                            }}
                            initialData={selectedItem}
                            isEdit
                        />
                    )}
                </Modal>
                <Table
                    columns={columns.map(col => col.key === 'actions' ? {
                        ...col,
                        render: (_, record) => (
                            <div style={{ display: 'flex', gap: 8 }}>
                                <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewDetail(record)} />
                                <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
                            </div>
                        )
                    } : col)}
                    dataSource={data}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 8 }}
                    bordered
                    scroll={{ x: 'max-content' }}
                    style={{ borderRadius: 12 }}
                />
            </Card>
        </div>
    );
};

export default PharmaceuticalList; 