import React, { useState, useEffect } from 'react';
import { Card, Spin, Alert, Statistic, Row, Col, Progress } from 'antd';
import { DollarOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import axios from 'axios';

const ProjectBudgetDisplay = ({ projectCode, indentAmount }) => {
    const [loading, setLoading] = useState(false);
    const [budgetData, setbudgetData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (projectCode) {
            fetchProjectBudget();
        }
    }, [projectCode]);

    const fetchProjectBudget = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.get(`/api/project-master/${projectCode}/available-budget`);

            if (data.success || data.responseData) {
                setbudgetData(data.responseData || data.data);
            } else {
                setError('Failed to fetch budget data');
            }
        } catch (err) {
            console.error('Error fetching project budget:', err);
            setError(err.response?.data?.message || 'Failed to fetch project budget');
        } finally {
            setLoading(false);
        }
    };

    if (!projectCode) {
        return null;
    }

    if (loading) {
        return (
            <Card style={{ marginBottom: 16 }}>
                <Spin tip="Loading project budget..." />
            </Card>
        );
    }

    if (error) {
        return (
            <Alert
                message="Budget Information"
                description={error}
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
            />
        );
    }

    if (!budgetData) {
        return null;
    }

    const allocatedAmount = Number(budgetData.allocatedAmount || 0);
    const availableLimit = Number(budgetData.availableProjectLimit || 0);
    const usedAmount = allocatedAmount - availableLimit;
    const currentIndent = Number(indentAmount || 0);

    // Calculate if budget is sufficient
    const isSufficient = availableLimit >= currentIndent;
    const percentUsed = allocatedAmount > 0 ? ((usedAmount / allocatedAmount) * 100).toFixed(2) : 0;
    const percentAvailable = allocatedAmount > 0 ? ((availableLimit / allocatedAmount) * 100).toFixed(2) : 0;

    return (
        <Card
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarOutlined style={{ fontSize: '20px' }} />
                    <span>Project Budget Status: {budgetData.projectNameDescription}</span>
                </div>
            }
            style={{ marginBottom: 16 }}
            headStyle={{ backgroundColor: '#f0f2f5' }}
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                    <Statistic
                        title="Total Allocated Budget"
                        value={allocatedAmount}
                        precision={2}
                        prefix="₹"
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Col>
                <Col xs={24} sm={8}>
                    <Statistic
                        title="Budget Used (POs Created)"
                        value={usedAmount}
                        precision={2}
                        prefix="₹"
                        valueStyle={{ color: '#cf1322' }}
                        suffix={
                            <span style={{ fontSize: '14px', color: '#8c8c8c' }}>
                                ({percentUsed}%)
                            </span>
                        }
                    />
                </Col>
                <Col xs={24} sm={8}>
                    <Statistic
                        title="Available Budget"
                        value={availableLimit}
                        precision={2}
                        prefix="₹"
                        valueStyle={{ color: isSufficient ? '#3f8600' : '#cf1322' }}
                        suffix={
                            <span style={{ fontSize: '14px', color: '#8c8c8c' }}>
                                ({percentAvailable}%)
                            </span>
                        }
                    />
                </Col>
            </Row>

            <div style={{ marginTop: 16 }}>
                <div style={{ marginBottom: 8 }}>
                    <span style={{ fontWeight: 500 }}>Budget Utilization:</span>
                </div>
                <Progress
                    percent={Number(percentUsed)}
                    status={Number(percentUsed) > 90 ? 'exception' : 'active'}
                    strokeColor={{
                        '0%': '#108ee9',
                        '50%': '#87d068',
                        '100%': Number(percentUsed) > 90 ? '#ff4d4f' : '#52c41a',
                    }}
                />
            </div>

            {currentIndent > 0 && (
                <Alert
                    message={
                        isSufficient
                            ? 'Budget Sufficient for This Indent'
                            : 'Insufficient Budget for This Indent'
                    }
                    description={
                        <div>
                            <div>
                                <strong>Current Indent Amount:</strong> ₹
                                {currentIndent.toLocaleString('en-IN', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </div>
                            {!isSufficient && (
                                <div style={{ marginTop: 8, color: '#cf1322' }}>
                                    <strong>Budget Shortfall:</strong> ₹
                                    {(currentIndent - availableLimit).toLocaleString('en-IN', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </div>
                            )}
                        </div>
                    }
                    type={isSufficient ? 'success' : 'error'}
                    showIcon
                    icon={isSufficient ? <CheckCircleOutlined /> : <WarningOutlined />}
                    style={{ marginTop: 16 }}
                />
            )}

            <div style={{ marginTop: 16, fontSize: '12px', color: '#8c8c8c' }}>
                <div><strong>Project Code:</strong> {budgetData.projectCode}</div>
                <div><strong>Budget Type:</strong> {budgetData.budgetType}</div>
                <div><strong>Financial Year:</strong> {budgetData.financialYear}</div>
                {budgetData.projectHead && (
                    <div><strong>Project Head:</strong> {budgetData.projectHead}</div>
                )}
                <div>
                    <strong>Last Updated:</strong>{' '}
                    {budgetData.updatedDate
                        ? new Date(budgetData.updatedDate).toLocaleString('en-IN')
                        : 'N/A'}
                </div>
            </div>
        </Card>
    );
};

export default ProjectBudgetDisplay;
