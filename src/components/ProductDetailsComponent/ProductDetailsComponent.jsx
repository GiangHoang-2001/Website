import { Col, Image, Rate, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import imageProductSmall from '../../assets/images/imagesmall.webp'
import { WrapperAddressProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../services/ProductService';
import { useQuery } from '@tanstack/react-query'
import Loading from '../LoadingComponent/Loading'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct, resetOrder } from '../../redux/slides/orderSlide'
import { convertPrice, initFacebookSDK } from '../../utils'
import * as message from '../Message/Message'
import LikeButtonComponent from '../LikeButtonComponent/LikeButtonComponent'
import CommentComponent from '../CommentComponent/CommentComponent'


const ProductDetailsComponent = ({ idProduct }) => {
    const [numProduct, setNumProduct] = useState(1)
    const user = useSelector((state) => state.user)
    const order = useSelector((state) => state.order)
    const [triggerAdd, setTriggerAdd] = useState(false);
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const onChange = (value) => {
        setNumProduct(Number(value))
    }
    const fetchGetDetailsProduct = async (context) => {
        const id = context?.queryKey && context?.queryKey[1]

        if (id) {
            const res = await ProductService.getDetailsProduct(id);

            return res.data
        }
    }

    useEffect(() => {
        initFacebookSDK()
    }, [])

    useEffect(() => {
        if (triggerAdd) {
            if (order.isSuccessOrder) {
                message.success('Đã thêm vào giỏ hàng');
            }
            if (order.isErrorOrder) {
                message.error('Sản phẩm đã hết hàng');
            }
            dispatch(resetOrder());
            setTriggerAdd(false);
        }
    }, [order.isSuccessOrder, order.isErrorOrder, triggerAdd]);


    const handleChangeCount = (type) => {
        if (type === 'increase') {
            setNumProduct(numProduct + 1)
        } else {
            setNumProduct(numProduct - 1)
        }
    }

    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location?.pathname })
        } else {
            // {
            //     name: {type: String, require: true},
            //     amount: {type: Number, require: true},
            //     image: {type: String, require: true},
            //     price: {type: Number, require: true},
            //     product: {
            //         type: mongoose.Schema.EventEmitter.Types.ObjectId,
            //         ref: 'Product',
            //         require: true,
            //     },
            // },
            const orderRedux = order.orderItems?.find((item) => item.product === productDetails?._id)

            dispatch(addOrderProduct({
                orderItem: {
                    name: productDetails?.name,
                    amount: numProduct,
                    image: productDetails?.image,
                    price: productDetails?.price,
                    product: productDetails?._id,
                    discount: productDetails?.discount,
                    countInStock: productDetails?.countInStock
                }
            }))
            setTriggerAdd(true);
        }
    }

    const { isLoading, data: productDetails }
        = useQuery(['products-details', idProduct],
            fetchGetDetailsProduct, { enabled: !!idProduct })

    return (
        <Loading isLoading={isLoading}>
            <Row style={{ padding: '16px', background: '#fff', borderRadius: '4px' }}>
                <Col span={10} style={{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
                    <Image src={productDetails?.image} alt="image product" preview={false} />
                    <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>
                        <WrapperStyleColImage span={4}>
                            <WrapperStyleImageSmall src={imageProductSmall} alt="image small" preview={false} />
                        </WrapperStyleColImage>

                    </Row>
                </Col>
                <Col span={14} style={{ paddingLeft: '10px' }}>
                    <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
                    <div>
                        <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
                        <WrapperStyleTextSell> | Da ban 1000+</WrapperStyleTextSell>
                    </div>
                    <WrapperPriceProduct>
                        <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
                    </WrapperPriceProduct>
                    <WrapperAddressProduct>
                        <span> Giao đến </span>
                        <span className='address'> {user?.address} </span> -
                        <span className='change-address'> Đổi địa chỉ </span>
                    </WrapperAddressProduct>
                    <LikeButtonComponent
                        dataHref={process.env.REACT_APP_IS_LOCAL ?
                            "https://developers.facebook.com/docs/plugins/" : window.location.href
                        } />
                    <div style={{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
                        <div style={{ marginBottom: '10px' }}> Số lượng </div>
                        <WrapperQualityProduct>
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease')}>
                                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                            <WrapperInputNumber onChange={onChange} defaultValue={1} max={productDetails?.countInStock} min={1} value={numProduct} size='small' />
                            <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase')}>
                                <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
                            </button>
                        </WrapperQualityProduct>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ButtonComponent
                            size={40}
                            styleButton={{
                                background: 'rgb(255,57,69)',
                                height: '48px',
                                width: '220px',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                            onClick={handleAddOrderProduct}
                            textbutton={'Chọn mua'}
                            styletextbutton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}>
                        </ButtonComponent>
                        <ButtonComponent

                            size={40}
                            styleButton={{
                                background: '#fff',
                                height: '48px',
                                width: '220px',
                                border: '1px solid rgb(13,92,182)',
                                borderRadius: '4px'
                            }}
                            textbutton={'Mua trả sau'}
                            styletextbutton={{ color: 'rgb(13,92,182)', fontSize: '15px' }}>
                        </ButtonComponent>
                    </div>
                </Col>
                <CommentComponent dataHref={
                    process.env.REACT_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/comments#configurator"
                        : window.location.href
                }
                    width='1270' />
            </Row>
        </Loading>

    )
}

export default ProductDetailsComponent