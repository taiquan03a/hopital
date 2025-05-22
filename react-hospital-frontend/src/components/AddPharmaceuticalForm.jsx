import React, { useState } from 'react';
import { Formik } from 'formik';
import { Form, Input, Button, InputNumber, Select, Modal, message } from 'antd';
import * as Yup from 'yup';
import { addPharmaceutical, addCategory, addSupplier, getAllCategories, getAllSuppliers } from '../services/api';

const PharmaceuticalAddSchema = Yup.object().shape({
    name: Yup.string().required('Bắt buộc'),
    code: Yup.string().required('Bắt buộc'),
    unit: Yup.string().required('Bắt buộc'),
    price: Yup.number().required('Bắt buộc').min(0, 'Giá phải >= 0'),
    quantity: Yup.number().min(0, 'Số lượng phải >= 0').required('Bắt buộc'),
    description: Yup.string().nullable(),
    origin: Yup.string().nullable(),
    expiry_date: Yup.date().nullable(),
    manufacturing_date: Yup.date().nullable(),
    category: Yup.string().required('Bắt buộc'),
    supplier: Yup.string().required('Bắt buộc'),
});

const AddPharmaceuticalForm = ({ categories, suppliers, onSuccess, initialData, isEdit }) => {
    const [catModal, setCatModal] = useState(false);
    const [supModal, setSupModal] = useState(false);
    const [catName, setCatName] = useState('');
    const [supName, setSupName] = useState('');
    const [supAddress, setSupAddress] = useState('');
    const [supError, setSupError] = useState('');
    const [catLoading, setCatLoading] = useState(false);
    const [supLoading, setSupLoading] = useState(false);
    const [catList, setCatList] = useState(categories || []);
    const [supList, setSupList] = useState(suppliers || []);

    // Sync prop changes
    React.useEffect(() => { setCatList(categories || []); }, [categories]);
    React.useEffect(() => { setSupList(suppliers || []); }, [suppliers]);

    const reloadCategories = async () => {
        const cats = await getAllCategories();
        setCatList(cats);
    };
    const reloadSuppliers = async () => {
        const sups = await getAllSuppliers();
        setSupList(sups);
    };

    const handleAddCategory = async () => {
        if (!catName.trim()) return;
        setCatLoading(true);
        try {
            await addCategory({ name: catName });
            message.success('Thêm danh mục thành công!');
            setCatModal(false);
            setCatName('');
            await reloadCategories();
        } catch (e) {
            message.error('Thêm danh mục thất bại!');
        }
        setCatLoading(false);
    };
    const handleAddSupplier = async () => {
        if (!supName.trim() || !supAddress.trim()) {
            setSupError('Vui lòng nhập đầy đủ tên và địa chỉ!');
            return;
        }
        setSupLoading(true);
        try {
            await addSupplier({ name: supName, address: supAddress });
            message.success('Thêm nhà cung cấp thành công!');
            setSupModal(false);
            setSupName('');
            setSupAddress('');
            setSupError('');
            await reloadSuppliers();
        } catch (e) {
            message.error('Thêm nhà cung cấp thất bại!');
        }
        setSupLoading(false);
    };

    const initialValues = initialData ? {
        name: initialData.name || '',
        code: initialData.code || '',
        unit: initialData.unit || '',
        price: initialData.price || 0,
        quantity: initialData.quantity || 0,
        description: initialData.description || '',
        origin: initialData.origin || '',
        expiry_date: initialData.expiry_date || '',
        manufacturing_date: initialData.manufacturing_date || '',
        category: initialData.category?.id ? String(initialData.category.id) : '',
        supplier: initialData.supplier?.id ? String(initialData.supplier.id) : '',
    } : { name: '', code: '', unit: '', price: 0, quantity: 0, description: '', origin: '', expiry_date: '', manufacturing_date: '', category: '', supplier: '' };
    return (
        <>
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={PharmaceuticalAddSchema}
                onSubmit={async (values, { setSubmitting, setErrors, resetForm }) => {
                    try {
                        if (isEdit && initialData) {
                            // Gọi API update
                            await updatePharmaceutical(initialData.id, values);
                        } else {
                            await addPharmaceutical(values);
                        }
                        if (onSuccess) onSuccess();
                        resetForm();
                    } catch (err) {
                        if (err.response && err.response.data) {
                            setErrors(err.response.data);
                        }
                    }
                    setSubmitting(false);
                }}
            >
                {({ errors, touched, isSubmitting, handleChange, handleBlur, values, handleSubmit, setFieldValue, resetForm }) => (
                    <form onSubmit={handleSubmit}>
                        <Form.Item
                            label="Tên thuốc"
                            validateStatus={errors.name && touched.name ? 'error' : ''}
                            help={touched.name && errors.name}
                        >
                            <Input
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Tên thuốc"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Mã"
                            validateStatus={errors.code && touched.code ? 'error' : ''}
                            help={touched.code && errors.code}
                        >
                            <Input
                                name="code"
                                value={values.code}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Mã thuốc"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Đơn vị"
                            validateStatus={errors.unit && touched.unit ? 'error' : ''}
                            help={touched.unit && errors.unit}
                        >
                            <Input
                                name="unit"
                                value={values.unit}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Đơn vị"
                            />
                        </Form.Item>
                        <Form.Item
                            label={<span>Giá</span>}
                            validateStatus={errors.price && touched.price ? 'error' : ''}
                            help={touched.price && errors.price}
                        >
                            <InputNumber
                                name="price"
                                value={values.price}
                                onChange={value => setFieldValue('price', value)}
                                onBlur={handleBlur}
                                min={0}
                                style={{ width: '100%' }}
                                placeholder="Giá"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Số lượng"
                            validateStatus={errors.quantity && touched.quantity ? 'error' : ''}
                            help={touched.quantity && errors.quantity}
                        >
                            <InputNumber
                                name="quantity"
                                value={values.quantity}
                                onChange={value => setFieldValue('quantity', value)}
                                onBlur={handleBlur}
                                min={0}
                                style={{ width: '100%' }}
                                placeholder="Số lượng"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Mô tả"
                            validateStatus={errors.description && touched.description ? 'error' : ''}
                            help={touched.description && errors.description}
                        >
                            <Input.TextArea
                                name="description"
                                value={values.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Mô tả"
                                rows={2}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Xuất xứ"
                            validateStatus={errors.origin && touched.origin ? 'error' : ''}
                            help={touched.origin && errors.origin}
                        >
                            <Input
                                name="origin"
                                value={values.origin}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Xuất xứ"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Ngày sản xuất"
                            validateStatus={errors.manufacturing_date && touched.manufacturing_date ? 'error' : ''}
                            help={touched.manufacturing_date && errors.manufacturing_date}
                        >
                            <Input
                                name="manufacturing_date"
                                type="date"
                                value={values.manufacturing_date}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Ngày sản xuất"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Hạn sử dụng"
                            validateStatus={errors.expiry_date && touched.expiry_date ? 'error' : ''}
                            help={touched.expiry_date && errors.expiry_date}
                        >
                            <Input
                                name="expiry_date"
                                type="date"
                                value={values.expiry_date}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder="Hạn sử dụng"
                            />
                        </Form.Item>
                        <Form.Item
                            label={<span>Danh mục <Button size="small" type="link" onClick={() => setCatModal(true)} style={{ padding: 0 }}>+ Thêm</Button></span>}
                            validateStatus={errors.category && touched.category ? 'error' : ''}
                            help={touched.category && errors.category}
                        >
                            <Select
                                name="category"
                                value={values.category}
                                onChange={value => setFieldValue('category', value)}
                                onBlur={handleBlur}
                                placeholder="Chọn danh mục"
                                disabled={!catList || catList.length === 0}
                                dropdownRender={menu => <>{menu}</>}
                            >
                                {catList && catList.map(cat => (
                                    <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label={<span>Nhà cung cấp <Button size="small" type="link" onClick={() => setSupModal(true)} style={{ padding: 0 }}>+ Thêm</Button></span>}
                            validateStatus={errors.supplier && touched.supplier ? 'error' : ''}
                            help={touched.supplier && errors.supplier}
                        >
                            <Select
                                name="supplier"
                                value={values.supplier}
                                onChange={value => setFieldValue('supplier', value)}
                                onBlur={handleBlur}
                                placeholder="Chọn nhà cung cấp"
                                disabled={!supList || supList.length === 0}
                                dropdownRender={menu => <>{menu}</>}
                            >
                                {supList && supList.map(sup => (
                                    <Select.Option key={sup.id} value={sup.id}>{sup.name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Button type="primary" htmlType="submit" loading={isSubmitting} block disabled={isSubmitting || !catList.length || !supList.length}>
                            {isEdit ? 'Cập nhật thuốc' : 'Thêm thuốc'}
                        </Button>
                    </form>
                )}
            </Formik>
            {/* Modal thêm danh mục */}
            <Modal open={catModal} onCancel={() => setCatModal(false)} onOk={handleAddCategory} confirmLoading={catLoading} okText="Thêm" cancelText="Hủy" title="Thêm danh mục">
                <Input value={catName} onChange={e => setCatName(e.target.value)} placeholder="Tên danh mục" onPressEnter={handleAddCategory} />
            </Modal>
            {/* Modal thêm nhà cung cấp */}
            <Modal
                open={supModal}
                onCancel={() => { setSupModal(false); setSupName(''); setSupAddress(''); setSupError(''); }}
                onOk={handleAddSupplier}
                confirmLoading={supLoading}
                okText="Thêm"
                cancelText="Hủy"
                title="Thêm nhà cung cấp"
            >
                <Input
                    value={supName}
                    onChange={e => setSupName(e.target.value)}
                    placeholder="Tên nhà cung cấp"
                    style={{ marginBottom: 8 }}
                />
                <Input
                    value={supAddress}
                    onChange={e => setSupAddress(e.target.value)}
                    placeholder="Địa chỉ"
                />
                {supError && <div style={{ color: 'red', marginTop: 8 }}>{supError}</div>}
            </Modal>
        </>
    );
};

export default AddPharmaceuticalForm; 