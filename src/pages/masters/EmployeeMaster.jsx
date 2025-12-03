import React, { useEffect, useState } from "react";
import { Form, Button, Select, message, Modal, Input, Tag, Switch, Table, Tabs, Checkbox, Divider } from "antd";
import { ReloadOutlined, SaveOutlined, SendOutlined, CheckOutlined, CloseOutlined, EditOutlined, UserAddOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import FormContainer from "../../components/DKG_FormContainer";
import FormInputItem from "../../components/DKG_FormInputItem";
import Heading from "../../components/DKG_Heading";

const { TextArea, Password } = Input;
const { TabPane } = Tabs;

const EmployeeMaster = () => {
  const { employeeId } = useParams();
  const auth = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDraftMode, setIsDraftMode] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [createdEmployee, setCreatedEmployee] = useState(null);
  const [employeeList, setEmployeeList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [currentStatus, setCurrentStatus] = useState("Active");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [activeTab, setActiveTab] = useState("form");
  const [createUserAccount, setCreateUserAccount] = useState(false);
  const [userAlreadyExists, setUserAlreadyExists] = useState(false);

  useEffect(() => {
    fetchDesignations();
    fetchDepartments();
    fetchRoles();
    fetchDrafts();
  }, []);

  useEffect(() => {
    if (employeeId) {
      setIsEditMode(true);
      setSelectedEmployeeId(employeeId);
      fetchEmployeeDetails(employeeId);
    }
  }, [employeeId]);

  const fetchDesignations = async () => {
    try {
      const response = await axios.get("/api/employee-department-master/designations");
      const data = response.data?.responseData;
      if (Array.isArray(data)) {
        setDesignationList(
          data.map((item) => ({
            label: item.designationName,
            value: item.designationName,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching designations:", error);
      message.error("Failed to load designations");
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("/api/employee-department-master/departments");
      const data = response.data?.responseData;
      if (Array.isArray(data)) {
        setDepartmentList(
          data.map((item) => ({
            label: item.departmentName,
            value: item.departmentName,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      message.error("Failed to load departments");
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("/api/employee-department-master/roles");
      const data = response.data?.responseData;
      if (Array.isArray(data)) {
        setRolesList(
          data.map((item) => ({
            label: item.roleName,
            value: item.roleName,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      message.error("Failed to load roles");
    }
  };

  const fetchDrafts = async () => {
    try {
      const response = await axios.get(`/api/employee-department-master/drafts/user/${auth.userId}`);
      const data = response.data?.responseData;
      if (Array.isArray(data)) {
        setDrafts(data);
      }
    } catch (error) {
      console.error("Error fetching drafts:", error);
    }
  };

  const searchEmployees = async (searchText) => {
    if (!searchText || searchText.trim().length < 2) {
      return [];
    }

    try {
      const response = await axios.get(
        `/api/employee-department-master/employeeSearch?keyword=${searchText}`
      );
      const data = response.data;

      if (Array.isArray(data?.responseData)) {
        return data.responseData.map((item) => ({
          label: `${item.employeeId} - ${item.employeeName} (${item.departmentName}) - ${item.status}`,
          value: item.employeeId,
          status: item.status,
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error("Employee search error:", error);
      return [];
    }
  };

  const fetchEmployeeDetails = async (id) => {
    try {
      const response = await axios.get(`/api/employee-department-master/${id}`);
      const res = response.data?.responseData;
      if (res) {
        form.setFieldsValue({
          employeeId: res.employeeId,
          employeeName: res.employeeName,
          departmentName: res.departmentName,
          location: res.location,
          designation: res.designation,
          phoneNumber: res.phoneNumber,
          emailAddress: res.emailAddress,
          address: res.address,
          status: res.status,
        });
        setCurrentStatus(res.status);
        setSelectedEmployeeId(res.employeeId);
        setIsDraftMode(res.isDraft === true);
        
        // Check if user already exists for this employee
        checkUserExists(res.employeeId);
      }
    } catch (error) {
      message.error("Failed to load employee details");
      console.error(error);
    }
  };

  const checkUserExists = async (empId) => {
    try {
      const response = await axios.get(`/api/employee-department-master/user-exists/${empId}`);
      const exists = response.data?.responseData?.exists;
      setUserAlreadyExists(exists);
      if(exists) {
        setCreateUserAccount(false);
        message.info("User account already exists for this employee");
      }
    } catch (error) {
      console.error("Error checking user existence:", error);
    }
  };

  const handleStatusChange = async (checked) => {
    if (!selectedEmployeeId) {
      message.warning("Please select an employee first");
      return;
    }

    const action = checked ? "activate" : "deactivate";
    const newStatus = checked ? "Active" : "Inactive";

    Modal.confirm({
      title: `Confirm ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      content: `Are you sure you want to ${action} this employee?`,
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await axios.put(`/api/employee-department-master/${selectedEmployeeId}/${action}`, {
            updatedBy: String(auth.userId),
          });
          setCurrentStatus(newStatus);
          form.setFieldsValue({ status: newStatus });
          message.success(`Employee ${action}d successfully!`);
        } catch (error) {
          console.error(`Error ${action}ing employee:`, error);
          message.error(`Failed to ${action} employee`);
        }
      },
    });
  };

  const validatePhoneNumber = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Phone number is required"));
    }
    if (!/^[0-9]{10}$/.test(value)) {
      return Promise.reject(new Error("Phone number must be exactly 10 digits"));
    }
    return Promise.resolve();
  };

  const validateEmail = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Email address is required"));
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return Promise.reject(new Error("Please enter a valid email address"));
    }
    return Promise.resolve();
  };

  const validatePassword = (_, value) => {
    if(createUserAccount) {
      if (!value) {
        return Promise.reject(new Error("Password is required when creating user account"));
      }
      if (value.length < 8) {
        return Promise.reject(new Error("Password must be at least 8 characters"));
      }
    }
    return Promise.resolve();
  };

  const handleSaveDraft = async () => {
    setDraftLoading(true);
    try {
      const values = form.getFieldsValue();
      const payload = {
        employeeId: values.employeeId || null,
        employeeName: values.employeeName || "",
        departmentName: values.departmentName || "",
        location: values.location || "",
        designation: values.designation || "",
        phoneNumber: values.phoneNumber || "",
        emailAddress: values.emailAddress || "",
        address: values.address || "",
        status: values.status || "Active",
        isDraft: true,
        createdBy: String(auth.userId),
        updatedBy: String(auth.userId),
      };

      let response;
      if (selectedEmployeeId && isDraftMode) {
        response = await axios.put(`/api/employee-department-master/draft/${selectedEmployeeId}`, payload);
      } else if (selectedEmployeeId && !isDraftMode) {
        message.warning("Cannot save a submitted employee as draft. Use Update instead.");
        setDraftLoading(false);
        return;
      } else {
        response = await axios.post("/api/employee-department-master/draft", payload);
      }

      const data = response.data?.responseData;
      if (data) {
        message.success("Draft saved successfully!");
        setSelectedEmployeeId(data.employeeId);
        setIsDraftMode(true);
        form.setFieldsValue({ employeeId: data.employeeId });
        fetchDrafts();
      }
    } catch (error) {
      const errMsg = error.response?.data?.responseStatus?.message || error.message;
      message.error(`Failed to save draft: ${errMsg}`);
    } finally {
      setDraftLoading(false);
    }
  };

  const loadDraft = async (record) => {
    try {
      const response = await axios.get(`/api/employee-department-master/${record.employeeId}`);
      const data = response.data?.responseData;
      if (data) {
        form.setFieldsValue({
          employeeId: data.employeeId,
          employeeName: data.employeeName,
          departmentName: data.departmentName,
          location: data.location,
          designation: data.designation,
          phoneNumber: data.phoneNumber,
          emailAddress: data.emailAddress,
          address: data.address,
          status: data.status,
        });
        setSelectedEmployeeId(data.employeeId);
        setIsEditMode(true);
        setIsDraftMode(true);
        setCurrentStatus(data.status);
        setActiveTab("form");
        message.success("Draft loaded successfully!");
      }
    } catch (error) {
      message.error("Failed to load draft");
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        employeeName: values.employeeName,
        departmentName: values.departmentName,
        location: values.location,
        designation: values.designation,
        phoneNumber: values.phoneNumber,
        emailAddress: values.emailAddress,
        address: values.address,
        status: values.status || "Active",
        createdBy: String(auth.userId),
        updatedBy: String(auth.userId),
        createUserAccount: createUserAccount,
        userName: values.userName || values.employeeName,
        userPassword: values.userPassword,
        userRoles: values.userRoles || [],
      };

      const currentEmployeeId = values.employeeId || employeeId || selectedEmployeeId;

      let response;
      if (currentEmployeeId && isDraftMode) {
        response = await axios.put(`/api/employee-department-master/draft/${currentEmployeeId}/submit`, payload);
      } else if (currentEmployeeId) {
        response = await axios.put(`/api/employee-department-master/${currentEmployeeId}`, payload);
      } else {
        // Create with user account if checkbox is checked
        if(createUserAccount) {
          response = await axios.post("/api/employee-department-master/with-user", payload);
        } else {
          response = await axios.post("/api/employee-department-master", payload);
        }
      }

      const data = response.data?.responseData;
      if (data) {
        setCreatedEmployee(data);
        const actionText = isDraftMode ? "submitted" : (isEditMode ? "updated" : "created");
        message.success(`Employee ${actionText} successfully!${createUserAccount ? ' User account created.' : ''}`);
        setShowPopup(true);
        setIsDraftMode(false);
        fetchDrafts();
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      const errMsg = error.response?.data?.responseStatus?.message || error.message;
      message.error(`Failed to ${isDraftMode ? "submit draft" : (isEditMode ? "update" : "create")} employee: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setIsEditMode(false);
    setIsDraftMode(false);
    setSelectedEmployeeId(null);
    setCurrentStatus("Active");
    setEmployeeList([]);
    setCreateUserAccount(false);
    setUserAlreadyExists(false);
  };

  const draftColumns = [
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      key: "employeeId",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
      render: (text) => text || <span style={{ color: "#999" }}>Not filled</span>,
    },
    {
      title: "Department",
      dataIndex: "departmentName",
      key: "departmentName",
      render: (text) => text || <span style={{ color: "#999" }}>Not filled</span>,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      key: "designation",
      render: (text) => text || <span style={{ color: "#999" }}>Not filled</span>,
    },
    {
      title: "Updated Date",
      dataIndex: "updatedDate",
      key: "updatedDate",
      render: (text) => text ? new Date(text).toLocaleString() : "-",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          size="small"
          onClick={() => loadDraft(record)}
        >
          Edit Draft
        </Button>
      ),
    },
  ];

  return (
    <FormContainer>
      <Heading title={isDraftMode ? "Edit Draft" : (isEditMode ? "Edit Employee Master" : "Create Employee Master")} />

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Employee Form" key="form">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            
            {isDraftMode && (
              <div
                style={{
                  background: "#fff7e6",
                  border: "1px solid #ffd591",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <Tag color="orange">DRAFT</Tag>
                <span>This is a draft. Fill all required fields and submit to finalize.</span>
              </div>
            )}

            <div className="form-section">
              <Form.Item label="Search Employee">
                <Select
                  showSearch
                  placeholder="Type to search employee..."
                  filterOption={false}
                  onSearch={async (value) => {
                    const results = await searchEmployees(value);
                    setEmployeeList(Array.isArray(results) ? results : []);
                  }}
                  options={Array.isArray(employeeList) ? employeeList : []}
                  onChange={async (selectedId) => {
                    setIsEditMode(true);
                    setSelectedEmployeeId(selectedId);
                    await fetchEmployeeDetails(selectedId);
                    message.success("Employee details loaded successfully!");
                  }}
                  style={{ width: "100%" }}
                  allowClear
                  onClear={handleReset}
                />
              </Form.Item>
            </div>

            {isEditMode && selectedEmployeeId && !isDraftMode && (
              <div
                style={{
                  background: "#f5f5f5",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: "bold", marginRight: "10px" }}>
                      Employee Status:
                    </span>
                    <Tag color={currentStatus === "Active" ? "green" : "red"}>
                      {currentStatus}
                    </Tag>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span>Inactive</span>
                    <Switch
                      checked={currentStatus === "Active"}
                      onChange={handleStatusChange}
                      checkedChildren={<CheckOutlined />}
                      unCheckedChildren={<CloseOutlined />}
                    />
                    <span>Active</span>
                  </div>
                </div>
              </div>
            )}

            <div
              style={{
                background: "#fafafa",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ marginBottom: "15px", color: "#1890ff" }}>
                Basic Information
              </h3>
              <div className="form-section">
                <FormInputItem
                  label="Employee ID"
                  name="employeeId"
                  placeholder={isEditMode ? selectedEmployeeId : "Auto-generated"}
                  disabled
                />
                <Form.Item
                  label="Employee Name"
                  name="employeeName"
                  rules={[
                    { required: !isDraftMode, message: "Employee name is required" },
                    { min: 2, message: "Name must be at least 2 characters" },
                  ]}
                >
                  <Input placeholder="Enter employee name" />
                </Form.Item>
                <Form.Item
                  label="Department"
                  name="departmentName"
                  rules={[{ required: !isDraftMode, message: "Department is required" }]}
                >
                  <Select
                    placeholder="Select department"
                    options={departmentList}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
              </div>

              <div className="form-section">
                <Form.Item
                  label="Designation"
                  name="designation"
                  rules={[{ required: !isDraftMode, message: "Designation is required" }]}
                >
                  <Select
                    placeholder="Select designation"
                    options={designationList}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Location"
                  name="location"
                  rules={[{ required: !isDraftMode, message: "Location is required" }]}
                >
                  <Input placeholder="Enter location" />
                </Form.Item>
              </div>
            </div>

            <div
              style={{
                background: "#fafafa",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ marginBottom: "15px", color: "#1890ff" }}>
                Contact Details
              </h3>
              <div className="form-section">
                <Form.Item
                  label="Phone Number"
                  name="phoneNumber"
                  rules={isDraftMode ? [] : [{ validator: validatePhoneNumber }]}
                  extra="Enter 10-digit phone number"
                >
                  <Input
                    placeholder="Enter 10-digit phone number"
                    maxLength={10}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="Email Address"
                  name="emailAddress"
                  rules={isDraftMode ? [] : [{ validator: validateEmail }]}
                >
                  <Input placeholder="Enter email address" type="email" />
                </Form.Item>
              </div>

              <div className="form-section">
                <Form.Item
                  label="Address"
                  name="address"
                  rules={[
                    { required: !isDraftMode, message: "Address is required" },
                    { min: isDraftMode ? 0 : 10, message: "Address must be at least 10 characters" },
                  ]}
                >
                  <TextArea
                    placeholder="Enter complete address"
                    rows={3}
                    showCount
                    maxLength={500}
                  />
                </Form.Item>
              </div>
            </div>

            {/* User Account Creation Section */}
            {!isEditMode && !isDraftMode && (
              <div
                style={{
                  background: "#f0f5ff",
                  padding: "20px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                  border: "1px solid #adc6ff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
                  <Checkbox
                    checked={createUserAccount}
                    onChange={(e) => setCreateUserAccount(e.target.checked)}
                  >
                    <span style={{ fontWeight: "bold", fontSize: "16px" }}>
                      <UserAddOutlined style={{ marginRight: "8px" }} />
                      Create User Account
                    </span>
                  </Checkbox>
                </div>

                {createUserAccount && (
                  <>
                    <Divider style={{ margin: "15px 0" }} />
                    <h3 style={{ marginBottom: "15px", color: "#1890ff" }}>
                      User Account Details
                    </h3>
                    
                    <div className="form-section">
                      <Form.Item
                        label="Username"
                        name="userName"
                        rules={[
                          { required: createUserAccount, message: "Username is required" }
                        ]}
                        extra="Will use employee name if not provided"
                      >
                        <Input placeholder="Enter username (optional)" />
                      </Form.Item>

                      <Form.Item
                        label="Password"
                        name="userPassword"
                        rules={[
                          { validator: validatePassword }
                        ]}
                        extra="Minimum 8 characters"
                      >
                        <Password 
                          placeholder="Enter password"
                          visibilityToggle
                        />
                      </Form.Item>
                    </div>

                    <Form.Item
                      label="Assign Roles"
                      name="userRoles"
                      rules={[
                        { required: createUserAccount, message: "Please select at least one role" }
                      ]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Select roles for the user"
                        options={rolesList}
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                      />
                    </Form.Item>

                    <div
                      style={{
                        background: "#fffbe6",
                        border: "1px solid #ffe58f",
                        padding: "10px",
                        borderRadius: "4px",
                        marginTop: "10px",
                      }}
                    >
                      <small>
                        ⚠️ <strong>Note:</strong> A login account will be created for this employee with the specified credentials.
                        The password will be encrypted and stored securely.
                      </small>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Show warning if user already exists when editing */}
            {isEditMode && userAlreadyExists && (
              <div
                style={{
                  background: "#fff1f0",
                  border: "1px solid #ffccc7",
                  padding: "15px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <Tag color="red">USER EXISTS</Tag>
                <span>A user account already exists for this employee. User account creation is disabled.</span>
              </div>
            )}

            <Form.Item name="status" hidden>
              <Input />
            </Form.Item>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <Button htmlType="button" icon={<ReloadOutlined />} onClick={handleReset}>
                Reset
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                loading={loading}
              >
                {isDraftMode ? "Submit Draft" : (isEditMode ? "Update" : "Submit")}
              </Button>
              <Button
                icon={<SaveOutlined />}
                onClick={handleSaveDraft}
                loading={draftLoading}
                disabled={isEditMode && !isDraftMode}
              >
                Save Draft
              </Button>
            </div>
          </Form>
        </TabPane>

        <TabPane tab={`My Drafts (${drafts.length})`} key="drafts">
          <Table
            columns={draftColumns}
            dataSource={drafts}
            rowKey="employeeId"
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: "No drafts found" }}
          />
        </TabPane>
      </Tabs>

     <Modal
  title={
    isDraftMode ? "Draft Submitted Successfully" : (isEditMode ? "Employee Updated" : "Employee Created Successfully")
  }
  open={showPopup}
  onOk={() => {
    setShowPopup(false);
    if (!isEditMode) {
      handleReset();
    }
  }}
  onCancel={() => setShowPopup(false)}
  okText="OK"
>
  {createdEmployee && (
    <div>
      <p>
        {`Employee "${createdEmployee.employeeName}" (Employee ID: ${createdEmployee.employeeId}) was ${
          isDraftMode ? "submitted" : (isEditMode ? "updated" : "created")
        } successfully.`}
      </p>
      {createUserAccount && createdEmployee.userId && (
        <div
          style={{
            background: "#e6f7ff",
            border: "1px solid #91d5ff",
            padding: "15px",
            borderRadius: "8px",
            marginTop: "15px",
            marginBottom: "10px",
          }}
        >
          <p style={{ marginBottom: "10px", fontWeight: "bold", color: "#1890ff" }}>
            ✓ User Account Created Successfully
          </p>
          <div style={{ 
            background: "#fff", 
            padding: "10px", 
            borderRadius: "4px",
            border: "1px solid #d9d9d9"
          }}>
            <p style={{ marginBottom: "5px" }}>
              <strong>Login Credentials:</strong>
            </p>
            <p style={{ marginBottom: "5px", fontFamily: "monospace" }}>
              <strong>User ID:</strong> <span style={{ color: "#cf1322" }}>{createdEmployee.userId}</span>
            </p>
            <p style={{ marginBottom: "0", fontFamily: "monospace" }}>
              <strong>Password:</strong> <span style={{ color: "#666" }}>(as set by you)</span>
            </p>
          </div>
          <p style={{ marginTop: "10px", marginBottom: "0", fontSize: "12px", color: "#666" }}>
            ⚠️ The employee should use <strong>User ID</strong> (not Employee ID) to login
          </p>
        </div>
      )}
      <div style={{ marginTop: "10px" }}>
        <p>
          <strong>Employee ID:</strong> {createdEmployee.employeeId}
        </p>
        {createdEmployee.userId && (
          <p>
            <strong>User ID:</strong> <span style={{ color: "#cf1322", fontFamily: "monospace" }}>{createdEmployee.userId}</span>
          </p>
        )}
        <p>
          <strong>Status:</strong>{" "}
          <Tag color={createdEmployee.status === "Active" ? "green" : "red"}>
            {createdEmployee.status}
          </Tag>
        </p>
        <p>
          <strong>Department:</strong> {createdEmployee.departmentName}
        </p>
        <p>
          <strong>Designation:</strong> {createdEmployee.designation}
        </p>
        <p>
          <strong>Phone:</strong> {createdEmployee.phoneNumber}
        </p>
        <p>
          <strong>Email:</strong> {createdEmployee.emailAddress}
        </p>
      </div>
    </div>
  )}
</Modal>
    </FormContainer>
  );
};

export default EmployeeMaster;