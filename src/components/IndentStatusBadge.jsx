import React from 'react';
import { Tag, Tooltip } from 'antd';
import {
    EditOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    LeftOutlined,
    FileTextOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

/**
 * Status configuration with colors and icons
 */
const STATUS_CONFIG = {
    'DRAFT': {
        color: '#6B7280',
        icon: <EditOutlined />,
        label: 'Draft',
        description: 'Indent is being created'
    },
    'IN_APPROVAL': {
        color: '#3B82F6',
        icon: <ClockCircleOutlined />,
        label: 'In Approval',
        description: 'Indent is in approval workflow'
    },
    'APPROVED': {
        color: '#10B981',
        icon: <CheckCircleOutlined />,
        label: 'Approved',
        description: 'Indent fully approved'
    },
    'CHANGE_REQUESTED': {
        color: '#F59E0B',
        icon: <LeftOutlined />,
        label: 'Revision Required',
        description: 'Approver requested changes'
    },
    'TENDER_CREATED': {
        color: '#8B5CF6',
        icon: <FileTextOutlined />,
        label: 'Tender Created',
        description: 'Tender has been generated'
    },
    'CANCELLED': {
        color: '#EF4444',
        icon: <CloseCircleOutlined />,
        label: 'Cancelled',
        description: 'Indent cancelled'
    }
};

/**
 * IndentStatusBadge Component
 * Displays indent status with appropriate color, icon and tooltip
 *
 * @param {Object} indent - Indent object with status fields
 * @param {boolean} showStage - Whether to show current stage below status
 * @param {boolean} showApprovalLevel - Whether to show approval level
 */
const IndentStatusBadge = ({ indent, showStage = false, showApprovalLevel = false }) => {
    if (!indent || !indent.currentStatus) {
        return <Tag color="default">Unknown</Tag>;
    }

    const config = STATUS_CONFIG[indent.currentStatus] || {
        color: '#6B7280',
        icon: <EditOutlined />,
        label: indent.currentStatus,
        description: 'Status'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Tooltip title={config.description}>
                <Tag
                    color={config.color}
                    icon={config.icon}
                    style={{
                        fontSize: '13px',
                        padding: '4px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        width: 'fit-content'
                    }}
                >
                    {config.label}
                </Tag>
            </Tooltip>

            {showStage && indent.currentStage && (
                <div style={{ fontSize: '12px', color: '#6B7280' }}>
                    Stage: {indent.currentStage.replace(/_/g, ' ')}
                </div>
            )}

            {showApprovalLevel && indent.approvalLevel > 0 && (
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                    Approval Level: {indent.approvalLevel}
                </div>
            )}
        </div>
    );
};

export default IndentStatusBadge;
