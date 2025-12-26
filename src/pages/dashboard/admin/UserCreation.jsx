import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Select, message, Row, Col, Table, Tag, Modal, Descriptions, Divider } from 'antd';
import { TeamOutlined, EyeInvisibleOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

const UserCreation = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);

  useEffect(() => {
    fetchRoles();
    fetchDepartments();
    fetchRecentUsers();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('/api/employee-department-master/roles');
      if (response.data.responseData) {
        setRoles(response.data.responseData);
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/employee-department-master/departments');
      if (response.data.responseData) {
        setDepartments(response.data.responseData);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const fetchRecentUsers = async () => {
    try {
      const response = await axios.get('/api/userMaster');
      if (response.data.responseData) {
        // Get last 10 users, sorted by creation date
        const sortedUsers = response.data.responseData
          .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
          .slice(0, 10);
        setRecentUsers(sortedUsers);
      }
    } catch (error) {
      console.error('Failed to fetch recent users:', error);
    }
  };

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please enter password'));
    }
    if (value.length < 8) {
      return Promise.reject(new Error('Password must be at least 8 characters'));
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return Promise.reject(new Error('Password must contain at least one lowercase letter'));
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return Promise.reject(new Error('Password must contain at least one uppercase letter'));
    }
    if (!/(?=.*\d)/.test(value)) {
      return Promise.reject(new Error('Password must contain at least one number'));
    }
    if (!/(?=.*[@$!%*?&#])/.test(value)) {
      return Promise.reject(new Error('Password must contain at least one special character'));
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please confirm password'));
    }
    if (value !== form.getFieldValue('password')) {
      return Promise.reject(new Error('Passwords do not match'));
    }
    return Promise.resolve();
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const payload = {
        userName: values.userName,
        email: values.email,
        password: values.password,
        employeeId: values.employeeId || null,  // ✅ Optional - can be null
        roleNames: values.roleNames,  // ✅ Array of roles (multiple selection)
        mobileNumber: values.mobileNumber || null,
        createdBy: 'admin' // Replace with actual user from auth state
      };

      // Check if user exists for employee ID
      if (values.employeeId) {
        const checkResponse = await axios.get(`/api/employee-department-master/user-exists/${values.employeeId}`);
        if (checkResponse.data.responseData?.exists) {
          message.warning('User already exists for this employee ID');
          setLoading(false);
          return;
        }
      }

      const response = await axios.post('/api/userMaster', payload);
      const userData = response.data?.responseData;

      if (userData) {
        // ✅ Show success modal with user details
        setCreatedUser(userData);
        setSuccessModalVisible(true);
        form.resetFields();
        fetchRecentUsers();
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    form.resetFields();
  };

  const handleCloseModal = () => {
    setSuccessModalVisible(false);
    setCreatedUser(null);
  };

  const recentUsersColumns = [
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName',
      width: 150
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200
    },
    {
      title: 'Role(s)',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 200,
      render: (role) => {
        if (!role) return '-';
        const roles = role.split(',').map(r => r.trim());
        return (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {roles.map((r, idx) => (
              <Tag key={idx} color="blue">{r}</Tag>
            ))}
          </div>
        );
      }
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 150,
      render: (date) => date ? dayjs(date).format('DD-MM-YYYY HH:mm') : '-'
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={24}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TeamOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                <span>User Creation</span>
              </div>
            }
            bordered={false}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
              Create New User Account
            </h3>

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Username"
                name="userName"
                rules={[
                  { required: true, message: 'Please enter username' },
                  { min: 3, message: 'Username must be at least 3 characters' }
                ]}
              >
                <Input placeholder="Enter username" />
              </Form.Item>

              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: 'Please enter email address' },
                  { type: 'email', message: 'Please enter valid email' }
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ validator: validatePassword }]}
              >
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  suffix={
                    showPassword ? (
                      <EyeOutlined onClick={() => setShowPassword(false)} style={{ cursor: 'pointer' }} />
                    ) : (
                      <EyeInvisibleOutlined onClick={() => setShowPassword(true)} style={{ cursor: 'pointer' }} />
                    )
                  }
                />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[{ validator: validateConfirmPassword }]}
              >
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  suffix={
                    showConfirmPassword ? (
                      <EyeOutlined onClick={() => setShowConfirmPassword(false)} style={{ cursor: 'pointer' }} />
                    ) : (
                      <EyeInvisibleOutlined onClick={() => setShowConfirmPassword(true)} style={{ cursor: 'pointer' }} />
                    )
                  }
                />
              </Form.Item>

              <Form.Item
                label="Employee ID (Optional)"
                name="employeeId"
                tooltip="Link this user account to an existing employee"
                help="Leave empty if not linking to an employee record"
              >
                <Input placeholder="Enter employee ID (if applicable)" />
              </Form.Item>

              <Form.Item
                label="User Roles"
                name="roleNames"
                rules={[{ required: true, message: 'Please select at least one role' }]}
                tooltip="Select one or more roles for this user"
              >
                <Select
                  mode="multiple"  // ✅ Multiple role selection
                  placeholder="Select one or more roles"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {roles.map((role) => (
                    <Option key={role.roleId} value={role.roleName}>
                      {role.roleName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Mobile Number (Optional)" name="mobileNumber">
                <Input placeholder="Enter mobile number" maxLength={10} />
              </Form.Item>

              {/* Action Buttons */}
              <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <Button size="large" onClick={handleClear}>
                    Clear Form
                  </Button>
                  <Button type="primary" size="large" htmlType="submit" loading={loading}>
                    Create User
                  </Button>
                </div>
              </Form.Item>
            </Form>

            {/* Password Requirements */}
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f6f8fa', borderRadius: '4px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Password Requirements:</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#666' }}>
                <li>At least 8 characters long</li>
                <li>At least one uppercase letter (A-Z)</li>
                <li>At least one lowercase letter (a-z)</li>
                <li>At least one number (0-9)</li>
                <li>At least one special character (@$!%*?&#)</li>
              </ul>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card title="Recently Created Users" bordered={false}>
            {recentUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                No users created yet
              </div>
            ) : (
              <Table
                columns={recentUsersColumns}
                dataSource={recentUsers}
                rowKey="userId"
                pagination={false}
                size="small"
                scroll={{ x: 500 }}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Success Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
            <span>User Created Successfully!</span>
          </div>
        }
        open={successModalVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" type="primary" onClick={handleCloseModal}>
            Close
          </Button>
        ]}
        width={600}
      >
        {createdUser && (
          <>
            {/* User ID Highlighted */}
            <div style={{
              backgroundColor: '#e6f7ff',
              padding: '16px',
              borderRadius: '8px',
              border: '2px solid #1890ff',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '12px', color: '#1890ff', marginBottom: '4px' }}>
                User ID (Auto-Generated)
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {createdUser.userId}
              </div>
            </div>

            <Divider />

            {/* User Information */}
            <h4 style={{ marginBottom: '12px', color: '#1890ff' }}>User Information</h4>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Username">{createdUser.userName}</Descriptions.Item>
              <Descriptions.Item label="Email Address">{createdUser.email}</Descriptions.Item>
              <Descriptions.Item label="Mobile Number">
                {createdUser.mobileNumber || '-'}
              </Descriptions.Item>
              {createdUser.employeeId && (
                <Descriptions.Item label="Linked Employee ID">
                  <Tag color="green">{createdUser.employeeId}</Tag>
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider />

            {/* Assigned Roles */}
            <h4 style={{ marginBottom: '12px', color: '#1890ff' }}>Assigned Roles</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {createdUser.roleName?.split(',').map((role, index) => (
                <Tag key={index} color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                  {role.trim()}
                </Tag>
              ))}
            </div>

            <Divider />

            {/* System Information */}
            <h4 style={{ marginBottom: '12px', color: '#1890ff' }}>System Information</h4>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Created By">{createdUser.createdBy}</Descriptions.Item>
              <Descriptions.Item label="Created Date">
                {dayjs(createdUser.createdDate).format('DD-MM-YYYY HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </div>
  );
};

export default UserCreation;
