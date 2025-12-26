import React, { useState, useEffect } from 'react';
import { Modal, Table, Spin, message, Empty, Button } from 'antd';
import { HistoryOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';

const PurchaseHistoryModal = ({ open, onClose, materialCode, materialDescription }) => {
    const [loading, setLoading] = useState(false);
    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        if (open && materialCode) {
            fetchPurchaseHistory();
        }
    }, [open, materialCode]);

    const fetchPurchaseHistory = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/indents/material/purchase-history/${materialCode}`);

            if (data.success) {
                setHistoryData(data.data || []);
                if (data.data.length === 0) {
                    message.info('No purchase history found for this material');
                }
            } else {
                message.error(data.message || 'Failed to fetch purchase history');
                setHistoryData([]);
            }
        } catch (error) {
            console.error('Error fetching purchase history:', error);
            if (error.response?.status === 404) {
                message.info('No purchase history found for this material');
            } else {
                message.error('Failed to fetch purchase history');
            }
            setHistoryData([]);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'PO ID',
            dataIndex: 'poId',
            key: 'poId',
            width: 120,
            fixed: 'left',
        },
        {
            title: 'Indent ID',
            dataIndex: 'indentId',
            key: 'indentId',
            width: 120,
        },
        {
            title: 'Vendor',
            dataIndex: 'vendorName',
            key: 'vendorName',
            width: 200,
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: '500' }}>{text}</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>ID: {record.vendorId}</div>
                </div>
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 100,
            align: 'right',
            render: (qty) => qty?.toLocaleString() || '-',
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
            width: 120,
            align: 'right',
            render: (rate) => rate ? `₹${Number(rate).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-',
        },
        {
            title: 'Currency',
            dataIndex: 'currency',
            key: 'currency',
            width: 100,
            align: 'center',
        },
        {
            title: 'Exchange Rate',
            dataIndex: 'exchangeRate',
            key: 'exchangeRate',
            width: 120,
            align: 'right',
            render: (rate) => rate || '-',
        },
        {
            title: 'GST (%)',
            dataIndex: 'gst',
            key: 'gst',
            width: 100,
            align: 'right',
            render: (gst) => gst ? `${gst}%` : '-',
        },
        {
            title: 'Total (INR)',
            dataIndex: 'totalPoMaterialPriceInInr',
            key: 'total',
            width: 150,
            align: 'right',
            render: (total) => total ? `₹${Number(total).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-',
        },
        {
            title: 'Date',
            dataIndex: 'createdDate',
            key: 'date',
            width: 120,
            render: (date) => date ? new Date(date).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }) : '-',
        },
    ];

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HistoryOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: '600' }}>Purchase History</div>
                        <div style={{ fontSize: '13px', fontWeight: 'normal', color: '#8c8c8c', marginTop: '4px' }}>
                            {materialCode} - {materialDescription}
                        </div>
                    </div>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="close" type="primary" onClick={onClose}>
                    Close
                </Button>
            ]}
            width={1400}
            centered
            closeIcon={<CloseOutlined />}
            styles={{ body: { padding: '20px' } }}
        >
            <Spin spinning={loading} tip="Loading purchase history...">
                {historyData.length > 0 ? (
                    <Table
                        columns={columns}
                        dataSource={historyData}
                        rowKey={(record) => `${record.poId}-${record.createdDate}`}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} records`,
                            pageSizeOptions: ['10', '20', '50'],
                        }}
                        scroll={{ x: 1200 }}
                        size="small"
                        bordered
                    />
                ) : (
                    !loading && (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description="No purchase history found for this material"
                            style={{ margin: '60px 0' }}
                        />
                    )
                )}
            </Spin>
        </Modal>
    );
};

export default PurchaseHistoryModal;
