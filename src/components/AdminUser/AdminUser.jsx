import React, { useEffect, useRef, useState } from 'react'
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Space } from 'antd'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import Loading from '../LoadingComponent/Loading'
import { getBase64 } from '../../utils'
import * as message from '../../components/Message/Message';
import { useSelector } from 'react-redux'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService';
import ModalComponent from '../ModalComponent/ModalComponent'



const AdminUser = () => {
    const [formCreate] = Form.useForm();
    const [formUpdate] = Form.useForm();

    const [fileListCreate, setFileListCreate] = useState([]);
    const [fileListUpdate, setFileListUpdate] = useState([]);

    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

    const user = useSelector((state) => state?.user);
    const queryClient = useQueryClient();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);


    const [stateUserDetails, setStateUserDetails] = useState({
        name: '', email: '', phone: '', isAdmin: false, avatar: '', address: ''
    });



    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rest } = data;
        return UserService.updateUser(id, rest, token);
    });

    const mutationDeletedMany = useMutationHooks((data) => {
        const { token, ...ids } = data;
        return UserService.deleteManyUser(ids, token);
    });

    const handleDeleteManyUsers = (ids) => {
        mutationDeletedMany.mutate({ ids, token: user?.accessToken }, {
            onSuccess: () => {
                message.success('Xoá thành công');
                setRowSelectedKeys([]);
                queryClient.invalidateQueries({ queryKey: ['users'] });
            },
            onError: () => {
                message.error('Lỗi khi xoá người dùng');
            }
        });
    };


    const mutationDeleted = useMutationHooks((data) => {
        const { id, token } = data;
        return UserService.deleteUser(id, token);
    });

    const getAllUsers = async () => {
        const response = await UserService.getAllUser(user?.access_token);
        return response;
    };



    const fetchGetDetailsUser = async (rowSelected) => {
        const res = await UserService.getDetailsUser(rowSelected);
        if (res?.data) {
            setStateUserDetails(res.data);
            formUpdate.setFieldsValue(res.data);
        }
    };

    useEffect(() => {
        if (rowSelected) fetchGetDetailsUser(rowSelected);
    }, [rowSelected]);

    const handleDetailsUser = () => {
        if (rowSelected) {
            setIsLoadingUpdate(true);
            fetchGetDetailsUser(rowSelected).then(() => {
                setIsLoadingUpdate(false);
                setIsOpenDrawer(true);
            });
        }
    };

    const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate;
    const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDeleted;
    const { data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany } = mutationDeleted;
    const { isLoading: isLoadingUsers, data: users, refetch: refetchUsers } = useQuery({
        queryKey: ['users'],
        queryFn: getAllUsers,
    });



    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            message.success();
            handleCancelDelete();
        } else if (isErrorDeleted) message.error();
    }, [isSuccessDeleted, isErrorDeleted]);

    useEffect(() => {
        if (isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            message.success();
        } else if (isErrorDeletedMany) message.error();
    }, [isSuccessDeletedMany, isErrorDeletedMany]);

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            message.success();
            handleCloseDrawer();
        } else if (isErrorUpdated) message.error();
    }, [isSuccessUpdated]);



    const handleCancelDelete = () => setIsModalOpenDelete(false);

    const handleDeleteUser = () => {
        mutationDeleted.mutate({ id: rowSelected, token: user?.accessToken }, {
            onSettled: () => {
                refetchUsers();
                setIsModalOpenDelete(false);
                setRowSelected(null);
            },
        });
    };

    const handleCloseDrawer = () => {
        setIsOpenDrawer(false);
        formUpdate.resetFields();
        setFileListUpdate([]);
    };


    const handleOnchangeDetails = (e) => setStateUserDetails({ ...stateUserDetails, [e.target.name]: e.target.value });

    const handleOnchangeAvatarDetails = async ({ fileList }) => {
        const file = fileList[0];
        if (file && !file.url && !file.preview) file.preview = await getBase64(file.originFileObj);
        setFileListUpdate(fileList);
        setStateUserDetails({ ...stateUserDetails, avatar: file?.preview || '' });
    };


    const onUpdateUser = () => mutationUpdate.mutate({ id: rowSelected, token: user?.accessToken, ...stateUserDetails });


    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

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
            title: 'Email',
            dataIndex: 'email',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.email.length - b.email.length, ...getColumnSearchProps('email')
        },
        {
            title: 'Address',
            dataIndex: 'address',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.address.length - b.address.length, ...getColumnSearchProps('address')
        },
        {
            title: 'Admin',
            dataIndex: 'isAdmin',
            filters: [
                {
                    text: 'True',
                    value: true,
                },
                {
                    text: 'False',
                    value: false,
                },
            ],
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone - b.phone,
            ...getColumnSearchProps('phone')
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: () => (
                <div>
                    <DeleteOutlined style={{ color: 'red', fontSize: '20px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
                    <EditOutlined style={{ color: 'orange', fontSize: '20px', cursor: 'pointer' }} onClick={handleDetailsUser} />
                </div>
            ),
        },
    ];
    const dataTable = Array.isArray(users?.data) ? users.data.map((user) => ({ ...user, key: user._id, isAdmin: user.isAdmin ? 'TRUE' : 'FALSE' })) : [];


    return (
        <div>
            <WrapperHeader>Quản lý người dùng</WrapperHeader>
            <div style={{ marginTop: '20px' }}>
                <TableComponent
                    handleDeleteMany={handleDeleteManyUsers}
                    columns={columns}
                    isLoading={isLoadingUsers}
                    data={dataTable}
                    rowKey="key"
                    rowSelectedKeys={rowSelectedKeys}
                    setRowSelectedKeys={setRowSelectedKeys}
                    onRow={(record) => ({ onClick: () => setRowSelected(record._id) })}
                />

            </div>
            <DrawerComponent title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width="90%">
                <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
                    <Form
                        name="basic"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        onFinish={onUpdateUser}
                        autoComplete="on"
                        form={formUpdate}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateUserDetails.name} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <InputComponent value={stateUserDetails.email} onChange={handleOnchangeDetails} name="email" />
                        </Form.Item>
                        <Form.Item
                            label="Phone"
                            name="phone"
                            rules={[{ required: true, message: 'Please input your phone!' }]}
                        >
                            <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone" />
                        </Form.Item>
                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[{ required: true, message: 'Please input your address!' }]}
                        >
                            <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address" />
                        </Form.Item>
                        <Form.Item
                            label="Avatar"
                            name="avatar"
                            rules={[{ required: true, message: 'Please input your avatar!' }]}
                        >
                            <WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
                                <Button >Select File</Button>
                                {stateUserDetails?.avatar && (
                                    <img src={stateUserDetails?.avatar} style={{
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
            <ModalComponent forceRender title="Xoá người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser} >
                <Loading isLoading={isLoadingDeleted}>
                    <div>Bạn có muốn xoá người dùng này không?</div>
                </Loading>
            </ModalComponent>
        </div>

    )
}

export default AdminUser