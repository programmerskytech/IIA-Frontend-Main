import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, message, Tag, Space, Tooltip } from 'antd';
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import axios from 'axios';

const { TextArea } = Input;

const CancellationApprovalPage = () => {
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState([]);
    const [approvalModalVisible, setApprovalModalVisible] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [approvalAction, setApprovalAction] = useState(null); // 'APPROVED' or 'REJECTED'
    const [form] = Form.useForm();
    const { userId, userName } = useSelector((state) => state.auth);

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/indents/cancellation/pending');

            if (data.success || data.responseData) {
                setRequests(data.responseData || data.data || []);
            } else {
                message.warning('No pending cancellation requests found');
                setRequests([]);
            }
        } catch (error) {
            console.error('Error fetching pending requests:', error);
            message.error('Failed to fetch pending cancellation requests');
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveReject = (record, action) => {
        setSelectedRequest(record);
        setApprovalAction(action);
        setApprovalModalVisible(true);
        form.resetFields();
    };

    const handleSubmitApproval = async () => {
        try {
            const values = await form.validateFields();

            const payload = {
                requestId: selectedRequest.id,
                approvedBy: userId,
                approvedByName: userName,
                approvalStatus: approvalAction,
                approvalRemarks: values.approvalRemarks || '',
            };

            const { data } = await axios.post('/api/indents/cancellation/approve', payload);

            if (data.success || data.responseData) {
                message.success(
                    data.responseData ||
                        data.data ||
                        `Cancellation request ${approvalAction.toLowerCase()} successfully`
                );
                setApprovalModalVisible(false);
                form.resetFields();
                fetchPendingRequests(); // Refresh the list
            } else {
                throw new Error(data.message || 'Failed to process approval');
            }
        } catch (error) {
            console.error('Error processing approval:', error);
            const errorMessage =
                error.response?.data?.responseStatus?.message ||
                error.response?.data?.message ||
                error.message ||
                'Failed to process approval';
            message.error(errorMessage);
        }
    };

    const columns = [
        {
            title: 'Request ID',
            dataIndex: 'id',
            key: 'id',
            width: 100,
        },
        {
            title: 'Indent ID',
            dataIndex: 'indentId',
            key: 'indentId',
            width: 150,
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: 'Requested By',
            dataIndex: 'requestedByName',
            key: 'requestedByName',
            width: 150,
            render: (text, record) => (
                <div>
                    <div>{text}</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>ID: {record.requestedBy}</div>
                </div>
            ),
        },
        {
            title: 'Cancellation Reason',
            dataIndex: 'cancellationReason',
            key: 'cancellationReason',
            width: 300,
            render: (text) => (
                <Tooltip title={text}>
                    <div
                        style={{
                            maxWidth: '300px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {text}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'requestStatus',
            key: 'requestStatus',
            width: 100,
            render: (status) => {
                let color = 'orange';
                if (status === 'APPROVED') color = 'green';
                if (status === 'REJECTED') color = 'red';
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Requested Date',
            dataIndex: 'createdDate',
            key: 'createdDate',
            width: 150,
            render: (date) =>
                date ? new Date(date).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                }) : '-',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 200,
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Approve Cancellation">
                        <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            onClick={() => handleApproveReject(record, 'APPROVED')}
                            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                        >
                            Approve
                        </Button>
                    </Tooltip>
                    <Tooltip title="Reject Cancellation">
                        <Button
                            danger
                            icon={<CloseCircleOutlined />}
                            onClick={() => handleApproveReject(record, 'REJECTED')}
                        >
                            Reject
                        </Button>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ExclamationCircleOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                            <span>Indent Cancellation Approval</span>
                        </div>
                        <Button type="primary" onClick={fetchPendingRequests} loading={loading}>
                            Refresh
                        </Button>
                    </div>
                }
            >
                <Table
                    columns={columns}
                    dataSource={requests}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} pending requests`,
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {approvalAction === 'APPROVED' ? (
                            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
                        ) : (
                            <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '20px' }} />
                        )}
                        <span>{approvalAction === 'APPROVED' ? 'Approve' : 'Reject'} Cancellation Request</span>
                    </div>
                }
                open={approvalModalVisible}
                onCancel={() => {
                    setApprovalModalVisible(false);
                    form.resetFields();
                }}
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            setApprovalModalVisible(false);
                            form.resetFields();
                        }}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        danger={approvalAction === 'REJECTED'}
                        style={
                            approvalAction === 'APPROVED'
                                ? { backgroundColor: '#52c41a', borderColor: '#52c41a' }
                                : {}
                        }
                        onClick={handleSubmitApproval}
                    >
                        {approvalAction === 'APPROVED' ? 'Approve' : 'Reject'}
                    </Button>,
                ]}
                width={700}
                centered
            >
                {selectedRequest && (
                    <div>
                        <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f0f2f5' }}>
                            <div style={{ marginBottom: 8 }}>
                                <strong>Indent ID:</strong> {selectedRequest.indentId}
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <strong>Requested By:</strong> {selectedRequest.requestedByName} (ID:{' '}
                                {selectedRequest.requestedBy})
                            </div>
                            <div style={{ marginBottom: 8 }}>
                                <strong>Requested Date:</strong>{' '}
                                {selectedRequest.createdDate
                                    ? new Date(selectedRequest.createdDate).toLocaleString('en-IN')
                                    : '-'}
                            </div>
                            <div>
                                <strong>Cancellation Reason:</strong>
                                <div
                                    style={{
                                        marginTop: 8,
                                        padding: '8px 12px',
                                        backgroundColor: '#fff',
                                        border: '1px solid #d9d9d9',
                                        borderRadius: '4px',
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {selectedRequest.cancellationReason}
                                </div>
                            </div>
                        </Card>

                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="approvalRemarks"
                                label="Approval Remarks"
                                rules={
                                    approvalAction === 'REJECTED'
                                        ? [
                                              {
                                                  required: true,
                                                  message: 'Remarks are required when rejecting a request',
                                              },
                                              {
                                                  min: 10,
                                                  message: 'Remarks must be at least 10 characters',
                                              },
                                          ]
                                        : []
                                }
                            >
                                <TextArea
                                    rows={4}
                                    placeholder={
                                        approvalAction === 'APPROVED'
                                            ? 'Enter approval remarks (optional)'
                                            : 'Enter rejection reason (required - minimum 10 characters)'
                                    }
                                    showCount
                                    maxLength={500}
                                />
                            </Form.Item>
                        </Form>

                        {approvalAction === 'APPROVED' && (
                            <div
                                style={{
                                    padding: '12px',
                                    backgroundColor: '#f6ffed',
                                    border: '1px solid #b7eb8f',
                                    borderRadius: '4px',
                                    marginTop: 16,
                                }}
                            >
                                <div style={{ color: '#52c41a', fontWeight: 500, marginBottom: 4 }}>
                                    <CheckCircleOutlined /> Approval Confirmation
                                </div>
                                <div style={{ fontSize: '13px', color: '#595959' }}>
                                    By approving this request, Indent <strong>{selectedRequest.indentId}</strong>{' '}
                                    will be marked as cancelled. This action cannot be undone.
                                </div>
                            </div>
                        )}

                        {approvalAction === 'REJECTED' && (
                            <div
                                style={{
                                    padding: '12px',
                                    backgroundColor: '#fff2e8',
                                    border: '1px solid #ffbb96',
                                    borderRadius: '4px',
                                    marginTop: 16,
                                }}
                            >
                                <div style={{ color: '#ff4d4f', fontWeight: 500, marginBottom: 4 }}>
                                    <CloseCircleOutlined /> Rejection Confirmation
                                </div>
                                <div style={{ fontSize: '13px', color: '#595959' }}>
                                    By rejecting this request, the user will be notified and the indent will NOT
                                    be cancelled. Please provide a clear reason for rejection.
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CancellationApprovalPage;
