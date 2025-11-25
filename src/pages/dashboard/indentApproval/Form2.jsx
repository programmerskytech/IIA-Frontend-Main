// 

import { Button, Checkbox, DatePicker, Form, Input, Select } from "antd";
// import TextArea from 'antd/es/input/TextArea';
import { Option } from "antd/es/mentions";
import React from "react";

const Form2 = () => {
  const [form] = Form.useForm();
  return (
    <div className="form-container">
      <h2>Indent Approval</h2>
      <Form form={form} layout="vertical" initialValues={{ date: null }}>
        <div className="form-section">
          <Form.Item
            label="Indent Status"
            name="indentStatus"
            rules={[
              { required: true, message: "Please select indent status!" },
            ]}
          >
            <Select placeholder="Current Status">
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Approver Comments" name="approverComments">
            <Input.TextArea
              placeholder="Enter comments"
              rows={1}
            ></Input.TextArea>
          </Form.Item>
          <Form.Item
            label="Approval Date"
            name="approvalDate"
            rules={[{ required: true }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
        </div>
        <div className="form-section">

          <Form.Item
            label="Limited Preferred Vendor"
            name="limitedPreferredVendor"
            rules={[{ required: true, message: "Please select Yes/No!" }]}
          >
            <Select placeholder="Choose Yes/No">
              <Option value="yes">Yes</Option>
              <Option value="no">No</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="vendors"
            label="Vendors"
            rules={[
              {
                required: true,
                message: "Please Select at least 4 vendors",
                validator: (_, value) =>
                  value && value.length >= 4
                    ? Promise.resolve()
                    : Promise.reject("Please Select at least 4 vendors"),
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select vendors from master list"
            >
              <Option value="vendor1">Vendor 1</Option>
              <Option value="vendor2">Vendor 2</Option>
              <Option value="vendor3">Vendor 3</Option>
              <Option value="vendor4">Vendor 4</Option>
              <Option value="vendor5">Vendor 5</Option>
              <Option value="vendor6">Vendor 6</Option>
              <Option value="vendor7">Vendor 7</Option>
              <Option value="vendor8">Vendor 8</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="proprietaryPAC"
            label="Proprietary PAC"
            valuePropName="checked"
          >
            <Checkbox>Is PAC Required?</Checkbox>
          </Form.Item>
        </div>
        <div className="form-section-2">
          <Form.Item
            name="budgetAvailability"
            label="Budget Availability"
            valuePropName="checked"
            rules={[
              {
                required: true,
                message: "Please confirm the budget availability !",
              },
            ]}
          >
            <Checkbox>Is sufficient budget available?</Checkbox>
          </Form.Item>
        </div>
        <Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button type="default" htmlType="reset">
              Reset
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button type="dashed" htmlType="button">
              Save Draft
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Form2;
