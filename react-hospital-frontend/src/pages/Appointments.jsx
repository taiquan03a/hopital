import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, message, Tag, Avatar } from 'antd';
import AppointmentForm from '../components/AppointmentForm';
import { getAppointmentsByPatient, deleteAppointment, getAllPatients, updateAppointment, getAllDoctors, getAllReexaminations, addReexamination, updateReexamination } from '../services/api';
import { UserOutlined, SolutionOutlined } from '@ant-design/icons';

const Appointments = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [selected, setSelected] = useState(null);
    const [doctorMap, setDoctorMap] = useState({});
    const [reexaminations, setReexaminations] = useState([]);
    const [addReexamModal, setAddReexamModal] = useState(false);
    const [reexamForm, setReexamForm] = useState({ reexamination_date: '', reexamination_time: '', reason: '', status: 0, examinition_date: '' });
    const userId = localStorage.getItem('user_id') || '';

    // Lấy danh sách bác sĩ và tạo map id -> doctor
    useEffect(() => {
        getAllDoctors().then(res => {
            const list = res.result || res || [];
            const map = {};
            list.forEach(d => {
                const id = d.id || d.user_id;
                map[id] = d;
            });
            setDoctorMap(map);
        });
    }, []);

    const fetchData = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            // Lấy danh sách bệnh nhân theo user_id
            const patientsRes = await getAllPatients(userId);
            const patients = patientsRes.result || patientsRes || [];
            // Lấy tất cả lịch hẹn của từng bệnh nhân
            const allAppointments = [];
            for (const p of patients) {
                const pid = p.id || p.patient_id;
                if (!pid) continue;
                try {
                    const res = await getAppointmentsByPatient(pid);
                    const appointments = res.result || res || [];
                    // Gắn thêm thông tin bệnh nhân vào từng lịch hẹn
                    appointments.forEach(a => a._patient = p);
                    allAppointments.push(...appointments);
                } catch { }
            }
            setData(allAppointments);
        } catch {
            message.error('Không thể tải danh sách lịch hẹn');
        }
        setLoading(false);
    };
    useEffect(() => { fetchData(); }, [userId]);

    // Lấy tái khám khi mở modal chi tiết
    useEffect(() => {
        if (detailModal && selected) {
            getAllReexaminations().then(res => {
                const list = res.result || res || [];
                // Lọc các lần tái khám liên quan đến lịch hẹn này
                const filtered = list.filter(r => r.appointment === selected.id);
                setReexaminations(filtered);
            });
        } else {
            setReexaminations([]);
        }
    }, [detailModal, selected]);

    const columns = [
        {
            title: 'Bác sĩ',
            dataIndex: 'doctor_id',
            key: 'doctor_id',
            align: 'center',
            render: (id) => {
                const d = doctorMap[id];
                const name = d ? (d.name || `${d.first_name || ''} ${d.last_name || ''}`.trim()) : id;
                return <span><Avatar size={28} icon={<SolutionOutlined />} style={{ background: '#1890ff', marginRight: 6 }} />{name}</span>;
            }
        },
        {
            title: 'Bệnh nhân',
            dataIndex: '_patient',
            key: 'patient_id',
            align: 'center',
            render: (p, record) => {
                const name = p ? (p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim()) : record.patient_id;
                return <span><Avatar size={28} icon={<UserOutlined />} style={{ background: '#52c41a', marginRight: 6 }} />{name}</span>;
            }
        },
        { title: 'Ngày hẹn', dataIndex: 'appointment_date', key: 'appointment_date', align: 'center' },
        { title: 'Giờ', dataIndex: 'time', key: 'time', align: 'center' },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', align: 'center', render: s => <Tag color={s === 0 ? 'blue' : 'green'} style={{ fontWeight: 600 }}>{s === 0 ? 'Chờ' : 'Hoàn thành'}</Tag> },
        { title: 'Ngày tạo', dataIndex: 'create_date', key: 'create_date', align: 'center' },
        {
            title: 'Hành động', key: 'actions', align: 'center', render: (_, record) => (
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
                    {record.status === 0 && (
                        <Button
                            size="small"
                            type="dashed"
                            style={{ marginLeft: 8 }}
                            onClick={async () => {
                                try {
                                    await updateAppointment(record.id, { ...record, status: 1 });
                                    message.success('Đã chuyển trạng thái!');
                                    fetchData();
                                } catch {
                                    message.error('Không thể chuyển trạng thái');
                                }
                            }}
                        >
                            Hoàn thành
                        </Button>
                    )}
                </>
            )
        }
    ];

    return (
        <Card style={{ borderRadius: 16, boxShadow: '0 4px 24px #e6f7ff', margin: 24, background: '#fff' }} bodyStyle={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ margin: 0, fontWeight: 700, color: '#1890ff', letterSpacing: 1 }}>Lịch hẹn của bạn</h2>
                <Button type="primary" style={{ fontWeight: 600, borderRadius: 8 }} onClick={() => setModalOpen(true)}>Thêm lịch hẹn</Button>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="id"
                bordered
                style={{ borderRadius: 12, background: '#fff' }}
                pagination={{ pageSize: 8 }}
                size="middle"
                scroll={{ x: 'max-content' }}
                tableLayout="auto"
            />
            <Modal open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} title="Thêm lịch hẹn" destroyOnClose>
                <AppointmentForm onSuccess={() => { setModalOpen(false); fetchData(); }} />
            </Modal>
            <Modal open={editModal} onCancel={() => setEditModal(false)} footer={null} title="Sửa lịch hẹn" destroyOnClose>
                {editModal && selected && <AppointmentForm initialData={selected} isEdit onSuccess={() => { setEditModal(false); fetchData(); }} />}
            </Modal>
            <Modal open={detailModal} onCancel={() => setDetailModal(false)} footer={null} title={null} width={700}>
                {selected && (
                    <div style={{ background: '#f6faff', borderRadius: 16, padding: 28, boxShadow: '0 2px 12px #e6f7ff', margin: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                            <div style={{ fontWeight: 700, fontSize: 22, color: '#1890ff', letterSpacing: 1 }}>Chi tiết lịch hẹn</div>
                            <Tag color={selected.status === 0 ? 'blue' : 'green'} style={{ fontWeight: 600, fontSize: 15 }}>
                                {selected.status === 0 ? 'Chờ' : 'Hoàn thành'}
                            </Tag>
                        </div>
                        <div style={{ display: 'flex', gap: 32, marginBottom: 18 }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ marginBottom: 8 }}><b>Bác sĩ:</b> <span style={{ color: '#222' }}>{doctorMap[selected.doctor_id]?.name || doctorMap[selected.doctor_id]?.first_name + ' ' + doctorMap[selected.doctor_id]?.last_name || selected.doctor_id}</span></div>
                                <div style={{ marginBottom: 8 }}><b>Bệnh nhân:</b> <span style={{ color: '#222' }}>{selected._patient?.name || selected._patient?.first_name + ' ' + selected._patient?.last_name || selected.patient_id}</span></div>
                                <div style={{ marginBottom: 8 }}><b>Ngày hẹn:</b> <span style={{ color: '#222' }}>{selected.appointment_date}</span></div>
                                <div style={{ marginBottom: 8 }}><b>Giờ:</b> <span style={{ color: '#222' }}>{selected.time}</span></div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ marginBottom: 8 }}><b>Ngày tạo:</b> <span style={{ color: '#222' }}>{selected.create_date}</span></div>
                                <div style={{ marginBottom: 8 }}><b>Mã lịch hẹn:</b> <span style={{ color: '#222' }}>{selected.id}</span></div>
                            </div>
                        </div>
                        <div style={{ marginTop: 18, background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 1px 6px #e6f7ff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                <b style={{ fontSize: 17, color: '#1890ff' }}>Lịch tái khám</b>
                                <Button size="small" type="primary" onClick={() => setAddReexamModal(true)}>
                                    + Thêm tái khám
                                </Button>
                            </div>
                            {reexaminations.length === 0 ? (
                                <div style={{ color: '#888', marginTop: 4 }}>Chưa có lịch tái khám</div>
                            ) : (
                                <Table
                                    columns={[
                                        { title: 'Ngày khám trước', dataIndex: 'examinition_date', key: 'examinition_date', align: 'center' },
                                        { title: 'Ngày tái khám', dataIndex: 'reexamination_date', key: 'reexamination_date', align: 'center' },
                                        { title: 'Giờ tái khám', dataIndex: 'reexamination_time', key: 'reexamination_time', align: 'center' },
                                        { title: 'Lý do', dataIndex: 'reason', key: 'reason', align: 'center' },
                                        {
                                            title: 'Trạng thái', dataIndex: 'status', key: 'status', align: 'center', render: (s, record) => (
                                                <>
                                                    <Tag color={s === 0 ? 'blue' : 'green'}>{s === 0 ? 'Chờ' : 'Hoàn thành'}</Tag>
                                                    {s === 0 && (
                                                        <Button size="small" type="dashed" style={{ marginLeft: 8 }} onClick={async () => {
                                                            try {
                                                                await updateReexamination(record.id, { ...record, status: 1 });
                                                                message.success('Đã chuyển trạng thái tái khám!');
                                                                // reload lại danh sách tái khám
                                                                getAllReexaminations().then(res => {
                                                                    const list = res.result || res || [];
                                                                    const filtered = list.filter(r => r.appointment === selected.id);
                                                                    setReexaminations(filtered);
                                                                });
                                                            } catch {
                                                                message.error('Không thể chuyển trạng thái');
                                                            }
                                                        }}>
                                                            Hoàn thành
                                                        </Button>
                                                    )}
                                                </>
                                            )
                                        },
                                    ]}
                                    dataSource={reexaminations}
                                    rowKey="id"
                                    size="small"
                                    pagination={false}
                                    style={{ marginTop: 8, borderRadius: 8 }}
                                />
                            )}
                        </div>
                    </div>
                )}
            </Modal>
            <Modal open={addReexamModal} onCancel={() => setAddReexamModal(false)} footer={null} title="Thêm lịch tái khám" destroyOnClose>
                <form onSubmit={async e => {
                    e.preventDefault();
                    try {
                        await addReexamination({
                            ...reexamForm,
                            appointment: selected.id,
                        });
                        message.success('Đã thêm lịch tái khám!');
                        setAddReexamModal(false);
                        setReexamForm({ reexamination_date: '', reexamination_time: '', reason: '', status: 0, examinition_date: '' });
                        // reload lại danh sách tái khám
                        getAllReexaminations().then(res => {
                            const list = res.result || res || [];
                            const filtered = list.filter(r => r.appointment === selected.id);
                            setReexaminations(filtered);
                        });
                    } catch {
                        message.error('Không thể thêm lịch tái khám');
                    }
                }}>
                    <div style={{ marginBottom: 12 }}>
                        <b>Ngày tái khám:</b>
                        <input type="date" value={reexamForm.reexamination_date} onChange={e => setReexamForm(f => ({ ...f, reexamination_date: e.target.value }))} required style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <b>Giờ tái khám:</b>
                        <input type="time" value={reexamForm.reexamination_time} onChange={e => setReexamForm(f => ({ ...f, reexamination_time: e.target.value }))} required style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <b>Ngày khám trước:</b>
                        <input type="date" value={reexamForm.examinition_date} onChange={e => setReexamForm(f => ({ ...f, examinition_date: e.target.value }))} required style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
                    </div>
                    <div style={{ marginBottom: 12 }}>
                        <b>Lý do tái khám:</b>
                        <input type="text" value={reexamForm.reason} onChange={e => setReexamForm(f => ({ ...f, reason: e.target.value }))} required style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }} />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <b>Trạng thái:</b>
                        <select value={reexamForm.status} onChange={e => setReexamForm(f => ({ ...f, status: Number(e.target.value) }))} style={{ width: '100%', padding: 6, borderRadius: 6, border: '1px solid #ccc', marginTop: 4 }}>
                            <option value={0}>Chờ</option>
                            <option value={1}>Hoàn thành</option>
                        </select>
                    </div>
                    <Button type="primary" htmlType="submit" block>Thêm</Button>
                </form>
            </Modal>
        </Card>
    );
};
export default Appointments; 