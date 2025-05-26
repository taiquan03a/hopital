import React, { useState, useRef } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Slider from '../components/Slider';
import Category from '../components/Category';
import Service from '../components/Service';
import Footer from '../components/Footer';
import { AppstoreOutlined, TeamOutlined, InfoCircleOutlined, SmileOutlined, HeartFilled, MedicineBoxOutlined, UserAddOutlined, FileSearchOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const HOSPITAL_INFO = {
    name: 'HealthCare Pro',
    logo: 'https://cdn-icons-png.flaticon.com/512/2966/2966484.png',
    address: 'Số 1, Trần Phú, Hà Đông, Hà Nội',
    phone: '024 1234 5678',
    email: 'contact@ptithospital.vn',
    workingHours: 'Thứ 2 - Thứ 7: 7:00 - 17:00',
    description: 'Hệ thống y tế của chúng tôi cung cấp dịch vụ chăm sóc toàn diện với đội ngũ bác sĩ giàu kinh nghiệm.'
};

const BANNERS = [
    {
        title: 'Chăm sóc sức khỏe chất lượng cao',
        description: HOSPITAL_INFO.description,
        image: 'https://cdn-icons-png.flaticon.com/512/2966/2966484.png',
    },
    {
        title: 'Đội ngũ bác sĩ tận tâm',
        description: 'Đội ngũ bác sĩ giàu kinh nghiệm, tận tâm với bệnh nhân, luôn sẵn sàng hỗ trợ bạn.',
        image: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png',
    },
    {
        title: 'Đặt lịch khám dễ dàng',
        description: 'Đặt lịch khám nhanh chóng, tiện lợi chỉ với vài thao tác.',
        image: 'https://cdn-icons-png.flaticon.com/512/3159/3159066.png',
    },
];

const SERVICES = [
    {
        icon: <InfoCircleOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
        title: 'Khám tổng quát',
        desc: 'Dịch vụ khám sức khỏe tổng quát, phát hiện sớm các vấn đề sức khỏe.',
        image: 'https://cdn-icons-png.flaticon.com/512/2966/2966484.png',
    },
    {
        icon: <TeamOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
        title: 'Chuyên khoa',
        desc: 'Khám và điều trị chuyên sâu các bệnh lý nội, ngoại, nhi, sản...',
        image: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png',
    },
    {
        icon: <AppstoreOutlined style={{ fontSize: 32, color: '#faad14' }} />,
        title: 'Xét nghiệm & Chẩn đoán',
        desc: 'Dịch vụ xét nghiệm, chẩn đoán hình ảnh hiện đại, chính xác.',
        image: 'https://cdn-icons-png.flaticon.com/512/3159/3159066.png',
    },
    {
        icon: <MedicineBoxOutlined style={{ fontSize: 32, color: '#eb2f96' }} />,
        title: 'Dược phẩm',
        desc: 'Cung cấp thuốc và tư vấn sử dụng thuốc an toàn, hiệu quả.',
        image: 'https://cdn-icons-png.flaticon.com/512/2921/2921822.png',
    },
    {
        icon: <UserAddOutlined style={{ fontSize: 32, color: '#00b96b' }} />,
        title: 'Tiêm chủng',
        desc: 'Dịch vụ tiêm chủng cho trẻ em và người lớn, đảm bảo an toàn.',
        image: 'https://cdn-icons-png.flaticon.com/512/3176/3176297.png',
    },
    {
        icon: <FileSearchOutlined style={{ fontSize: 32, color: '#ff7a45' }} />,
        title: 'Tư vấn sức khỏe',
        desc: 'Tư vấn sức khỏe trực tiếp và trực tuyến với chuyên gia.',
        image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    },
    {
        icon: <SafetyCertificateOutlined style={{ fontSize: 32, color: '#722ed1' }} />,
        title: 'Khám sức khỏe doanh nghiệp',
        desc: 'Dịch vụ khám sức khỏe định kỳ cho doanh nghiệp, tổ chức.',
        image: 'https://cdn-icons-png.flaticon.com/512/3062/3062634.png',
    },
    {
        icon: <SmileOutlined style={{ fontSize: 32, color: '#13c2c2' }} />,
        title: 'Nha khoa',
        desc: 'Dịch vụ chăm sóc răng miệng, nha khoa tổng quát và chuyên sâu.',
        image: 'https://cdn-icons-png.flaticon.com/512/1686/1686012.png',
    },
];

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    const patient = JSON.parse(localStorage.getItem('patient'));
    const serviceRef = useRef(null);

    const handleMenuClick = ({ key }) => {
        setMenuVisible(false);
        if (key === 'info') navigate('/patient/info');
        if (key === 'history') navigate('/patient/appointments/history');
        if (key === 'logout') {
            localStorage.removeItem('patient');
            message.success('Đã đăng xuất!');
            window.location.reload();
        }
    };

    const handleBookClick = () => {
        navigate('/patient/appointments/book');
    };

    const handleLearnMoreClick = () => {
        if (serviceRef.current) {
            serviceRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleDetailClick = (idx) => {
        message.info(`Xem chi tiết dịch vụ: ${SERVICES[idx].title}`);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)', paddingBottom: 0 }}>
            <Header
                hospitalInfo={HOSPITAL_INFO}
                patient={patient}
                menuVisible={menuVisible}
                setMenuVisible={setMenuVisible}
                handleMenuClick={handleMenuClick}
                navigate={navigate}
            />
            <Slider banners={BANNERS} onBookClick={handleBookClick} onLearnMoreClick={handleLearnMoreClick} />
            <Category services={SERVICES} onDetailClick={handleDetailClick} />
            <div ref={serviceRef} />
            <Service hospitalInfo={HOSPITAL_INFO} />
            <Footer />
        </div>
    );
};

export default PatientDashboard; 