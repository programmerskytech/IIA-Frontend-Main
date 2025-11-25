import { Button, Form, Input, InputNumber, Select } from "antd";
import React from "react";

const Form13 = () => {
  return (
    <div className="form-container">
      <h2>Goods Return</h2>
      <Form layout="vertical">
      <div className="form-section">

        <Form.Item
          label="Goods Return Note No."
          name="goodsReturnNoteNo"
          rules={[{ required: true }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Rejected Quantity"
          name="rejectedQuantity"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          label="Return Quantity"
          name="returnQuantity"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} />
        </Form.Item>
      </div>
      <div className="form-section">

        <Form.Item
          label="Type of Return"
          name="typeOfReturn"
          rules={[{ required: true }]}
        >
          <Select>
            <Select.Option value="damaged">Damaged</Select.Option>
            <Select.Option value="excess">Excess</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Reason of Return"
          name="reasonOfReturn"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={1} />
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

export default Form13;
