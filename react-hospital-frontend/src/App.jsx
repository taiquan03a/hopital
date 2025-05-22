import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Grid } from 'antd';
import {
  MedicineBoxOutlined,
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  SolutionOutlined,
  CalendarOutlined,
  ProfileOutlined,
  UsergroupAddOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import Register from './pages/Register';
import Login from './pages/Login';
import PharmaceuticalList from './pages/PharmaceuticalList';
import Patients from './pages/Patients';
import MedicalRecords from './pages/MedicalRecords';
import Employees from './pages/Employees';
import Doctors from './pages/Doctors';
import Diseases from './pages/Diseases';
import Appointments from './pages/Appointments';
import Users from './pages/Users';
import PharmaceuticalAdd from './pages/PharmaceuticalAdd';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const menuItems = [
  { key: '/pharmaceuticals', icon: <MedicineBoxOutlined />, label: <Link to="/pharmaceuticals">Thuốc</Link> },
  { key: '/patients', icon: <UserOutlined />, label: <Link to="/patients">Bệnh nhân</Link> },
  { key: '/medical-records', icon: <FileTextOutlined />, label: <Link to="/medical-records">Hồ sơ bệnh án</Link> },
  { key: '/employees', icon: <TeamOutlined />, label: <Link to="/employees">Nhân viên</Link> },
  { key: '/doctors', icon: <SolutionOutlined />, label: <Link to="/doctors">Bác sĩ</Link> },
  { key: '/diseases', icon: <ProfileOutlined />, label: <Link to="/diseases">Bệnh</Link> },
  { key: '/appointments', icon: <CalendarOutlined />, label: <Link to="/appointments">Lịch hẹn</Link> },
  { key: '/users', icon: <UsergroupAddOutlined />, label: <Link to="/users">Người dùng</Link> },
];

function AppLayout() {
  const location = useLocation();
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);

  // Tự động collapse khi màn hình nhỏ
  React.useEffect(() => {
    if (!screens.md) setCollapsed(true);
    else setCollapsed(false);
  }, [screens.md]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={160}
        style={{ background: '#fff', boxShadow: '2px 0 8px #f0f1f2' }}
        breakpoint="md"
        collapsedWidth={0}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
      >
        <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#1890ff', letterSpacing: 1 }}>
          HOSPITAL SYS
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ height: '100%', borderRight: 0, fontSize: 15 }}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px', boxShadow: '0 2px 8px #f0f1f2', minHeight: 48, display: 'flex', alignItems: 'center' }}>
          {!screens.md && (
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 20, marginRight: 16 }}
            />
          )}
          <div style={{ flex: 1 }} />
          <Menu theme="light" mode="horizontal" style={{ float: 'right', fontSize: 15 }}>
            <Menu.Item key="register"><Link to="/register">Đăng ký</Link></Menu.Item>
            <Menu.Item key="login"><Link to="/login">Đăng nhập</Link></Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '16px', minHeight: '100vh', background: '#f0f2f5' }}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pharmaceuticals" element={<PharmaceuticalList />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/diseases" element={<Diseases />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/users" element={<Users />} />
            <Route path="/pharmaceutical/add" element={<PharmaceuticalAdd />} />
            <Route path="*" element={<PharmaceuticalList />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
