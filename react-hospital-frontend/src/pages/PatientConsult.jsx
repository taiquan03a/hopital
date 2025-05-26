import React, { useState, useRef } from 'react';
import { Card, Button, message, Upload, Modal, Spin } from 'antd';
import { UploadOutlined, SendOutlined, LoadingOutlined, UserOutlined, RobotOutlined, PaperClipOutlined, AudioOutlined, AudioMutedOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const HOSPITAL_INFO = {
    name: 'HealthCare Pro',
    logo: 'https://cdn-icons-png.flaticon.com/512/2966/2966484.png',
    address: 'Số 1, Trần Phú, Hà Đông, Hà Nội',
    phone: '024 1234 5678',
    email: 'contact@ptithospital.vn',
    workingHours: 'Thứ 2 - Thứ 7: 7:00 - 17:00',
    description: 'Hệ thống y tế của chúng tôi cung cấp dịch vụ chăm sóc toàn diện với đội ngũ bác sĩ giàu kinh nghiệm.'
};

const PatientConsult = () => {
    const [loading, setLoading] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Xin chào! Bạn có thể đặt câu hỏi về sức khỏe hoặc tải ảnh y tế để được tư vấn.' }
    ]);
    const [input, setInput] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);
    const chatBodyRef = useRef(null);
    const patient = JSON.parse(localStorage.getItem('patient'));
    const navigate = useNavigate();
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);

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

    const scrollToBottom = () => {
        setTimeout(() => {
            if (chatBodyRef.current) {
                chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
            }
        }, 100);
    };

    const handleSend = async () => {
        if (!input.trim() && !image) return;
        setMessages(prev => [...prev, { role: 'user', content: input, image }]);
        setInput('');
        setImage(null);
        setLoading(true);
        scrollToBottom();
        try {
            let res, data;
            if (image) {
                // Gửi ảnh (và text nếu có)
                const formData = new FormData();
                formData.append('image', dataURLtoFile(image, 'upload.png'));
                formData.append('text', input);
                res = await fetch('http://localhost:8000/upload', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                });
                data = await res.json();
            } else {
                // Gửi text
                res = await fetch('http://localhost:8000/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: input, conversation_history: [] }),
                    credentials: 'include',
                });
                data = await res.json();
            }
            // Hiển thị phản hồi
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: data.response,
                    result_image: data.result_image || null,
                    agent: data.agent || null
                }
            ]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.' }]);
        }
        setLoading(false);
        scrollToBottom();
    };

    // Helper: convert base64 dataURL to File
    function dataURLtoFile(dataurl, filename) {
        const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
        return new File([u8arr], filename, { type: mime });
    }

    const handleUpload = info => {
        if (info.file.status === 'done' || info.file.status === 'uploading') {
            const reader = new FileReader();
            reader.onload = e => {
                setPreview(e.target.result);
                setPreviewVisible(true);
                setImage(e.target.result);
            };
            reader.readAsDataURL(info.file.originFileObj);
        }
    };

    // Voice recording logic
    const handleVoiceClick = async () => {
        if (!isRecording) {
            // Start recording
            if (navigator.mediaDevices && window.MediaRecorder) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const recorder = new window.MediaRecorder(stream);
                    setMediaRecorder(recorder);
                    setAudioChunks([]);
                    recorder.start();
                    setIsRecording(true);
                    recorder.ondataavailable = e => {
                        setAudioChunks(prev => [...prev, e.data]);
                    };
                    recorder.onstop = async () => {
                        setIsRecording(false);
                        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                        setLoading(true);
                        try {
                            const formData = new FormData();
                            formData.append('audio', audioBlob);
                            const res = await fetch('http://localhost:8000/transcribe', {
                                method: 'POST',
                                body: formData
                            });
                            const data = await res.json();
                            setInput(data.transcript || '');
                        } catch (err) {
                            message.error('Không thể nhận diện giọng nói!');
                        }
                        setLoading(false);
                    };
                } catch (err) {
                    message.error('Không thể truy cập micro!');
                }
            } else {
                message.error('Trình duyệt không hỗ trợ ghi âm!');
            }
        } else {
            // Stop recording
            if (mediaRecorder) {
                mediaRecorder.stop();
                setMediaRecorder(null);
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f4ff 100%)', display: 'flex', flexDirection: 'column' }}>
            <Header
                hospitalInfo={HOSPITAL_INFO}
                patient={patient}
                menuVisible={menuVisible}
                setMenuVisible={setMenuVisible}
                handleMenuClick={handleMenuClick}
                navigate={navigate}
            />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                <Card style={{ maxWidth: 1200, width: '100%', borderRadius: 22, boxShadow: '0 8px 48px #e0e7ff', padding: 0, minHeight: 700, display: 'flex', flexDirection: 'column' }} bodyStyle={{ padding: 0, height: '100%' }}>
                    <div className="chat-header" style={{ padding: 28, borderBottom: '1px solid #eaeaea', background: '#f8f9fa', borderTopLeftRadius: 22, borderTopRightRadius: 22 }}>
                        <h4 style={{ margin: 0, fontWeight: 800, color: '#4f46e5', fontSize: 28 }}><RobotOutlined /> Tư vấn sức khỏe trực tuyến</h4>
                        <div style={{ color: '#888', fontSize: 18 }}>Bạn có thể hỏi về sức khỏe hoặc gửi ảnh y tế để được tư vấn.</div>
                    </div>
                    <div ref={chatBodyRef} className="chat-body" style={{ flex: 1, overflowY: 'auto', padding: 40, background: '#fff', minHeight: 500, display: 'flex', flexDirection: 'column', fontSize: 18 }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 24 }}>
                                <div style={{ maxWidth: '80%', background: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5', color: '#222', borderRadius: 18, padding: '14px 22px', fontSize: 18, boxShadow: '0 2px 12px #e0e7ff', borderBottomRightRadius: msg.role === 'user' ? 0 : 18, borderBottomLeftRadius: msg.role === 'user' ? 18 : 0 }}>
                                    <span style={{ fontWeight: 700, color: msg.role === 'user' ? '#1e40af' : '#4f46e5', marginRight: 12, fontSize: 20 }}>
                                        {msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />} {msg.role === 'user' ? 'Bạn' : 'Hệ thống'}
                                    </span>
                                    <span>{msg.content}</span>
                                    {msg.image && <div style={{ marginTop: 10 }}><img src={msg.image} alt="upload" style={{ maxWidth: 220, borderRadius: 10, boxShadow: '0 2px 8px #e0e7ff' }} /></div>}
                                    {msg.result_image && (
                                        <div style={{ marginTop: 10 }}>
                                            <img src={msg.result_image} alt="result" style={{ maxWidth: 220, borderRadius: 10, boxShadow: '0 2px 8px #e0e7ff' }} />
                                        </div>
                                    )}
                                    {msg.agent && (
                                        <div style={{ marginTop: 8, color: '#6366f1', fontWeight: 600, fontSize: 15 }}>
                                            <span>Agent: {msg.agent}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                <Spin indicator={<LoadingOutlined style={{ fontSize: 24, color: '#4f46e5' }} spin />} />
                                <span style={{ color: '#4f46e5', fontWeight: 700, fontSize: 18 }}>Đang tư vấn...</span>
                            </div>
                        )}
                    </div>
                    <div className="chat-footer" style={{ padding: 24, borderTop: '1px solid #eaeaea', background: '#f8f9fa', borderBottomLeftRadius: 22, borderBottomRightRadius: 22 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
                            <Upload
                                showUploadList={false}
                                beforeUpload={() => false}
                                onChange={handleUpload}
                                accept="image/*"
                            >
                                <Button icon={<PaperClipOutlined />} style={{ borderRadius: '50%', width: 44, height: 44, fontSize: 22 }} />
                            </Upload>
                            <Button
                                icon={isRecording ? <AudioMutedOutlined /> : <AudioOutlined />}
                                style={{ borderRadius: '50%', width: 44, height: 44, fontSize: 22, background: isRecording ? '#f87171' : '#facc15', color: '#222' }}
                                onClick={handleVoiceClick}
                                loading={loading && isRecording}
                            />
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                                placeholder="Nhập câu hỏi hoặc gửi ảnh..."
                                style={{ flex: 1, borderRadius: 18, padding: '12px 18px', fontSize: 18, border: '1.5px solid #e0e7ff', outline: 'none', minHeight: 44 }}
                            />
                            <Button type="primary" icon={<SendOutlined />} style={{ borderRadius: '50%', width: 48, height: 48, fontSize: 22 }} loading={loading} onClick={handleSend} />
                        </div>
                        <Modal open={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                            <img alt="preview" style={{ width: '100%' }} src={preview} />
                        </Modal>
                    </div>
                </Card>
            </div>
            <Footer />
        </div>
    );
};

export default PatientConsult; 