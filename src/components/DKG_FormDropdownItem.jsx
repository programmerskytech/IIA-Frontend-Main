import React from 'react'
import {Form, Select} from "antd"

const { Option } = Select;

const FormDropdownItem = ({label, formField, placeholder, name, onChange, dropdownArray, valueField, visibleField, required, className, disabled}) => {
  return (
    <Form.Item label={label} name={name} rules={[{ required: required ? true : false, message: 'Please select a value!' }]} className={className} >
      <Select placeholder={placeholder}  onChange={(value)=>onChange(formField, value)} disabled={disabled}>
        {
            dropdownArray.map((item, key)=>(
                <Option key={key} value={item[valueField]}> {item[visibleField]} </Option>
            ))
        }
      </Select>
    </Form.Item>
  )
}

export default FormDropdownItem
