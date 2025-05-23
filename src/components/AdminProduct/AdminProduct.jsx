import React, { useEffect, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { WrapperHeader, WrapperUploadFile } from './style';
import { Button, Form, Select, Space } from 'antd';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';
import { getBase64, renderOptions } from '../../utils';
import * as ProductService from '../../services/ProductService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../LoadingComponent/Loading';
import * as message from '../../components/Message/Message';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DrawerComponent from '../DrawerComponent/DrawerComponent';
import { useSelector } from 'react-redux';
import ModalComponent from '../ModalComponent/ModalComponent';
import { useRef } from 'react';

const AdminProduct = () => {
    const [formCreate] = Form.useForm();
    const [formUpdate] = Form.useForm();

    const [fileListCreate, setFileListCreate] = useState([]);
    const [fileListUpdate, setFileListUpdate] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [typeSelect, setTypeSelect] = useState('')

    const user = useSelector((state) => state?.user);
    const queryClient = useQueryClient();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    const [stateProduct, setStateProduct] = useState({
        name: '', price: '', description: '', rating: '', image: '', countInStock: '', type: '', newType: '', discount: ''
    });

    const [stateProductDetails, setStateProductDetails] = useState({
        name: '', price: '', description: '', rating: '', image: '', countInStock: '', type: '', discount: '',
    });

    const mutation = useMutationHooks((data) => ProductService.createProduct(data));

    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rest } = data;
        return ProductService.updateProduct(id, token, rest);
    });

    const mutationDeleted = useMutationHooks((data) => {
        const { id, token } = data;
        return ProductService.deleteProduct(id, token);
    });

    const mutationDeletedMany = useMutationHooks((data) => {
        const { token, ...ids } = data;
        return ProductService.deleteManyProduct(ids, token);
    });

    const getAllProducts = async () => ProductService.getAllProduct('', 100);

    const fetchGetDetailsProduct = async (rowSelected) => {
        const res = await ProductService.getDetailsProduct(rowSelected);
        if (res?.data) {
            setStateProductDetails(res.data);
            formUpdate.setFieldsValue(res.data);
        }
    };

    useEffect(() => {
        if (rowSelected) fetchGetDetailsProduct(rowSelected);
    }, [rowSelected]);

    const handleDetailsProduct = () => {
        if (rowSelected) {
            setIsLoadingUpdate(true);
            fetchGetDetailsProduct(rowSelected).then(() => {
                setIsLoadingUpdate(false);
                setIsOpenDrawer(true);
            });
        }
    };

    const handleDeleteManyProducts = (ids) => {
        mutationDeletedMany.mutate({ ids, token: user?.accessToken }, {
            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['products'] });
                setRowSelectedKeys([]);
            }
        });
    };

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        return res
    }


    const { data, isLoading, isSuccess, isError } = mutation;
    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate;
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted;
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeleted;
    const { isLoading: isLoadingProducts, data: products, refetch: refetchProducts } = useQuery({
        queryKey: ['products'],
        queryFn: getAllProducts,
    });
    const typeProduct = useQuery({
        queryKey: ['type-products'],
        queryFn: fetchAllTypeProduct,
    });


    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            message.success();
            handleCancel();
        } else if (isError) message.error();
    }, [isSuccess, isError]);

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            message.success();
        } else if (isErrorDeletedMany) message.error();
    }, [isSuccessDeletedMany, isErrorDeletedMany]);

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            message.success();
            handleCancelDelete();
        } else if (isErrorDeleted) message.error();
    }, [isSuccessDeleted, isErrorDeleted]);

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            message.success();
            handleCloseDrawer();
        } else if (isErrorUpdated) message.error();
    }, [isSuccessUpdated]);

    const handleCancel = () => {
        setIsModalOpen(false);
        setStateProduct({ name: '', price: '', description: '', rating: '', image: '', countInStock: '', type: '', discount: '' });
        formCreate.resetFields();
        setFileListCreate([]);
    };

    const handleCancelDelete = () => { setIsModalOpenDelete(false); }


    const handleDeleteProduct = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.accessToken }, {
            onSettled: () => {
                refetchProducts();
                setIsModalOpenDelete(false);
                setRowSelected(null);
            },
        });
    };

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        setStateProductDetails({ name: '', price: '', description: '', rating: '', image: '', countInStock: '', type: '', discount: '' });
        formUpdate.resetFields();
        setFileListUpdate([]);
    };

    const handleOnchange = (e) => setStateProduct({ ...stateProduct, [e.target.name]: e.target.value });
    const handleOnchangeDetails = (e) => setStateProductDetails({ ...stateProductDetails, [e.target.name]: e.target.value });


    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (file && !file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
        setFileListCreate(fileList);
        setStateProduct({ ...stateProduct, image: file?.preview || '' });
    };

    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0];
        if (file && !file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
        setFileListUpdate(fileList);
        setStateProductDetails({ ...stateProductDetails, image: file?.preview || '' });
    };

    const onFinish = () => {
        const params = {
            name: stateProduct.name,
            price: stateProduct.price,
            description: stateProduct.description,
            rating: stateProduct.rating,
            image: stateProduct.image,
            countInStock: stateProduct.countInStock,
            type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
            discount: stateProduct.discount
        }
        mutation.mutate(params);
    }
    const onUpdateProduct = () => mutationUpdate.mutate({ id: rowSelected, token: user?.accessToken, ...stateProductDetails });


    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const handleChangeSelect = (value) => {
        setStateProduct({
            ...stateProduct,
            type: value
        })
    }

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={`${selectedKeys[0] || ''}`}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>

                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        // render: (text) =>
        //   searchedColumn === dataIndex ? (
        //     <Highlighter
        //       highlightStyle={{
        //         backgroundColor: '#ffc069',
        //         padding: 0,
        //       }}
        //       searchWords={[searchText]}
        //       autoEscape
        //       textToHighlight={text ? text.toString() : ''}
        //     />
        //   ) : (
        //     text
        //   ),
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length, ...getColumnSearchProps('name')
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            filters: [
                {
                    text: '>=50',
                    value: '>=',
                },
                {
                    text: '<=50',
                    value: '<=',
                },
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return record.price >= 50
                }
                return record.price <= 50
            }
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            sorter: (a, b) => a.rating - b.rating,
            filters: [
                {
                    text: '>=3',
                    value: '>=',
                },
                {
                    text: '<=3',
                    value: '<=',
                },
            ],
            onFilter: (value, record) => {
                if (value === '>=') {
                    return Number(record.rating) >= 3
                }
                return Number(record.rating) <= 3
            }
        },
        {
            title: 'Type',
            dataIndex: 'type'
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: () => (
                <div>
                    <DeleteOutlined style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
                    <EditOutlined style={{ color: 'orange', fontSize: '20px', cursor: 'pointer' }} onClick={handleDetailsProduct} />
                </div>
            ),
        },
    ];
    const dataTable = Array.isArray(products?.data) ? products.data.map((product) => ({ ...product, key: product._id })) : [];

    return (
        <div>
            <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
            <div style={{ marginTop: '10px' }}>
                <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed' }} onClick={() => setIsModalOpen(true)}>
                    <PlusOutlined style={{ fontSize: '60px' }} />
                </Button>
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent
                    handleDeleteMany={handleDeleteManyProducts}
                    columns={columns}
                    isLoading={isLoadingProducts}
                    data={dataTable}
                    rowKey="key"
                    rowSelectedKeys={rowSelectedKeys}
                    setRowSelectedKeys={setRowSelectedKeys}
                    onRow={(record) => ({
                        onClick: () => setRowSelected(record._id)
                    })}
                />

            </div>
            <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Loading isLoading={isLoading}>
                    <Form
                        name="basic"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                        onFinish={onFinish}
                        autoComplete="on"
                        form={formCreate}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateProduct['name']} onChange={handleOnchange} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input your type!' }]}
                        >
                            <Select
                                name={typeSelect !== 'add_type' ? 'type' : ''}
                                value={typeSelect === 'add_type' ? 'add_type' : stateProduct.type}
                                onChange={handleChangeSelect}
                                options={renderOptions(typeProduct?.data?.data)}
                            />
                        </Form.Item>
                        {stateProduct.type === 'add_type' && (
                            <Form.Item
                                label='New type'
                                name="newType"
                                rules={[{ required: true, message: 'Please input your type!' }]}
                            >
                                <InputComponent value={stateProduct.newType} onChange={handleOnchange} name='newType' />
                            </Form.Item>
                        )}
                        <Form.Item
                            label="Count inStock"
                            name="countInStock"
                            rules={[{ required: true, message: 'Please input your count inStock!' }]}
                        >
                            <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock" />
                        </Form.Item>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input your price!' }]}
                        >
                            <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price" />
                        </Form.Item>
                        <Form.Item
                            label="Rating"
                            name="rating"
                            rules={[{ required: true, message: 'Please input your rating!' }]}
                        >
                            <InputComponent value={stateProduct.rating} onChange={handleOnchange} name="rating" />
                        </Form.Item>
                        <Form.Item
                            label="Discount"
                            name="discount"
                            rules={[{ required: true, message: 'Please input your discount!' }]}
                        >
                            <InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount" />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please input your description!' }]}
                        >
                            <InputComponent value={stateProduct.description} onChange={handleOnchange} name="description" />
                        </Form.Item>
                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[{ required: true, message: 'Please input your image!' }]}
                        >
                            <WrapperUploadFile fileList={fileListCreate} onChange={handleOnchangeAvatar} maxCount={1}>
                                <Button >Select File</Button>
                                {stateProduct?.image && (
                                    <img src={stateProduct?.image} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px',
                                    }} alt="avatar" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>
            <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        onFinish={onUpdateProduct}
                        autoComplete="on"
                        form={formUpdate}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateProductDetails.name} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input your type!' }]}
                        >
                            <InputComponent value={stateProductDetails.type} onChange={handleOnchangeDetails} name="type" />
                        </Form.Item>
                        <Form.Item
                            label="Count inStock"
                            name="countInStock"
                            rules={[{ required: true, message: 'Please input your count inStock!' }]}
                        >
                            <InputComponent value={stateProductDetails.countInStock} onChange={handleOnchangeDetails} name="countInStock" />
                        </Form.Item>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input your price!' }]}
                        >
                            <InputComponent value={stateProductDetails.price} onChange={handleOnchangeDetails} name="price" />
                        </Form.Item>
                        <Form.Item
                            label="Rating"
                            name="rating"
                            rules={[{ required: true, message: 'Please input your rating!' }]}
                        >
                            <InputComponent value={stateProductDetails.rating} onChange={handleOnchangeDetails} name="rating" />
                        </Form.Item>
                        <Form.Item
                            label="Discount"
                            name="discount"
                            rules={[{ required: true, message: 'Please input your discount of product!' }]}
                        >
                            <InputComponent value={stateProductDetails.discount} onChange={handleOnchangeDetails} name="discount" />
                        </Form.Item>
                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please input your description!' }]}
                        >
                            <InputComponent value={stateProductDetails.description} onChange={handleOnchangeDetails} name="description" />
                        </Form.Item>
                        <Form.Item
                            label="Image"
                            name="image"
                            rules={[{ required: true, message: 'Please input your image!' }]}
                        >
                            <WrapperUploadFile fileList={fileListUpdate} onChange={handleOnchangeAvatarDetails} maxCount={1}>
                                <Button >Select File</Button>
                                {stateProductDetails?.image && (
                                    <img src={stateProductDetails?.image} style={{
                                        height: '60px',
                                        width: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        marginLeft: '10px',
                                    }} alt="avatar" />
                                )}
                            </WrapperUploadFile>
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Apply
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent title="Xoá sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct} >
                <Loading isLoading={isLoadingDeleted}>
                    <div>Bạn có muốn xoá sản phẩm này không?</div>
                </Loading>
            </ModalComponent>
        </div>

    )
}

export default AdminProduct