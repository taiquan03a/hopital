import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Select, Divider } from 'antd';
import { getAllTreatments, addTreatment, updateTreatment, deleteTreatment, getAllDiseases, addDisease, getAllSymptoms, addSymptom } from '../services/api';
import { PlusOutlined } from '@ant-design/icons';

const Treatments = () => {
    const [data, setData] = useState([]);
    const [diseases, setDiseases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [diseaseModal, setDiseaseModal] = useState(false);
    const [newDisease, setNewDisease] = useState({ name: '', icd_code: '', description: '' });
    const [symptomModal, setSymptomModal] = useState(false);
    const [newSymptom, setNewSymptom] = useState({ name: '', description: '', disease: '' });
    const [symptoms, setSymptoms] = useState([]);
    const [selectedDiseaseId, setSelectedDiseaseId] = useState('');
    const [diseaseForm] = Form.useForm();
    const [formKey, setFormKey] = useState(0);
    const [symptomForm] = Form.useForm();

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllTreatments();
            setData(res.result || res || []);
        } catch {
            message.error('Không thể tải danh sách phác đồ');
        }
        setLoading(false);
    };

    const fetchDiseases = async () => {
        try {
            const res = await getAllDiseases();
            setDiseases(res.result || res || []);
        } catch { }
    };

    const fetchSymptoms = async (diseaseId) => {
        try {
            const res = await getAllSymptoms();
            setSymptoms((res.result || res || []).filter(s => s.disease === diseaseId));
        } catch { }
    };

    useEffect(() => { fetchData(); fetchDiseases(); }, []);

    const columns = [
        { title: 'Tên phác đồ', dataIndex: 'name', key: 'name' },
        { title: 'Mô tả', dataIndex: 'description', key: 'description' },
        { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
        {
            title: 'Bệnh',
            dataIndex: 'disease',
            key: 'disease',
            render: id => diseases.find(d => d.id === id)?.name || id
        },
        {
            title: 'Hành động', key: 'actions', render: (_, record) => (
                <>
                    <Button size="small" onClick={() => { setEditData(record); setModalOpen(true); }}>Sửa</Button>
                    <Button size="small" danger style={{ marginLeft: 8 }} onClick={async () => {
                        await deleteTreatment(record.id);
                        message.success('Đã xóa');
                        fetchData();
                    }}>Xóa</Button>
                </>
            )
        }
    ];

    return (
        <Card title="Quản lý Phác đồ điều trị" style={{ margin: 24 }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                <Button type="primary" onClick={() => { setEditData(null); setModalOpen(true); }}>Thêm phác đồ</Button>
                <Button type="dashed" onClick={() => { setSymptomModal(true); setSelectedDiseaseId(''); }}>Thêm triệu chứng</Button>
            </div>
            <Table columns={columns} dataSource={data} loading={loading} rowKey="id" style={{ marginTop: 8 }} />
            <Modal open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} title={editData ? 'Sửa phác đồ' : 'Thêm phác đồ'}>
                <Form
                    initialValues={editData || { name: '', description: '', note: '', disease: '' }}
                    onFinish={async (values) => {
                        try {
                            if (editData) {
                                await updateTreatment(editData.id, values);
                                message.success('Đã cập nhật');
                            } else {
                                await addTreatment(values);
                                message.success('Đã thêm');
                            }
                            setModalOpen(false);
                            fetchData();
                        } catch {
                            message.error('Lỗi thao tác');
                        }
                    }}
                >
                    <Form.Item label="Tên phác đồ" name="name" rules={[{ required: true, message: 'Bắt buộc' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item label="Ghi chú" name="note">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item label="Bệnh" name="disease" rules={[{ required: true, message: 'Bắt buộc' }]}
                        extra={<Button type="link" onClick={() => setDiseaseModal(true)} style={{ padding: 0 }}>+ Thêm bệnh mới</Button>}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn bệnh"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                            onChange={id => { setSelectedDiseaseId(id); fetchSymptoms(id); }}
                        >
                            {diseases.map(d => (
                                <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    {selectedDiseaseId && (
                        <Form.Item label="Triệu chứng của bệnh này">
                            <Button type="dashed" onClick={() => setSymptomModal(true)}>+ Thêm triệu chứng</Button>
                            <Divider style={{ margin: '8px 0' }} />
                            {symptoms.length === 0 ? <div style={{ color: '#888' }}>Chưa có triệu chứng</div> : (
                                <ul style={{ paddingLeft: 18 }}>
                                    {symptoms.map(s => <li key={s.id}>{s.name} - {s.description}</li>)}
                                </ul>
                            )}
                        </Form.Item>
                    )}
                    <Button type="primary" htmlType="submit" block>{editData ? 'Cập nhật' : 'Thêm'}</Button>
                </Form>
            </Modal>
            <Modal
                open={diseaseModal}
                onCancel={() => {
                    setDiseaseModal(false);
                    diseaseForm.resetFields();
                }}
                footer={null}
                title={<div style={{ textAlign: 'center', fontWeight: 600, fontSize: 20 }}>Thêm bệnh mới</div>}
                destroyOnClose
                bodyStyle={{ padding: 24, borderRadius: 12 }}
            >
                <Form
                    form={diseaseForm}
                    layout="vertical"
                    initialValues={{ name: '', icd_code: '', description: '' }}
                    onFinish={async (values) => {
                        console.log('Submit values:', values);
                        try {
                            const cleanValues = {
                                ...values,
                                name: values.name?.trim() || '',
                                icd_code: values.icd_code?.trim() || '',
                                description: values.description?.trim() || '',
                            };
                            const res = await addDisease(cleanValues);
                            message.success('Đã thêm bệnh mới!');
                            diseaseForm.resetFields();
                            setDiseaseModal(false);
                            setNewDisease({ name: '', icd_code: '', description: '' });
                            await fetchDiseases();
                            setSelectedDiseaseId(res.id || (res.result && res.result.id));
                        } catch (err) {
                            if (err.response && err.response.data) {
                                const errors = err.response.data;
                                diseaseForm.setFields([
                                    { name: 'name', errors: errors.name || [] },
                                    { name: 'icd_code', errors: errors.icd_code || [] },
                                    { name: 'description', errors: errors.description || [] },
                                ]);
                            } else {
                                message.error('Không thể thêm bệnh');
                            }
                        }
                    }}
                >
                    <Form.Item label="Tên bệnh" name="name" rules={[{ required: true, message: 'Bắt buộc' }]} style={{ marginBottom: 16 }}>
                        <Input placeholder="Nhập tên bệnh" style={{ borderRadius: 8 }} />
                    </Form.Item>
                    <Form.Item label="ICD Code" name="icd_code" rules={[{ required: true, message: 'Bắt buộc' }]} style={{ marginBottom: 16 }}>
                        <Input placeholder="Nhập mã ICD" style={{ borderRadius: 8 }} />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Bắt buộc' }]} style={{ marginBottom: 24 }}>
                        <Input.TextArea rows={2} placeholder="Nhập mô tả" style={{ borderRadius: 8 }} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block icon={<PlusOutlined />} style={{ borderRadius: 8, height: 40, fontWeight: 600, fontSize: 16 }}>
                        Thêm bệnh
                    </Button>
                </Form>
            </Modal>
            <Modal open={symptomModal} onCancel={() => setSymptomModal(false)} footer={null} title={<div style={{ textAlign: 'center', fontWeight: 600, fontSize: 20 }}>Thêm triệu chứng cho bệnh</div>} destroyOnClose bodyStyle={{ padding: 24, borderRadius: 12 }}>
                <Form
                    form={symptomForm}
                    layout="vertical"
                    initialValues={newSymptom}
                    onFinish={async (values) => {
                        try {
                            await addSymptom({ ...values, disease: selectedDiseaseId || values.disease });
                            message.success('Đã thêm triệu chứng!');
                            symptomForm.resetFields();
                            setSymptomModal(false);
                            setNewSymptom({ name: '', description: '', disease: '' });
                            if (selectedDiseaseId) fetchSymptoms(selectedDiseaseId);
                        } catch {
                            message.error('Không thể thêm triệu chứng');
                        }
                    }}
                >
                    <Form.Item label="Tên triệu chứng" name="name" rules={[{ required: true, message: 'Bắt buộc' }]} style={{ marginBottom: 16 }}>
                        <Input placeholder="Nhập tên triệu chứng" style={{ borderRadius: 8 }} />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description" style={{ marginBottom: 16 }}>
                        <Input.TextArea rows={2} placeholder="Nhập mô tả" style={{ borderRadius: 8 }} />
                    </Form.Item>
                    <Form.Item label="Bệnh" name="disease" rules={[{ required: true, message: 'Bắt buộc' }]} style={{ marginBottom: 24 }}
                        extra={<Button type="link" icon={<PlusOutlined />} onClick={() => { setSymptomModal(false); setTimeout(() => setDiseaseModal(true), 300); }} style={{ padding: 0 }}>Thêm bệnh mới</Button>}
                    >
                        <Select
                            showSearch
                            placeholder="Chọn bệnh"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.children ?? '').toLowerCase().includes(input.toLowerCase())}
                            value={selectedDiseaseId || undefined}
                            onChange={id => setSelectedDiseaseId(id)}
                            style={{ borderRadius: 8 }}
                        >
                            {diseases.map(d => (
                                <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block icon={<PlusOutlined />} style={{ borderRadius: 8, height: 40, fontWeight: 600, fontSize: 16 }}>
                        Thêm triệu chứng
                    </Button>
                </Form>
            </Modal>
        </Card>
    );
};

export default Treatments; 