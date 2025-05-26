import React from 'react';
import { Button, Dropdown, Menu, Avatar, Typography } from 'antd';
import { UserOutlined, LoginOutlined, InfoCircleFilled, HistoryOutlined, LogoutOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Text } = Typography;

const navTabs = [
    { key: '/patient/home', label: 'Trang chủ' },
    { key: '/patient/appointments/book', label: 'Đặt lịch' },
    { key: '/patient/consult', label: 'Tư vấn' },
];

const Header = ({ hospitalInfo, patient, menuVisible, setMenuVisible, handleMenuClick, navigate: propNavigate }) => {
    const location = useLocation();
    const navigate = propNavigate || useNavigate();
    const activeTab = navTabs.find(tab => location.pathname.startsWith(tab.key))?.key || '/patient/home';
    const patientMenu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="info" icon={<InfoCircleFilled />}>Xem thông tin</Menu.Item>
            <Menu.Item key="history" icon={<HistoryOutlined />}>Lịch sử đặt</Menu.Item>
            <Menu.Item key="logout" icon={<LogoutOutlined />} danger>Đăng xuất</Menu.Item>
        </Menu>
    );
    return (
        <div style={{ width: '100%', background: '#fff', boxShadow: '0 2px 8px #f0f1f2', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5vw', position: 'sticky', top: 0, zIndex: 100 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={hospitalInfo?.logo || 'https://cdn-icons-png.flaticon.com/512/2966/2966484.png'} alt="logo" style={{ width: 40, height: 40, borderRadius: 10 }} />
                <span style={{ fontWeight: 800, fontSize: 22, color: '#4f46e5', letterSpacing: 1 }}>{hospitalInfo?.name || 'HealthCare Pro'}</span>
                <Menu
                    mode="horizontal"
                    selectedKeys={[activeTab]}
                    style={{ marginLeft: 32, fontWeight: 600, fontSize: 17, background: 'transparent', borderBottom: 'none', boxShadow: 'none' }}
                    items={navTabs.map(tab => ({
                        key: tab.key,
                        label: <span style={{
                            color: activeTab === tab.key ? '#4f46e5' : '#222',
                            borderBottom: activeTab === tab.key ? '2.5px solid #4f46e5' : 'none',
                            background: 'transparent',
                            padding: '0 18px',
                            fontWeight: 700,
                            fontSize: 20,
                            lineHeight: '48px',
                            display: 'inline-block',
                            transition: 'border-bottom 0.2s',
                        }}>{tab.label}</span>
                    }))}
                    onClick={({ key }) => navigate(key)}
                />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {!patient ? (
                    <Button type="primary" icon={<LoginOutlined />} style={{ borderRadius: 8, fontWeight: 600 }} onClick={() => navigate('/patient-login')}>
                        Đăng nhập
                    </Button>
                ) : (
                    <>
                        <Text style={{ fontWeight: 600, color: '#222', fontSize: 16, display: 'none', '@media (min-width: 600px)': { display: 'inline' } }}>
                            {patient.fullName || 'Bệnh nhân'}
                        </Text>
                        <Dropdown overlay={patientMenu} trigger={["click"]} onVisibleChange={setMenuVisible} visible={menuVisible} placement="bottomRight">
                            <Avatar style={{ backgroundColor: '#1890ff', cursor: 'pointer', transition: 'box-shadow 0.2s', boxShadow: menuVisible ? '0 0 0 4px #e0e7ff' : undefined }} size={44} icon={<UserOutlined />} />
                        </Dropdown>
                    </>
                )}
            </div>
        </div>
    );
};

export default Header; 