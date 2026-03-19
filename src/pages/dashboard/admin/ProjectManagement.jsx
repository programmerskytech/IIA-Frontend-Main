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
  const [budgetCodes, setBudgetCodes] = useState([]); // Budget codes from Budget Management
  const [projectHeads, setProjectHeads] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgetTypes, setBudgetTypes] = useState([]);
  const [projectStatuses, setProjectStatuses] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchBudgetCodes();
    fetchProjectHeads();
    fetchDepartments();
    fetchCategories();
    fetchBudgetTypes();
    fetchProjectStatuses();
  }, []);

  // Fetch budget codes from Budget Management for dropdown
  const fetchBudgetCodes = async () => {
    try {
      const response = await axios.get('/api/admin/budget/dropdown');
      if (response.data.responseData) {
        setBudgetCodes(response.data.responseData);
      } else if (response.data.data) {
        setBudgetCodes(response.data.data);
      } else if (Array.isArray(response.data)) {
        setBudgetCodes(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch budget codes:', error);
      // Fallback: try fetching from budget list
      try {
        const fallbackResponse = await axios.get('/api/admin/budget');
        if (fallbackResponse.data.responseData) {
          const codes = fallbackResponse.data.responseData.map(b => ({
            budgetCode: b.budgetCode,
            budgetName: b.budgetName
          }));
          setBudgetCodes(codes);
        }
      } catch (fallbackError) {
        console.error('Fallback budget fetch also failed:', fallbackError);
      }
    }
  };

  const fetchProjectHeads = async () => {
    try {
      const response = await axios.get('/api/lov/project/heads');
      const data = response.data.responseData || response.data.data || (Array.isArray(response.data) ? response.data : []);
      setProjectHeads(data);
    } catch (error) {
      console.error('Failed to fetch project heads:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/lov/project/departments');
      const data = response.data.responseData || response.data.data || (Array.isArray(response.data) ? response.data : []);
      setDepartments(data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/lov/project/categories');
      const data = response.data.responseData || response.data.data || (Array.isArray(response.data) ? response.data : []);
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchBudgetTypes = async () => {
    try {
      const response = await axios.get('/api/lov/project/budget-types');
      const data = response.data.responseData || response.data.data || (Array.isArray(response.data) ? response.data : []);
      setBudgetTypes(data);
    } catch (error) {
      console.error('Failed to fetch budget types:', error);
    }
  };

  const fetchProjectStatuses = async () => {
    try {
      const response = await axios.get('/api/lov/project/statuses');
      const data = response.data.responseData || response.data.data || (Array.isArray(response.data) ? response.data : []);
      setProjectStatuses(data);
    } catch (error) {
      console.error('Failed to fetch project statuses:', error);
    }
  };

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
    form.setFieldsValue({ status: projectStatuses.find(s => s.isActive)?.value || undefined });
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
      budgetCode: record.budgetCode || record.projectCode,
      category: record.category,
      allocatedAmount: record.allocatedAmount,
      availableProjectLimit: record.availableProjectLimit,
      startDate: record.startDate && dayjs(record.startDate).isValid() ? dayjs(record.startDate) : null,
      endDate: record.endDate && dayjs(record.endDate).isValid() ? dayjs(record.endDate) : null,
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
      const selectedHead = projectHeads.find(h => h.employeeId === values.projectHead);
      const payload = {
        projectCode: values.projectCode,
        projectNameDescription: values.projectNameDescription,
        projectHead: values.projectHead,
        projectHeadName: selectedHead?.employeeName || '',
        departmentDivision: values.departmentDivision,
        budgetType: values.budgetType,
        budgetCode: values.budgetCode || values.projectCode,
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
      item.projectHead?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.projectHeadName?.toLowerCase().includes(searchText.toLowerCase())
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
      title: 'Project Head',
      dataIndex: 'projectHeadName',
      key: 'projectHead',
      width: 150,
      render: (text, record) => text || record.projectHead || '-'
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      render: (date) => date && dayjs(date).isValid() ? dayjs(date).format('YYYY-MM-DD') : '-'
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: (date) => date && dayjs(date).isValid() ? dayjs(date).format('YYYY-MM-DD') : '-'
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
            placeholder="Search projects by name, budget code, or project head..."
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
              rules={[{ required: true, message: 'Please select budget code' }]}
            >
              <Select
                placeholder="Select budget code"
                disabled={!!editingProject}
                showSearch
                filterOption={(input, option) =>
                  (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {budgetCodes.map((budget) => (
                  <Option key={budget.budgetCode} value={budget.budgetCode}>
                    {budget.budgetCode} - {budget.budgetName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Project Head"
              name="projectHead"
              rules={[{ required: true, message: 'Please select project head' }]}
            >
              <Select
                placeholder="Select project head"
                showSearch
                filterOption={(input, option) =>
                  (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {projectHeads.map((head) => (
                  <Option key={head.employeeId} value={head.employeeId}>
                    {head.displayValue || `${head.employeeId} - ${head.employeeName}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select placeholder="Select status">
                {projectStatuses.map((item) => (
                  <Option key={item.lovId || item.value} value={item.value}>
                    {item.displayValue || item.value}
                  </Option>
                ))}
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
              <Select
                placeholder="Select department"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {departments.map((dept) => (
                  <Option key={dept.lovId || dept.lovValue} value={dept.lovValue || dept.value}>
                    {dept.lovDisplayValue || dept.lovValue || dept.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Budget Type" name="budgetType">
              <Select placeholder="Select budget type">
                {budgetTypes.map((item) => (
                  <Option key={item.lovId || item.value} value={item.value}>
                    {item.displayValue || item.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Category" name="category">
              <Select
                placeholder="Select category"
                showSearch
                allowClear
                filterOption={(input, option) =>
                  (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {categories.map((cat) => (
                  <Option key={cat.lovId || cat.lovValue} value={cat.lovValue || cat.value}>
                    {cat.lovDisplayValue || cat.lovValue || cat.value}
                  </Option>
                ))}
              </Select>
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
