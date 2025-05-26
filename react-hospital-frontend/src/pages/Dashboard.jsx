import React from 'react';
import { Card, Row, Col, Statistic, Typography, Divider } from 'antd';
import { UserOutlined, MedicineBoxOutlined, TeamOutlined, FileTextOutlined, CalendarOutlined, SolutionOutlined } from '@ant-design/icons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const { Title, Text } = Typography;

const patientData = [
    { month: '1', patients: 120 },
    { month: '2', patients: 98 },
    { month: '3', patients: 150 },
    { month: '4', patients: 200 },
    { month: '5', patients: 170 },
    { month: '6', patients: 210 },
];

const medicineData = [
    { name: 'Kháng sinh', value: 400 },
    { name: 'Giảm đau', value: 300 },
    { name: 'Vitamin', value: 200 },
    { name: 'Khác', value: 100 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const appointmentData = [
    { day: 'T2', appointments: 20 },
    { day: 'T3', appointments: 35 },
    { day: 'T4', appointments: 30 },
    { day: 'T5', appointments: 25 },
    { day: 'T6', appointments: 40 },
    { day: 'T7', appointments: 15 },
    { day: 'CN', appointments: 10 },
];

const doctorData = [
    { name: 'Nội', value: 20 },
    { name: 'Ngoại', value: 15 },
    { name: 'Nhi', value: 10 },
    { name: 'Sản', value: 8 },
    { name: 'Khác', value: 7 },
];
const DOCTOR_COLORS = ['#1890ff', '#52c41a', '#faad14', '#eb2f96', '#b37feb'];

export default function Dashboard() {
    return (
        <div style={{ padding: 12 }}>
            <Title level={2} style={{ fontWeight: 700, marginBottom: 8, color: '#1890ff', textAlign: 'center', letterSpacing: 1 }}>
                Chào mừng bạn đến với Hệ thống Quản lý Bệnh viện!
            </Title>
            <Text style={{ display: 'block', textAlign: 'center', color: '#888', marginBottom: 32, fontSize: 17 }}>
                Tổng quan hoạt động và thống kê nổi bật
            </Text>
            <Row gutter={[24, 24]} justify="center">
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 12px #e6f7ff' }}>
                        <Statistic title={<span style={{ color: '#1890ff', fontWeight: 600 }}>Tổng số bệnh nhân</span>} value={1200} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 12px #fffbe6' }}>
                        <Statistic title={<span style={{ color: '#faad14', fontWeight: 600 }}>Tổng số thuốc</span>} value={350} prefix={<MedicineBoxOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 12px #f6ffed' }}>
                        <Statistic title={<span style={{ color: '#52c41a', fontWeight: 600 }}>Nhân viên</span>} value={80} prefix={<TeamOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 2px 12px #fff0f6' }}>
                        <Statistic title={<span style={{ color: '#eb2f96', fontWeight: 600 }}>Hồ sơ bệnh án</span>} value={540} prefix={<FileTextOutlined />} />
                    </Card>
                </Col>
            </Row>
            <Divider style={{ margin: '32px 0 24px 0' }} />
            <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                    <Card title={<span style={{ color: '#1890ff', fontWeight: 600 }}>Số bệnh nhân theo tháng</span>} style={{ borderRadius: 16, height: 370, boxShadow: '0 2px 12px #e6f7ff' }}>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={patientData}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="patients" fill="#1890ff" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title={<span style={{ color: '#faad14', fontWeight: 600 }}>Tỷ lệ các loại thuốc</span>} style={{ borderRadius: 16, height: 370, boxShadow: '0 2px 12px #fffbe6' }}>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={medicineData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {medicineData.map((entry, index) => (
                                        <Cell key={`cell-medicine-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
            <Row gutter={[24, 24]} style={{ marginTop: 0 }}>
                <Col xs={24} md={12}>
                    <Card title={<span style={{ color: '#13c2c2', fontWeight: 600 }}>Lịch khám theo ngày</span>} style={{ borderRadius: 16, height: 370, boxShadow: '0 2px 12px #e6fffb' }}>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={appointmentData}>
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="appointments" fill="#13c2c2" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title={<span style={{ color: '#b37feb', fontWeight: 600 }}>Bác sĩ theo chuyên khoa</span>} style={{ borderRadius: 16, height: 370, boxShadow: '0 2px 12px #f9f0ff' }}>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={doctorData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {doctorData.map((entry, index) => (
                                        <Cell key={`cell-doctor-${index}`} fill={DOCTOR_COLORS[index % DOCTOR_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
            <div style={{ marginTop: 40, fontSize: 16, color: '#555', textAlign: 'center' }}>
                <Text strong>Hãy sử dụng menu bên trái để truy cập các chức năng quản lý!</Text>
            </div>
        </div>
    );
} 