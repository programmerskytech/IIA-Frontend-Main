import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Table, Space, message, Modal, Form, Tag, Popconfirm, Select, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

const ProjectManagement = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/project-master');
      if (response.data.responseData) {
        setProjects(response.data.responseData);
      }
    } catch (error) {
      message.error('Failed to fetch projects');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingProject(null);
    form.resetFields();
    form.setFieldsValue({ status: 'Active' });
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingProject(record);
    form.setFieldsValue({
      projectCode: record.projectCode,
      projectNameDescription: record.projectNameDescription,
      projectHead: record.projectHead,
      departmentDivision: record.departmentDivision,
      budgetType: record.budgetType,
      category: record.category,
      allocatedAmount: record.allocatedAmount,
      availableProjectLimit: record.availableProjectLimit,
      startDate: record.startDate ? dayjs(record.startDate) : null,
      endDate: record.endDate ? dayjs(record.endDate) : null,
      status: record.status || 'Active'
    });
    setModalVisible(true);
  };

  const handleDelete = async (projectCode) => {
    try {
      await axios.delete(`/api/project-master/${projectCode}`);
      message.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const payload = {
        projectCode: values.projectCode,
        projectNameDescription: values.projectNameDescription,
        projectHead: values.projectHead,
        departmentDivision: values.departmentDivision,
        budgetType: values.budgetType,
        category: values.category,
        allocatedAmount: parseFloat(values.allocatedAmount),
        availableProjectLimit: parseFloat(values.availableProjectLimit || values.allocatedAmount),
        startDate: values.startDate ? values.startDate.format('YYYY-MM-DD') : null,
        endDate: values.endDate ? values.endDate.format('YYYY-MM-DD') : null,
        status: values.status,
        financialYear: values.startDate ? values.startDate.format('YYYY') : new Date().getFullYear().toString(),
        createdBy: 'admin' // Replace with actual user from auth state
      };

      if (editingProject) {
        await axios.put(`/api/project-master/${editingProject.projectCode}`, payload);
        message.success('Project updated successfully');
      } else {
        await axios.post('/api/project-master', payload);
        message.success('Project created successfully');
      }

      setModalVisible(false);
      form.resetFields();
      fetchProjects();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to save project');
    }
  };

  const filteredProjects = projects.filter(
    (item) =>
      item.projectCode?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.projectNameDescription?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.projectHead?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'projectNameDescription',
      key: 'projectNameDescription',
      width: 250
    },
    {
      title: 'Budget Code',
      dataIndex: 'projectCode',
      key: 'projectCode',
      width: 150
    },
    {
      title: 'Manager',
      dataIndex: 'projectHead',
      key: 'projectHead',
      width: 150
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      render: (date) => date ? dayjs(date).format('YYYY-MM-DD') : '-'
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: (date) => date ? dayjs(date).format('YYYY-MM-DD') : '-'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const color = status === 'Active' ? 'green' : status === 'Completed' ? 'blue' : 'gray';
        return <Tag color={color}>{status || 'Active'}</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this project?"
            onConfirm={() => handleDelete(record.projectCode)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Projects" bordered={false}>
        {/* Search and Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <Input
            placeholder="Search projects by name, budget code, or manager..."
            prefix={<SearchOutlined />}
            style={{ width: '400px' }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchProjects}>
              Refresh
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
              Add New Project
            </Button>
          </Space>
        </div>

        {/* Results Count */}
        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontWeight: 500 }}>Showing {filteredProjects.length} projects</span>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filteredProjects}
          rowKey="projectCode"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item
              label="Project Name"
              name="projectNameDescription"
              rules={[{ required: true, message: 'Please enter project name' }]}
            >
              <Input placeholder="Enter project name" />
            </Form.Item>

            <Form.Item
              label="Budget Code"
              name="projectCode"
              rules={[{ required: true, message: 'Please enter budget code' }]}
            >
              <Input placeholder="Enter budget code" disabled={!!editingProject} />
            </Form.Item>

            <Form.Item
              label="Project Manager"
              name="projectHead"
              rules={[{ required: true, message: 'Please enter manager name' }]}
            >
              <Input placeholder="Enter manager name" />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select>
                <Option value="Active">Active</Option>
                <Option value="Completed">Completed</Option>
                <Option value="Closed">Closed</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: 'Please select start date' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
            </Form.Item>

            <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true, message: 'Please select end date' }]}
            >
              <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
            </Form.Item>

            <Form.Item label="Department/Division" name="departmentDivision">
              <Input placeholder="Enter department" />
            </Form.Item>

            <Form.Item label="Budget Type" name="budgetType">
              <Select placeholder="Select budget type">
                <Option value="Capital">Capital</Option>
                <Option value="Operational">Operational</Option>
                <Option value="Consumable">Consumable</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Category" name="category">
              <Input placeholder="Enter category" />
            </Form.Item>

            <Form.Item
              label="Allocated Amount"
              name="allocatedAmount"
              rules={[{ required: true, message: 'Please enter allocated amount' }]}
            >
              <Input type="number" placeholder="Enter allocated amount" min={0} />
            </Form.Item>

            <Form.Item label="Available Project Limit" name="availableProjectLimit">
              <Input type="number" placeholder="Enter available limit" min={0} />
            </Form.Item>
          </div>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right', marginTop: '16px' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingProject ? 'Update' : 'Add'} Project
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectManagement;
