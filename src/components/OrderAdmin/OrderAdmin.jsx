import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { WrapperHeader, } from './style'
import { Button, Space } from 'antd'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import * as OrderService from '../../services/OrderService';
import { orderContant } from '../../contant'
import PieChartComponent from './PieChart'
import { convertPrice } from '../../utils'



const OrderAdmin = () => {
    const user = useSelector((state) => state?.user);

    const getAllOrder = async () => OrderService.getAllOrder(user?.access_token);
    const queryOrder = useQuery({ queryKey: ['orders'], queryFn: getAllOrder })
    const { isLoading: isLoadingOrders, data: orders } = queryOrder

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    //ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={`${selectedKeys[0] || ''}`}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    //onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        //onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        //onClick={() => clearFilters && handleReset(clearFilters)}
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
                //setTimeout(() => searchInput.current?.select(), 100);
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
            title: 'User Name',
            dataIndex: 'userName',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.name.length - b.name.length, ...getColumnSearchProps('userName')
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.phone.length - b.phone.length, ...getColumnSearchProps('phone')
        },
        {
            title: 'Address',
            dataIndex: 'address',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.address.length - b.address.length, ...getColumnSearchProps('address')
        },
        {
            title: 'Paided',
            dataIndex: 'isPaid',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.isPaid.length - b.isPaid.length, ...getColumnSearchProps('isPaid')
        },
        {
            title: 'Shipped',
            dataIndex: 'isDelivered',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.isDelivered.length - b.isDelivered.length, ...getColumnSearchProps('isDelivered')
        },
        {
            title: 'Payment method',
            dataIndex: 'paymentMethod',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length, ...getColumnSearchProps('paymentMethod')
        },
        {
            title: 'Price Total',
            dataIndex: 'totalPrice',
            render: (text) => <a>{text}</a>,
            sorter: (a, b) => a.totalPrice.length - b.totalPrice.length, ...getColumnSearchProps('totalPrice')
        },

    ]
    const dataTable = Array.isArray(orders?.data) ? orders.data.map((order) => ({
        ...order, key: order._id, userName: order?.shippingAddress?.fullName,
        phone: order?.shippingAddress?.phone, address: order?.shippingAddress?.address,
        paymentMethod: orderContant.payment[order?.paymentMethod],
        isPaid: order?.isPaid ? 'TRUE' : 'FALSE', isDelivered: order?.isDelivered ? 'TRUE' : 'FALSE', totalPrice: convertPrice(order?.totalPrice)
    })) : [];

    return (
        <div>
            <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
            <div style={{ height: 200, width: 200 }}>
                <PieChartComponent data={orders?.data} />
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent
                    columns={columns}
                    isLoading={isLoadingOrders}
                    rowKey="key"
                    data={dataTable}
                />

            </div>
        </div>

    )
}

export default OrderAdmin