import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
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
import Dashboard from './pages/Dashboard';
import Treatments from './pages/Treatments';
import PatientDashboard from './pages/PatientDashboard';
import PatientLogin from './pages/PatientLogin';
import PatientBookAppointment from './pages/PatientBookAppointment';
import PatientAppointmentHistory from './pages/PatientAppointmentHistory';
import PatientConsult from './pages/PatientConsult';
import PatientRegister from './pages/PatientRegister';
import PatientProfile from './pages/PatientProfile';
const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const menuItems = [
  { key: '/', icon: <UserOutlined />, label: 'Dashboard' },
  { key: '/pharmaceuticals', icon: <MedicineBoxOutlined />, label: 'Thuốc' },
  { key: '/patients', icon: <UserOutlined />, label: 'Bệnh nhân' },
  { key: '/medical-records', icon: <FileTextOutlined />, label: 'Hồ sơ bệnh án' },
  { key: '/employees', icon: <TeamOutlined />, label: 'Nhân viên' },
  { key: '/doctors', icon: <SolutionOutlined />, label: 'Bác sĩ' },
  { key: '/treatments', icon: <ProfileOutlined />, label: 'Phác đồ' },
  { key: '/appointments', icon: <CalendarOutlined />, label: 'Lịch hẹn' },
  { key: '/users', icon: <UsergroupAddOutlined />, label: 'Người dùng' },
];

function AppLayout() {
  const location = useLocation();
  const screens = useBreakpoint();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // Tự động collapse khi màn hình nhỏ
  React.useEffect(() => {
    if (!screens.md) setCollapsed(true);
    else setCollapsed(false);
  }, [screens.md]);

  // Nếu là route bệnh nhân thì chỉ render nội dung bệnh nhân, không render layout admin
  if (location.pathname.startsWith('/patient')) {
    return (
      <Routes>
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/patient/home" element={<PatientDashboard />} />
        <Route path="/patient/appointments/book" element={<PatientBookAppointment />} />
        <Route path="/patient/appointments/history" element={<PatientAppointmentHistory />} />
        <Route path="/patient/consult" element={<PatientConsult />} />
        <Route path="/patient/info" element={<PatientProfile />} />
        {/* Có thể thêm các route bệnh nhân khác ở đây */}
      </Routes>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={210}
        style={{ background: '#fff', boxShadow: '2px 0 8px #f0f1f2', borderTopRightRadius: 18, borderBottomRightRadius: 18 }}
        breakpoint="md"
        collapsedWidth={0}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        trigger={null}
      >
        <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, color: '#1890ff', letterSpacing: 1, marginBottom: 8 }}>
          HOSPITAL SYS
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ height: '100%', borderRight: 0, fontSize: 17, fontWeight: 500, background: 'transparent' }}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/pharmaceuticals" element={<PharmaceuticalList />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/diseases" element={<Diseases />} />
            <Route path="/treatments" element={<Treatments />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/users" element={<Users />} />
            <Route path="/pharmaceutical/add" element={<PharmaceuticalAdd />} />
            <Route path="*" element={<Dashboard />} />
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
