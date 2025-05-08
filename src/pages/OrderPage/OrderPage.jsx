import React, { useEffect, useMemo, useState } from 'react';
import { Checkbox, Form } from 'antd';
import {
    WrapperCountOrder,
    WrapperInfo,
    WrapperItemOrder,
    WrapperLeft,
    WrapperListOrder,
    WrapperRight,
    WrapperStyleHeader,
    WrapperTotal,
    WrapperInputNumber,
    WrapperStyleHeaderDelivery
} from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct, selectedOrder } from '../../redux/slides/orderSlide';
import { convertPrice } from '../../utils';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService'
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message'
import { updateUser } from '../../redux/slides/userSilde';
import { useNavigate } from 'react-router-dom';
import StepComponent from '../../components/StepComponent/StepComponent';

const OrderPage = () => {
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)
    const [listChecked, setListChecked] = useState([])
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '', phone: '', address: '', city: ''
    });
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const dispatch = useDispatch()

    const handleChangeCount = (type, idProduct, limited) => {
        if (type === 'increase') {
            if (!limited) {
                dispatch(increaseAmount({ idProduct }))
            }
        } else {
            if (!limited) {
                dispatch(decreaseAmount({ idProduct }))
            }
        }
    };

    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({ idProduct }))
    }

    const handleOnchangeCheckAll = (e) => {
        if (e.target.checked) {
            const newListChecked = []
            order?.orderItems?.forEach((item) => {
                newListChecked.push(item?.product)
            })
            setListChecked(newListChecked)
        } else {
            setListChecked([])
        }
    };

    useEffect(() => {
        dispatch(selectedOrder({ listChecked }))
    }, [listChecked])

    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
    }, [form, stateUserDetails])

    useEffect(() => {
        if (isOpenModalUpdateInfo) {
            setStateUserDetails({
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone
            })
        }
    }, [isOpenModalUpdateInfo])

    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true)
    }

    const onChange = (e) => {
        if (listChecked.includes(e.target.value)) {
            const newListChecked = listChecked.filter((item) => item !== e.target.value)
            setListChecked(newListChecked)
        } else {
            setListChecked([...listChecked, e.target.value])
        }
    }

    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        }, 0)
        return result
    }, [order])

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            const totalDiscount = cur.discount ? cur.discount : 0
            return total + (priceMemo * (totalDiscount * cur.amount) / 100)
        }, 0)
        if (Number(result)) {
            return result
        }
        return 0
    }, [order])

    const deliveryPriceMemo = useMemo(() => {
        if (priceMemo >= 200000 && priceMemo < 500000) {
            return 10000
        } else if (priceMemo >= 500000 || order?.orderItemsSelected?.length === 0) {
            return 0
        } else {
            return 20000
        }
    }, [priceMemo])

    const totalPriceMemo = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
    }, [priceMemo, priceDiscountMemo, deliveryPriceMemo])

    const handleRemoveAllOrder = () => {
        if (listChecked?.length === order?.orderItems?.length) {
            dispatch(removeAllOrderProduct({ listChecked }))
        }
    }

    const handleAddCart = () => {

        if (!order?.orderItemsSelected?.length) {
            message.error('Vui lòng chọn sản phẩm')
        } else if (!user?.phone || !user.address || !user.name || !user.city) {
            setIsOpenModalUpdateInfo(true)
        } else {
            navigate('/payment')
        }
    }

    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rest } = data;
        return UserService.updateUser(id, rest, token);
    });

    const { isLoading, data } = mutationUpdate

    const handleCancelUpdate = () => {
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        })
        form.resetFields()
        setIsOpenModalUpdateInfo(false)
    }

    const handleUpdateInfoUser = () => {
        const { name, address, city, phone } = stateUserDetails
        if (name && address && city && phone) {
            mutationUpdate.mutate({ id: user?.id, token: user?.accessToken, ...stateUserDetails }, {
                onSuccess: () => {
                    dispatch(updateUser({ name, address, city, phone }))
                    setIsOpenModalUpdateInfo(false)
                }
            })
        }
    }

    const handleOnchangeDetails = (e) => setStateUserDetails({ ...stateUserDetails, [e.target.name]: e.target.value });

    const itemsDelivery = [
        {
            title: '20.000VND',
            description: 'Dưới 200.000VND',
        },
        {
            title: '10.000VND',
            description: 'Từ 200.000 VND đến dưới 500.000VND',
        },
        {
            title: '0 VND',
            description: 'Trên 500.000VND',
        },

    ]

    return (
        <div style={{ background: '#f5f5fa', width: '100%', height: '100vh' }}>
            <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                <h3>Giỏ hàng</h3>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <WrapperLeft>
                        <WrapperStyleHeaderDelivery>
                            <StepComponent items={itemsDelivery} current={deliveryPriceMemo === 10000 ? 2 : deliveryPriceMemo === 20000 ? 1
                                : order.orderItemsSelected.length === 0 ? 0 : 3} />
                        </WrapperStyleHeaderDelivery>
                        <WrapperStyleHeader>
                            <span style={{ display: 'inline-block', width: '390px' }}>
                                <Checkbox onChange={handleOnchangeCheckAll} checked={listChecked?.length === order?.orderItems?.length} />
                                <span> Tất cả ({order?.orderItems?.length} sản phẩm)</span>
                            </span>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>Đơn giá</span>
                                <span>Số lượng</span>
                                <span>Thành tiền</span>
                                <DeleteOutlined style={{ cursor: 'pointer' }} onClick={handleRemoveAllOrder} />
                            </div>
                        </WrapperStyleHeader>

                        <WrapperListOrder>
                            {order?.orderItems?.map((order) => {
                                return (
                                    <WrapperItemOrder key={order?.product}>
                                        <div style={{ width: '390px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Checkbox onChange={onChange} value={order?.product} checked={listChecked.includes(order?.product)} />
                                            <img
                                                src={order?.image}
                                                alt="product"
                                                style={{ width: '77px', height: '79px', objectFit: 'cover', borderRadius: '4px' }}
                                            />
                                            <div style={{
                                                width: 260,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>{order?.name}</div>
                                        </div>

                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span>
                                                <span style={{ fontSize: '13px', color: '#242424' }}>{convertPrice(order?.price)}</span>
                                            </span>

                                            <WrapperCountOrder>
                                                <button onClick={() => handleChangeCount('decrease', order?.product, order?.amount === 1)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                                                    <MinusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                </button>
                                                <WrapperInputNumber defaultValue={order?.amount} size="small" value={order?.amount} min={1} max={order?.countInStock} readOnly />
                                                <button onClick={() => handleChangeCount('increase', order?.product, order?.amount === order.countInStock)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                                                    <PlusOutlined style={{ color: '#000', fontSize: '10px' }} />
                                                </button>
                                            </WrapperCountOrder>

                                            <span style={{ color: 'rgb(255, 66, 78)', fontSize: '13px' }}>{convertPrice(order?.price * order?.amount)}</span>
                                            <DeleteOutlined style={{ cursor: 'pointer' }} onClick={() => handleDeleteOrder(order?.product)} />
                                        </div>
                                    </WrapperItemOrder>
                                )
                            })}
                        </WrapperListOrder>
                    </WrapperLeft>

                    <WrapperRight>
                        <div style={{ width: '100%' }}>
                            <WrapperInfo>
                                <div>
                                    <span>Địa chỉ:  </span>
                                    <span style={{ fontWeight: 'bold' }}>{`${user?.address} ${user?.city}`}</span>
                                    <span onClick={handleChangeAddress} style={{ color: 'red', cursor: 'pointer' }}>Thay đổi</span>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>Tạm tính</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 500 }}>{convertPrice(priceMemo)}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>Giảm giá</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 500 }}>{convertPrice(priceDiscountMemo)}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>Phí giao hàng</span>
                                    <span style={{ color: '#000', fontSize: '14px', fontWeight: 500 }}>{convertPrice(deliveryPriceMemo)}</span>
                                </div>
                            </WrapperInfo>

                            <WrapperTotal>
                                <span>Tổng tiền</span>
                                <span style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold' }}>{convertPrice(totalPriceMemo)}</span>
                                    <span style={{ color: '#000', fontSize: '11px' }}>(Đã bao gồm VAT nếu có)</span>
                                </span>
                            </WrapperTotal>

                            <ButtonComponent
                                onClick={() => handleAddCart()}
                                size={40}
                                styleButton={{
                                    background: 'rgb(255, 57, 69)',
                                    color: '#fff',
                                    height: '48px',
                                    width: '320px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '16px'
                                }}
                                textbutton={'Mua hàng'}
                                styletextbutton={{ color: 'fff', fontSize: '15px', fontWeight: '700' }}
                            >
                            </ButtonComponent>
                        </div>
                    </WrapperRight>
                </div>
            </div>
            <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancelUpdate} onOk={handleUpdateInfoUser} >
                <Loading isLoading={isLoading}>
                    <Form
                        name="basic"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        //onFinish={onUpdateUser}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateUserDetails.name} onChange={handleOnchangeDetails} name="name" />
                        </Form.Item>

                        <Form.Item
                            label="City"
                            name="city"
                            rules={[{ required: true, message: 'Please input your city!' }]}
                        >
                            <InputComponent value={stateUserDetails.city} onChange={handleOnchangeDetails} name="city" />
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

                    </Form>
                </Loading>
            </ModalComponent>
        </div>
    );
};

export default OrderPage;
