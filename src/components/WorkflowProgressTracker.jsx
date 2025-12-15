import React from 'react';
import { Steps, Card } from 'antd';
import {
    EditOutlined,
    CheckCircleOutlined,
    FileDoneOutlined,
    FileTextOutlined
} from '@ant-design/icons';

const { Step } = Steps;

/**
 * WorkflowProgressTracker Component
 * Displays visual progress tracker for indent workflow stages
 *
 * @param {Object} indent - Indent object with workflow status fields
 * @param {boolean} compact - Whether to show compact version
 */
const WorkflowProgressTracker = ({ indent, compact = false }) => {
    if (!indent || !indent.currentStage) {
        return null;
    }

    // Define workflow stages
    const stages = [
        {
            key: 'INDENT_CREATION',
            title: 'Created',
            description: 'Indent created',
            icon: <EditOutlined />
        },
        {
            key: 'INDENT_APPROVAL',
            title: 'In Approval',
            description: 'Approval in progress',
            icon: <CheckCircleOutlined />
        },
        {
            key: 'INDENT_APPROVED',
            title: 'Approved',
            description: 'Fully approved',
            icon: <FileDoneOutlined />
        },
        {
            key: 'TENDER_GENERATION',
            title: 'Tender Created',
            description: 'Tender generated',
            icon: <FileTextOutlined />
        }
    ];

    // Determine current stage index
    const getCurrentStageIndex = () => {
        const currentStage = indent.currentStage || '';

        if (currentStage.includes('TENDER')) {
            return 3;
        } else if (currentStage === 'INDENT_APPROVED') {
            return 2;
        } else if (currentStage.includes('APPROVAL') || currentStage === 'INDENT_REVISION') {
            return 1;
        } else if (currentStage === 'INDENT_CREATION' || currentStage === 'DRAFT') {
            return 0;
        }

        return 0;
    };

    const currentStageIndex = getCurrentStageIndex();

    // Determine status for each step
    const getStepStatus = (index) => {
        if (index < currentStageIndex) {
            return 'finish';
        } else if (index === currentStageIndex) {
            // Check if in revision mode
            if (indent.currentStage === 'INDENT_REVISION' || indent.currentStatus === 'CHANGE_REQUESTED') {
                return 'error';
            }
            return 'process';
        } else {
            return 'wait';
        }
    };

    if (compact) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 0'
            }}>
                {stages.map((stage, index) => {
                    const status = getStepStatus(index);
                    const isActive = index === currentStageIndex;

                    return (
                        <div
                            key={stage.key}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: status === 'finish' ? '#10B981' :
                                        status === 'process' ? '#3B82F6' :
                                            status === 'error' ? '#F59E0B' : '#E5E7EB',
                                    color: status !== 'wait' ? 'white' : '#6B7280',
                                    fontSize: '14px',
                                    fontWeight: isActive ? 'bold' : 'normal'
                                }}
                            >
                                {stage.icon}
                            </div>
                            {index < stages.length - 1 && (
                                <div
                                    style={{
                                        width: '40px',
                                        height: '2px',
                                        backgroundColor: status === 'finish' ? '#10B981' : '#E5E7EB'
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <Card
            title="Workflow Progress"
            size="small"
            style={{ marginBottom: '16px' }}
        >
            <Steps current={currentStageIndex} size="small">
                {stages.map((stage, index) => (
                    <Step
                        key={stage.key}
                        title={stage.title}
                        description={stage.description}
                        status={getStepStatus(index)}
                        icon={stage.icon}
                    />
                ))}
            </Steps>

            {indent.currentStage === 'INDENT_REVISION' && (
                <div
                    style={{
                        marginTop: '12px',
                        padding: '8px 12px',
                        backgroundColor: '#FEF3C7',
                        borderLeft: '3px solid #F59E0B',
                        borderRadius: '4px',
                        fontSize: '13px',
                        color: '#92400E'
                    }}
                >
                    This indent has been sent back for revision
                </div>
            )}

            {indent.approvalLevel > 0 && indent.currentStatus === 'IN_APPROVAL' && (
                <div
                    style={{
                        marginTop: '12px',
                        fontSize: '12px',
                        color: '#6B7280'
                    }}
                >
                    Currently at approval level: <strong>{indent.approvalLevel}</strong>
                </div>
            )}
        </Card>
    );
};

export default WorkflowProgressTracker;
