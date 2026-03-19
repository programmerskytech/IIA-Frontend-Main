import React from 'react';
import { Steps, Tag, Typography, Card, Space, Alert, Tooltip } from 'antd';
import {
  UserOutlined, CheckCircleOutlined, ClockCircleOutlined,
  ExclamationCircleOutlined, ArrowRightOutlined, TeamOutlined,
  EnvironmentOutlined, DollarOutlined, ProjectOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;

/**
 * WorkflowDisplay Component
 * Shows the approval workflow chain based on indent classification
 *
 * Props:
 * - isUnderProject: boolean - Whether indent is under a project
 * - materialCategoryType: string - 'COMPUTER' or 'NON_COMPUTER'
 * - location: string - Consignee location
 * - indentValue: number - Total indent value
 * - currentStage: string - Current approval stage
 * - escalatedToDirector: boolean - Whether escalated to Director
 * - escalationReason: string - Reason for escalation
 */
const WorkflowDisplay = ({
  isUnderProject = false,
  materialCategoryType = 'NON_COMPUTER',
  location = 'BANGALORE',
  indentValue = 0,
  currentStage = 'INDENTOR',
  escalatedToDirector = false,
  escalationReason = null,
  approvalHistory = []
}) => {
  // Check if location is Bangalore
  const isBangalore = ['BANGALORE', 'Bangalore', 'bangalore', 'BENGALURU', 'Bengaluru'].includes(location);

  // Determine value-based routing for Non-Computer
  const isPurchaseHeadLevel = indentValue <= 50000;
  const isDeanHeadSEGLevel = indentValue > 50000 && indentValue <= 150000;
  const isDirectorLevel = indentValue > 150000;

  // Build workflow steps based on classification
  const getWorkflowSteps = () => {
    const steps = [];

    // Step 1: Indentor (always first)
    steps.push({
      title: 'Indentor',
      description: 'Creates indent',
      icon: <UserOutlined />,
      status: 'finish'
    });

    // Step 2: Reporting Officer (always second)
    steps.push({
      title: 'Reporting Officer',
      description: 'Reviews & determines project status',
      icon: <TeamOutlined />,
      status: currentStage === 'RO' ? 'process' : (approvalHistory.find(h => h.stage === 'RO') ? 'finish' : 'wait')
    });

    if (isUnderProject) {
      // PROJECT WORKFLOW
      steps.push({
        title: 'Project Head',
        description: 'Approves within project budget',
        icon: <ProjectOutlined />,
        status: currentStage === 'PROJECT_HEAD' ? 'process' : 'wait'
      });

      if (escalatedToDirector) {
        steps.push({
          title: 'Director',
          description: 'Final approval (exceeds budget)',
          icon: <CheckCircleOutlined />,
          status: currentStage === 'DIRECTOR' ? 'process' : 'wait'
        });
      }
    } else if (materialCategoryType === 'COMPUTER') {
      // COMPUTER CATEGORY WORKFLOW
      steps.push({
        title: 'Computer Committee Chairman',
        description: 'Technical review',
        icon: <TeamOutlined />,
        status: currentStage === 'COMPUTER_COMMITTEE' ? 'process' : 'wait'
      });

      if (!isBangalore) {
        steps.push({
          title: 'Engineer/Professor In-Charge',
          description: 'Field station review',
          icon: <EnvironmentOutlined />,
          status: currentStage === 'FIELD_STATION' ? 'process' : 'wait'
        });
      }

      steps.push({
        title: 'Administrative Officer',
        description: 'Administrative approval',
        icon: <UserOutlined />,
        status: currentStage === 'AO' ? 'process' : 'wait'
      });

      if (escalatedToDirector) {
        steps.push({
          title: 'Director',
          description: 'Final approval',
          icon: <CheckCircleOutlined />,
          status: currentStage === 'DIRECTOR' ? 'process' : 'wait'
        });
      }
    } else {
      // NON-COMPUTER CATEGORY WORKFLOW
      if (!isBangalore) {
        steps.push({
          title: 'Engineer/Professor In-Charge',
          description: 'Field station review',
          icon: <EnvironmentOutlined />,
          status: currentStage === 'FIELD_STATION' ? 'process' : 'wait'
        });
      }

      steps.push({
        title: 'Administrative Officer',
        description: 'Administrative review',
        icon: <UserOutlined />,
        status: currentStage === 'AO' ? 'process' : 'wait'
      });

      if (isPurchaseHeadLevel) {
        steps.push({
          title: 'Purchase Head',
          description: 'Approves (≤ ₹50,000)',
          icon: <DollarOutlined />,
          status: currentStage === 'PURCHASE_HEAD' ? 'process' : 'wait'
        });
      } else {
        steps.push({
          title: 'Dean / Head SEG',
          description: isDeanHeadSEGLevel ? 'Approves (> ₹50,000)' : 'Reviews',
          icon: <TeamOutlined />,
          status: currentStage === 'DEAN' || currentStage === 'HEAD_SEG' ? 'process' : 'wait'
        });

        if (isDirectorLevel || escalatedToDirector) {
          steps.push({
            title: 'Director',
            description: 'Final approval (exceeds limit)',
            icon: <CheckCircleOutlined />,
            status: currentStage === 'DIRECTOR' ? 'process' : 'wait'
          });
        }
      }
    }

    return steps;
  };

  const workflowSteps = getWorkflowSteps();

  // Get workflow type label
  const getWorkflowTypeLabel = () => {
    if (isUnderProject) {
      return { label: 'Project Workflow', color: 'purple' };
    }
    if (materialCategoryType === 'COMPUTER') {
      return { label: 'Computer Category Workflow', color: 'cyan' };
    }
    return { label: 'Non-Computer Category Workflow', color: 'orange' };
  };

  const workflowType = getWorkflowTypeLabel();

  return (
    <Card
      size="small"
      title={
        <Space>
          <span>Approval Workflow</span>
          <Tag color={workflowType.color}>{workflowType.label}</Tag>
        </Space>
      }
      style={{ marginBottom: '16px' }}
    >
      {/* Workflow Classification Summary */}
      <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fafafa', borderRadius: '6px' }}>
        <Space wrap>
          <Tag icon={<ProjectOutlined />} color={isUnderProject ? 'purple' : 'default'}>
            {isUnderProject ? 'Under Project' : 'Non-Project'}
          </Tag>
          <Tag icon={<TeamOutlined />} color={materialCategoryType === 'COMPUTER' ? 'cyan' : 'orange'}>
            {materialCategoryType === 'COMPUTER' ? 'Computer' : 'Non-Computer'}
          </Tag>
          <Tag icon={<EnvironmentOutlined />} color={isBangalore ? 'green' : 'blue'}>
            {isBangalore ? 'Bangalore' : location || 'Field Station'}
          </Tag>
          <Tag icon={<DollarOutlined />}>
            Value: ₹{Number(indentValue).toLocaleString('en-IN')}
          </Tag>
        </Space>
      </div>

      {/* Escalation Alert */}
      {escalatedToDirector && (
        <Alert
          message="Escalated to Director"
          description={escalationReason || 'Amount exceeds approval limit'}
          type="warning"
          showIcon
          icon={<ExclamationCircleOutlined />}
          style={{ marginBottom: '16px' }}
        />
      )}

      {/* Workflow Steps */}
      <Steps
        current={workflowSteps.findIndex(s => s.status === 'process')}
        size="small"
        direction="horizontal"
        responsive
        items={workflowSteps.map((step, index) => ({
          title: step.title,
          description: (
            <Tooltip title={step.description}>
              <Text type="secondary" style={{ fontSize: '11px' }}>
                {step.description}
              </Text>
            </Tooltip>
          ),
          icon: step.icon,
          status: step.status
        }))}
      />

      {/* Workflow Path Description */}
      <div style={{ marginTop: '16px', padding: '8px', backgroundColor: '#f0f5ff', borderRadius: '4px' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          <strong>Workflow Path: </strong>
          {workflowSteps.map((step, index) => (
            <span key={index}>
              {step.title}
              {index < workflowSteps.length - 1 && <ArrowRightOutlined style={{ margin: '0 8px', color: '#1890ff' }} />}
            </span>
          ))}
        </Text>
      </div>
    </Card>
  );
};

/**
 * Mini Workflow Badge - Compact version for tables/lists
 */
export const WorkflowBadge = ({ isUnderProject, materialCategoryType, currentStage }) => {
  const getColor = () => {
    if (isUnderProject) return 'purple';
    if (materialCategoryType === 'COMPUTER') return 'cyan';
    return 'orange';
  };

  const getLabel = () => {
    if (isUnderProject) return 'Project';
    if (materialCategoryType === 'COMPUTER') return 'Computer';
    return 'Non-Computer';
  };

  return (
    <Space size="small">
      <Tag color={getColor()} size="small">{getLabel()}</Tag>
      {currentStage && (
        <Tag color="processing" size="small">{currentStage}</Tag>
      )}
    </Space>
  );
};

/**
 * Escalation Info Component - Shows escalation details
 */
export const EscalationInfo = ({ escalatedToDirector, escalationReason, amount, limit }) => {
  if (!escalatedToDirector) return null;

  return (
    <Alert
      message={
        <Space>
          <ExclamationCircleOutlined />
          <span>ESCALATED TO DIRECTOR</span>
        </Space>
      }
      description={
        <div>
          <Text>{escalationReason || 'Amount exceeds approval limit'}</Text>
          {amount && limit && (
            <div style={{ marginTop: '4px' }}>
              <Text type="secondary">
                Amount: ₹{Number(amount).toLocaleString('en-IN')} |
                Limit: ₹{Number(limit).toLocaleString('en-IN')}
              </Text>
            </div>
          )}
        </div>
      }
      type="warning"
      showIcon
      style={{ marginBottom: '16px' }}
    />
  );
};

export default WorkflowDisplay;
