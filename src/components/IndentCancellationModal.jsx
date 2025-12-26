import React, { useState } from 'react';
import { Modal, Form, Input, Button, message, Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;

const IndentCancellationModal = ({ open, onClose, indentId, requestedBy, requestedByName, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            setError(null);

            const payload = {
                indentId: indentId,
                requestedBy: requestedBy,
                requestedByName: requestedByName,
                cancellationReason: values.cancellationReason,
            };

            const { data } = await axios.post('/api/indents/cancellation/request', payload);

            if (data.success || data.responseData) {
                message.success(
                    data.responseData ||
                        data.data ||
                        'Cancellation request submitted successfully. Awaiting approval from Purchase Head.'
                );
                form.resetFields();
                onClose();
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                throw new Error(data.message || 'Failed to submit cancellation request');
            }
        } catch (err) {
            console.error('Error submitting cancellation request:', err);

            // Handle specific error messages from backend
            const errorMessage =
                err.response?.data?.responseStatus?.message ||
                err.response?.data?.message ||
                err.message ||
                'Failed to submit cancellation request';

            setError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setError(null);
        onClose();
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                    <span>Request Indent Cancellation</span>
                </div>
            }
            open={open}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel} disabled={loading}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    danger
                    loading={loading}
                    onClick={handleSubmit}
                >
                    Submit Cancellation Request
                </Button>,
            ]}
            width={600}
            centered
        >
            <Alert
                message="Important Notice"
                description={
                    <div>
                        <p>
                            You are requesting cancellation for Indent ID: <strong>{indentId}</strong>
                        </p>
                        <p>
                            This request will be sent to the Purchase Head/Personnel for approval. The indent
                            will only be cancelled after approval.
                        </p>
                        {error && error.includes('Purchase Order') && (
                            <p style={{ color: '#cf1322', marginTop: 8 }}>
                                <strong>Note:</strong> An active Purchase Order exists for this indent. You
                                must cancel the PO first before cancelling the indent.
                            </p>
                        )}
                        {error && error.includes('Tender') && (
                            <p style={{ color: '#cf1322', marginTop: 8 }}>
                                <strong>Note:</strong> An active Tender exists for this indent. You must
                                cancel the Tender first before cancelling the indent.
                            </p>
                        )}
                    </div>
                }
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
            />

            {error && (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setError(null)}
                    style={{ marginBottom: 16 }}
                />
            )}

            <Form form={form} layout="vertical">
                <Form.Item
                    name="cancellationReason"
                    label="Reason for Cancellation"
                    rules={[
                        {
                            required: true,
                            message: 'Please provide a reason for cancellation',
                        },
                        {
                            min: 10,
                            message: 'Reason must be at least 10 characters long',
                        },
                        {
                            max: 500,
                            message: 'Reason cannot exceed 500 characters',
                        },
                    ]}
                >
                    <TextArea
                        rows={6}
                        placeholder="Please provide a detailed reason for cancelling this indent (minimum 10 characters)&#10;&#10;Examples:&#10;- Project cancelled due to budget constraints&#10;- Duplicate indent created by mistake&#10;- Requirements changed, no longer needed&#10;- Vendor unavailable, alternative procurement needed"
                        showCount
                        maxLength={500}
                    />
                </Form.Item>

                <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: 8 }}>
                    <strong>Requested By:</strong> {requestedByName} (ID: {requestedBy})
                </div>
            </Form>
        </Modal>
    );
};

export default IndentCancellationModal;
