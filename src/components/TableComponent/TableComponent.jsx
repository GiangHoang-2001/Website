// TableComponent.jsx
import { Table } from 'antd';
import React, { useMemo } from 'react';
import Loading from '../LoadingComponent/Loading';
import { Excel } from "antd-table-saveas-excel";
import * as message from '../../components/Message/Message';
const TableComponent = (props) => {
    const {
        selectionType = 'checkbox',
        data: dataSource = [],
        isLoading = false,
        columns = [],
        handleDeleteMany,
        rowSelectedKeys = [],
        setRowSelectedKeys = () => { }
    } = props;
    const newColumnExport = useMemo(() => {
        const filtered = columns?.filter(
            (col) =>
                col &&
                typeof col.dataIndex === 'string' &&
                col.dataIndex !== 'action'
        );

        return filtered.map((col) => ({
            title: typeof col.title === 'string' ? col.title : col.dataIndex,
            dataIndex: col.dataIndex,

        }));
    }, [columns]);


    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setRowSelectedKeys(selectedRowKeys);
        }
    };

    const handleDeleteAll = () => {
        handleDeleteMany(rowSelectedKeys);
    };

    const exportExcel = () => {
        const cleanData = dataSource?.filter(Boolean);

        if (!Array.isArray(cleanData) || cleanData.length === 0) {
            message.warning("Không có dữ liệu để export");
            return;
        }

        const excel = new Excel();
        excel
            .addSheet("test")
            .addColumns(newColumnExport)
            .addDataSource(cleanData, {
                str2Percent: true,
            })
            .saveAs("Excel.xlsx");
    };



    return (
        <Loading isLoading={isLoading}>
            {rowSelectedKeys.length > 0 && (
                <div style={{
                    background: '#c62020',
                    color: '#ccc',
                    fontWeight: 'bold',
                    padding: '10px',
                    cursor: 'pointer'
                }}
                    onClick={handleDeleteAll}
                >
                    Xoá tất cả
                </div>
            )}
            <button onClick={exportExcel}>Export Excel</button>
            <Table
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={dataSource}
                {...props}
            />
        </Loading>
    );
};

export default TableComponent;
