import React from 'react';
import { EnvironmentOutlined, PhoneOutlined, MailOutlined, CopyrightOutlined } from '@ant-design/icons';

const footerBg = 'linear-gradient(90deg, #4f46e5 0%, #6d83f2 100%)';

const Footer = () => (
    <footer style={{
        background: footerBg,
        color: '#fff',
        padding: '40px 0 18px 0',
        marginTop: 48,
        borderTop: 'none',
        fontSize: 16,
    }}>
        <div style={{
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', maxWidth: 1100, margin: '0 auto 0 auto', gap: 32,
        }}>
            <div style={{ flex: 1, minWidth: 220, textAlign: 'left' }}>
                <div style={{ fontWeight: 800, fontSize: 26, color: '#fff', marginBottom: 10, letterSpacing: 1 }}>
                    HealthCare Pro
                </div>
                <div style={{ color: '#e0e7ff', fontSize: 16, marginBottom: 10 }}>
                    Hệ thống y tế cung cấp dịch vụ chăm sóc toàn diện với đội ngũ bác sĩ giàu kinh nghiệm, tận tâm.
                </div>
            </div>
            <div style={{ flex: 1, minWidth: 220, textAlign: 'left' }}>
                <div style={{ marginBottom: 10 }}>
                    <EnvironmentOutlined style={{ color: '#b7eb8f', marginRight: 8 }} /> Số 1, Trần Phú, Hà Đông, Hà Nội
                </div>
                <div style={{ marginBottom: 10 }}>
                    <PhoneOutlined style={{ color: '#91d5ff', marginRight: 8 }} /> 024 1234 5678
                </div>
                <div style={{ marginBottom: 10 }}>
                    <MailOutlined style={{ color: '#ffe58f', marginRight: 8 }} /> contact@ptithospital.vn
                </div>
            </div>
        </div>
        <div style={{ color: '#e0e7ff', fontSize: 15, textAlign: 'center', marginTop: 24 }}>
            <CopyrightOutlined /> {new Date().getFullYear()} HealthCare Pro. All rights reserved.
        </div>
        <style>{`
      @media (max-width: 700px) {
        footer > div:first-child {
          flex-direction: column !important;
          align-items: center !important;
          text-align: center !important;
        }
        footer > div > div {
          text-align: center !important;
        }
      }
    `}</style>
    </footer>
);

export default Footer; 