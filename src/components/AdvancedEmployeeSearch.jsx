import React, { useState } from 'react';
import { Input, Select, Button, Table, Space, Card, message, Tag, Tooltip } from 'antd';
import { SearchOutlined, ClearOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

/**
 * TC_15: Advanced Employee Search Component
 * Search employees by multiple criteria: name, ID, department, location
 */
const AdvancedEmployeeSearch = ({ onSelectEmployee, onEditEmployee }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Department options (can be fetched from API or LOV)
  const departmentOptions = [
    'IT',
    'HR',
    'Finance',
    'Purchase',
    'Admin',
    'Operations',
    'OtherDept'
  ];

  // Location options (can be fetched from API or LOV)
  const locationOptions = [
    'BANGALORE',
    'MUMBAI',
    'DELHI',
    'CHENNAI',
    'KOLKATA',
    'PATNA'
  ];

  const handleSearch = async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      if (searchTerm) params.append('searchTerm', searchTerm);
      if (department) params.append('department', department);
      if (location) params.append('location', location);

      const response = await axios.get(
        `/api/employee-department-master/advanced-search?${params.toString()}`
      );

      if (response.data.responseStatus?.statusCode === 0) {
        const employeeData = response.data.responseData || [];
        setEmployees(employeeData);

        if (employeeData.length === 0) {
          message.info('No employees found matching your search criteria');
        } else {
          message.success(`Found ${employeeData.length} employee(s)`);
        }
      } else {
        message.error('Failed to search employees');
        setEmployees([]);
      }
    } catch (error) {
      console.error('Employee search error:', error);
      message.error('Error searching employees. Please try again.');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setDepartment('');
    setLocation('');
    setEmployees([]);
  };

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: 200,
      render: (text) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      )
    },
    {
      title: 'Department',
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: 150
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      width: 130
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      width: 180
    },
    {
      title: 'Email',
      dataIndex: 'emailAddress',
      key: 'emailAddress',
      width: 200,
      ellipsis: true
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 130
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status || 'Active'}
        </Tag>
      )
    },
    // Always show Actions column with Edit button
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          {onEditEmployee && (
            <Tooltip title="Edit Employee">
              <Button
                type="primary"
                icon={<EditOutlined />}
                size="small"
                onClick={() => onEditEmployee(record.employeeId)}
              />
            </Tooltip>
          )}
          {onSelectEmployee && (
            <Button
              type="default"
              size="small"
              onClick={() => onSelectEmployee(record)}
            >
              Select
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <Card title="Advanced Employee Search" style={{ marginBottom: 24 }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Search Filters */}
        <Space wrap style={{ width: '100%' }}>
          <Input
            placeholder="Search by name, ID, designation, etc."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 300 }}
            allowClear
          />

          <Select
            placeholder="Filter by Department"
            value={department || undefined}
            onChange={setDepartment}
            style={{ width: 200 }}
            allowClear
          >
            {departmentOptions.map((dept) => (
              <Option key={dept} value={dept}>
                {dept}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Filter by Location"
            value={location || undefined}
            onChange={setLocation}
            style={{ width: 200 }}
            allowClear
          >
            {locationOptions.map((loc) => (
              <Option key={loc} value={loc}>
                {loc}
              </Option>
            ))}
          </Select>

          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={loading}
          >
            Search
          </Button>

          <Button icon={<ClearOutlined />} onClick={handleReset}>
            Reset
          </Button>
        </Space>

        {/* Results Table */}
        <Table
          columns={columns}
          dataSource={employees}
          rowKey="employeeId"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} employees`
          }}
          scroll={{ x: 1200 }}
          bordered
        />
      </Space>
    </Card>
  );
};

export default AdvancedEmployeeSearch;
