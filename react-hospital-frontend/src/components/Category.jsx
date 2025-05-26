import React from 'react';
import { Card, Row, Col, Button } from 'antd';

const Category = ({ services, onDetailClick }) => (
    <div style={{ margin: '0 auto', maxWidth: 1000, marginBottom: 48 }}>
        <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: 32, marginBottom: 32 }}>Dịch vụ của chúng tôi</h2>
        <Row gutter={[32, 32]} justify="center">
            {services.map((s, idx) => (
                <Col xs={24} sm={12} md={8} key={idx}>
                    <Card
                        hoverable
                        style={{ borderRadius: 16, textAlign: 'center', minHeight: 340, boxShadow: '0 2px 8px #f0f1f2', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                        bodyStyle={{ paddingBottom: 16 }}
                        onClick={() => onDetailClick && onDetailClick(idx)}
                    >
                        {s.image && <img src={s.image} alt={s.title} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 24, marginBottom: 18, boxShadow: '0 2px 12px #e0e7ff' }} />}
                        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>{s.title}</div>
                        <div style={{ color: '#666', fontSize: 16, marginBottom: 16 }}>{s.desc}</div>
                        {onDetailClick && <Button type="link" style={{ fontWeight: 600, color: '#4f46e5' }}>Xem chi tiết</Button>}
                    </Card>
                </Col>
            ))}
        </Row>
    </div>
);

export default Category; 