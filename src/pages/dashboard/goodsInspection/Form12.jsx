import { Button, DatePicker, Form, Input, InputNumber, Select, Upload } from "antd";
import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Option } from "antd/es/mentions";

const Form12 = () => {
  return (
    <div className="form-container">
      <h2>Goods Inspection</h2>
      <Form layout="vertical">
      <div className="form-section">
        <Form.Item
          label="Goods Inspection No."
          name="goodsInspectionNo"
          rules={[{ required: true }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item label="Installation Date" name="installationDate">
          <DatePicker />
        </Form.Item>
        <Form.Item label="Commissioning Date" name="commissioningDate">
          <DatePicker />
        </Form.Item>
        </div>
        <div className="form-section">
        <Form.Item
          label="Upload Installation Report"
          name="uploadInstallationReport"
        >
          <Upload>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label="Accepted Quantity"
          name="acceptedQuantity"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          label="Rejected Quantity"
          name="rejectedQuantity"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} />
        </Form.Item>
      </div>
      <div className="form-section">
        <Form.Item
            label="Goods Return"
            name="goodsReturn"
            rules={[{ required: true }]}
            style={{ width: "32%" }}
            >
            <Select>
                <Option value="permanent">Permanent</Option>
                <Option value="replacement">Replacement</Option>
            </Select>
            </Form.Item>
      </div>
      </Form>
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
    </div>
  );
};

export default Form12;
