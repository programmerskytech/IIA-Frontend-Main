import React from "react";
import { Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import FormInputItem from "./DKG_FormInputItem";

const OrgDtls = ({
  txnType,
  handleChange,
  heading,
  cdName,
  orgName,
  adrName,
  pinName,
  readOnly,
  formData
}) => {
  return (
    <>
      <div className="consignor-container">
        <h3 className="font-bold text-[#003566]">{heading}</h3>

        <FormInputItem
          label="Organization Code"
          readOnly={readOnly ? true : false}
          onChange={handleChange}
          name={cdName}
          required
        />
        <FormInputItem
          label="Organization Name"
          readOnly={true}
          name={orgName}
          required
        />
        <Form.Item label="Address" name={adrName} required>
          <TextArea autoSize={{ minRows: 1, maxRows: 3 }}  readOnly/>
        </Form.Item>
        
        <FormInputItem
          label="Pincode"
          readOnly={true}
          name={pinName}
          required
        />
      </div>
    </>
  );
};

export default OrgDtls;
