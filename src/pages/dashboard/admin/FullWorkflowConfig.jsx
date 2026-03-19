import React, { useState, useEffect } from 'react';
import {
  Card, Tabs, Table, Tag, Typography, Space, Spin, Row, Col,
  Statistic, Alert, Button, Collapse, Descriptions, message
} from 'antd';
import {
  ReloadOutlined, CheckCircleOutlined, CloseCircleOutlined,
  DollarOutlined, TeamOutlined, EnvironmentOutlined,
  ProjectOutlined, SettingOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import { WorkflowConfigService, formatCurrency } from '../../../services/approvalWorkflowService';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const FullWorkflowConfig = () => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    fetchFullConfig();
  }, []);

  const fetchFullConfig = async () => {
    setLoading(true);
    try {
      const response = await WorkflowConfigService.getFullConfig();
      const data = response.data?.responseData || response.data?.data || response.data;
      setConfig(data);
    } catch (error) {
      console.error('Error fetching full config:', error);
      message.error('Failed to fetch workflow configuration');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" tip="Loading workflow configuration..." />
      </div>
    );
  }

  if (!config) {
    return (
      <Card>
        <Alert
          message="No Configuration Found"
          description="Unable to load workflow configuration. Please try refreshing."
          type="warning"
          showIcon
          action={
            <Button onClick={fetchFullConfig} icon={<ReloadOutlined />}>
              Retry
            </Button>
          }
        />
      </Card>
    );
  }

  // Approval Limits Table Columns
  const approvalLimitsColumns = [
    {
      title: 'Role',
      dataIndex: 'roleName',
      key: 'roleName',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        const colorMap = {
          'COMPUTER': 'cyan',
          'NON_COMPUTER': 'orange',
          'PROJECT': 'purple',
          'ALL': 'green'
        };
        return <Tag color={colorMap[category]}>{category?.replace('_', ' ')}</Tag>;
      }
    },
    {
      title: 'Department',
      dataIndex: 'departmentName',
      key: 'departmentName',
      render: (text) => text || <Text type="secondary">All</Text>
    },
    {
      title: 'Min Amount',
      dataIndex: 'minAmount',
      key: 'minAmount',
      align: 'right',
      render: (amount) => formatCurrency(amount)
    },
    {
      title: 'Max Amount',
      dataIndex: 'maxAmount',
      key: 'maxAmount',
      align: 'right',
      render: (amount) => amount ? formatCurrency(amount) : <Text type="secondary">Unlimited</Text>
    },
    {
      title: 'Escalation To',
      dataIndex: 'escalationRoleName',
      key: 'escalationRoleName',
      render: (text) => text ? <Tag color="red">{text}</Tag> : '-'
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      )
    }
  ];

  // Department Approvers Table Columns
  const departmentApproversColumns = [
    {
      title: 'Department',
      dataIndex: 'departmentName',
      key: 'departmentName'
    },
    {
      title: 'Approver Type',
      dataIndex: 'approverType',
      key: 'approverType',
      render: (type) => (
        <Tag color={type === 'DEAN' ? 'purple' : 'blue'}>
          {type === 'DEAN' ? 'Dean' : 'Head SEG'}
        </Tag>
      )
    },
    {
      title: 'Approver Name',
      dataIndex: 'approverEmployeeName',
      key: 'approverEmployeeName'
    },
    {
      title: 'Approval Limit',
      dataIndex: 'approvalLimit',
      key: 'approvalLimit',
      align: 'right',
      render: (amount) => formatCurrency(amount)
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      )
    }
  ];

  // Field Station Approvers Table Columns
  const fieldStationColumns = [
    {
      title: 'Field Station',
      dataIndex: 'fieldStationName',
      key: 'fieldStationName',
      render: (text) => (
        <Space>
          <EnvironmentOutlined />
          {text}
        </Space>
      )
    },
    {
      title: 'In-Charge Type',
      dataIndex: 'inchargeType',
      key: 'inchargeType',
      render: (type) => (
        <Tag color={type === 'ENGINEER_INCHARGE' ? 'blue' : 'purple'}>
          {type === 'ENGINEER_INCHARGE' ? 'Engineer In-Charge' : 'Professor In-Charge'}
        </Tag>
      )
    },
    {
      title: 'In-Charge Name',
      dataIndex: 'inchargeEmployeeName',
      key: 'inchargeEmployeeName'
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active) => (
        <Tag color={active ? 'green' : 'red'}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      )
    }
  ];

  const approvalLimits = config.approvalLimits || [];
  const departmentApprovers = config.departmentApproverMappings || [];
  const fieldStationApprovers = config.fieldStationApprovers || [];

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <div>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Approval Limits Configured"
                  value={approvalLimits.length}
                  prefix={<DollarOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Department Approvers"
                  value={departmentApprovers.length}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Field Station In-Charges"
                  value={fieldStationApprovers.length}
                  prefix={<EnvironmentOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Collapse defaultActiveKey={['workflow']} style={{ marginTop: '24px' }}>
            <Panel
              header={
                <Space>
                  <ProjectOutlined />
                  <span>Project Workflow</span>
                </Space>
              }
              key="workflow-project"
            >
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="Route">
                  Indentor → Reporting Officer → Project Head → [Director if exceeds budget]
                </Descriptions.Item>
                <Descriptions.Item label="Approval Limit">
                  Based on available project budget
                </Descriptions.Item>
                <Descriptions.Item label="Escalation">
                  To Director when indent exceeds available project limit
                </Descriptions.Item>
              </Descriptions>
            </Panel>

            <Panel
              header={
                <Space>
                  <SettingOutlined />
                  <span>Computer Category Workflow</span>
                </Space>
              }
              key="workflow-computer"
            >
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="Route (Bangalore)">
                  Indentor → Reporting Officer → Computer Committee Chairman → Administrative Officer → [Director if exceeds limit]
                </Descriptions.Item>
                <Descriptions.Item label="Route (Field Station)">
                  Indentor → Reporting Officer → Computer Committee Chairman → Engineer/Professor In-Charge → Administrative Officer → [Director if exceeds limit]
                </Descriptions.Item>
              </Descriptions>
            </Panel>

            <Panel
              header={
                <Space>
                  <TeamOutlined />
                  <span>Non-Computer Category Workflow</span>
                </Space>
              }
              key="workflow-non-computer"
            >
              <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="Route (Bangalore, ≤₹50,000)">
                  Indentor → Reporting Officer → Administrative Officer → Purchase Head
                </Descriptions.Item>
                <Descriptions.Item label="Route (Bangalore, >₹50,000)">
                  Indentor → Reporting Officer → Administrative Officer → Dean/Head SEG → [Director if exceeds limit]
                </Descriptions.Item>
                <Descriptions.Item label="Route (Field Station)">
                  Indentor → Reporting Officer → Engineer/Professor In-Charge → Administrative Officer → [Purchase Head OR Dean/Head SEG] → [Director]
                </Descriptions.Item>
                <Descriptions.Item label="Key Thresholds">
                  <Space direction="vertical" size="small">
                    <Tag color="blue">Purchase Head: Up to ₹50,000</Tag>
                    <Tag color="purple">Head SEG: Up to ₹1,00,000</Tag>
                    <Tag color="magenta">Dean: Up to ₹1,50,000</Tag>
                    <Tag color="red">Director: Final Authority (Unlimited)</Tag>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Panel>
          </Collapse>
        </div>
      )
    },
    {
      key: 'approval-limits',
      label: `Approval Limits (${approvalLimits.length})`,
      children: (
        <Table
          columns={approvalLimitsColumns}
          dataSource={approvalLimits}
          rowKey="limitId"
          pagination={{ pageSize: 10 }}
          size="small"
        />
      )
    },
    {
      key: 'department-approvers',
      label: `Department Approvers (${departmentApprovers.length})`,
      children: (
        <Table
          columns={departmentApproversColumns}
          dataSource={departmentApprovers}
          rowKey="mappingId"
          pagination={{ pageSize: 10 }}
          size="small"
        />
      )
    },
    {
      key: 'field-stations',
      label: `Field Stations (${fieldStationApprovers.length})`,
      children: (
        <Table
          columns={fieldStationColumns}
          dataSource={fieldStationApprovers}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          size="small"
        />
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <SettingOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
            <span>Full Workflow Configuration</span>
          </Space>
        }
        extra={
          <Button icon={<ReloadOutlined />} onClick={fetchFullConfig} loading={loading}>
            Refresh
          </Button>
        }
      >
        <Alert
          message="Dynamic Indent Approval Workflow Configuration"
          description="This page shows the complete configuration for the dynamic approval workflow system. Changes can be made from the individual configuration pages."
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          style={{ marginBottom: '24px' }}
        />

        <Tabs items={tabItems} />
      </Card>
    </div>
  );
};

export default FullWorkflowConfig;
