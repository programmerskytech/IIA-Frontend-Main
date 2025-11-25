import React from "react";
import CustomDatePicker from "./DKG_CustomTimePicker";
import FormInputItem from "./DKG_FormInputItem";

const InputDatePickerComb = ({inputLabel, inputName, inputValue, onChange, dateLabel, dateName, dateValue, required, readOnly}) => {
  return (
    <div className="grid grid-cols-2">
      <FormInputItem
        label={inputLabel}
        name={inputName}
        onChange={onChange}
        required={required ? true : false}
        readOnly={readOnly}
      />
      <CustomDatePicker
        defaultValue={dateValue}
        label={dateLabel}
        name={dateName}
        onChange={onChange}
        readOnly={readOnly}
        required={required ? true : false}
      />
    </div>
  );
};

export default InputDatePickerComb;
