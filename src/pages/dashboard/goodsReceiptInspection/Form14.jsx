import { Button, DatePicker, Form, Input, InputNumber, Popover } from "antd";
import React from "react";

const Form14 = () => {
  return (
    <div className="form-container">
        <h2>Goods Receipt and Inspection </h2>
      <Form layout="vertical">
        <div className="form-section">
            
            <Form.Item
            label="Inspection Report No."
            name="goodsReceiptInspectionReportNo"
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
            label="Asset Code"
            name="assetCode"
            rules={[{ required: true }]}
            >
            <Input disabled />
            </Form.Item>
            <Form.Item
            label="Additional Material Description"
            name="additionalMaterialDescription"
            >
            <Input.TextArea rows={1}/>
            </Form.Item>
            <Form.Item label="Locator" name="locator" rules={[{ required: true }]}>
            <Input />
            </Form.Item>
        </div>
        <div className="form-section">
            <Form.Item label="Print Label Option" name="printLabelOption">
            <Button>Generate Label</Button>
            </Form.Item>
            <Form.Item label="Depreciation Rate" name="depreciationRate">
            <InputNumber min={0} max={100} formatter={(value) => `${value}%`} />
            </Form.Item>
            <Form.Item label="Book Value" name="bookValue">
            <InputNumber disabled />
            </Form.Item>
        </div>
        <Form.Item label="Attach Component Popup" name="attachComponentPopup">
          <Popover
            content={<p>Details of associated components.</p>}
            trigger="click"
          >
            <Button>Attach Components</Button>
          </Popover>
        </Form.Item>
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

export default Form14;
