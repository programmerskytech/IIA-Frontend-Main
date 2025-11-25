import React from "react";
import { Form, DatePicker } from "antd";
import dayjs from "dayjs";
import FormInputItem from "./DKG_FormInputItem";

const dateFormat = "DD/MM/YYYY";

const CustomDatePicker = ({
  label,
  name,
  defaultValue,
  onChange,
  readOnly,
  required,
  placeholder,
  className,
  disablePastDate,
  disableFutureDate,
  disabled
}) => {
  const initialValue = defaultValue ? dayjs(defaultValue, dateFormat) : null;

  const disablePastDates = (current) => {
    if(disablePastDate){
      return current && current < dayjs().startOf("day");
    }
    return false;
  };
  const disableFutureDates = (current) => {
    if(disableFutureDate){
      return current && current > dayjs().startOf("day");
    }
    return false;
  };



  const handleDateChange = (date) => {
    if (date) {
      if (dayjs.isDayjs(date)) {
        onChange(name, date.format(dateFormat));
      } else {
        onChange(name, null);
      }
    } else {
      onChange(name, null);
    }
  };

  if(readOnly){
    return <FormInputItem label={label} value={defaultValue} name={name} readOnly />
  }

  return (
    <Form.Item
      label={label}
      rules={[
        { required: required ? true : false, message: "Please input value!" },
      ]}
      initialValue={initialValue} // Set initial value
      className={className}
    >
      <DatePicker
      disabledDate={disablePastDates || disableFutureDates}
      disabled={disabled}
      placeholder={placeholder}
        style={{ width: "100%" }}
        format={dateFormat}
        onChange={handleDateChange}
        value={initialValue} // Control the value of DatePicker
      />
    </Form.Item>
  );
};

export default CustomDatePicker;