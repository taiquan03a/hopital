import React from 'react';
import { Button, Row, Col, Carousel } from 'antd';
import { ArrowRightOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import './Slider.css';

const Slider = ({ banners, onBookClick, onLearnMoreClick }) => {
    const carouselRef = React.useRef();
    return (
        <div className="custom-slider-wrapper">
            <Carousel
                autoplay
                dots
                ref={carouselRef}
                effect="scrollx"
                className="custom-slider-carousel"
            >
                {banners.map((banner, idx) => (
                    <div key={idx}>
                        <Row justify="center" align="middle" gutter={[32, 32]} style={{ minHeight: 380 }}>
                            <Col xs={24} md={14} style={{ textAlign: 'center' }}>
                                <h1 style={{ fontWeight: 900, fontSize: 54, marginBottom: 20, color: '#222', textShadow: '2px 4px 16px #b3bcf5' }}>{banner.title}</h1>
                                <div style={{ color: '#444', fontSize: 24, marginBottom: 40, maxWidth: 700, margin: '0 auto' }}>{banner.description}</div>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
                                    <Button type="primary" size="large" style={{ borderRadius: 28, fontWeight: 700, fontSize: 22, padding: '0 40px' }} icon={<ArrowRightOutlined />} onClick={onBookClick}>Đặt lịch ngay</Button>
                                    <Button type="default" size="large" style={{ borderRadius: 28, fontWeight: 700, fontSize: 22, padding: '0 40px', border: '2px solid #b3bcf5', color: '#4f46e5', background: '#fff' }} onClick={onLearnMoreClick}>Tìm hiểu thêm</Button>
                                </div>
                            </Col>
                            <Col xs={0} md={8} style={{ textAlign: 'center' }}>
                                {banner.image && <img src={banner.image} alt="banner" style={{ maxWidth: 340, maxHeight: 240, borderRadius: 24, boxShadow: '0 4px 24px #b3bcf5', objectFit: 'cover' }} />}
                            </Col>
                        </Row>
                    </div>
                ))}
            </Carousel>
            <Button
                className="custom-slider-arrow custom-slider-arrow-left"
                shape="circle"
                size="large"
                icon={<LeftOutlined style={{ fontSize: 28 }} />}
                onClick={() => carouselRef.current.prev()}
            />
            <Button
                className="custom-slider-arrow custom-slider-arrow-right"
                shape="circle"
                size="large"
                icon={<RightOutlined style={{ fontSize: 28 }} />}
                onClick={() => carouselRef.current.next()}
            />
        </div>
    );
};

export default Slider; 