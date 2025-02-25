import React, { useState } from "react";
import styles from "./TextField.module.css";

interface FormGroupProps {
  label: string;
  type: string;
  id: string;
  required?: boolean;
  autoComplete?: string;
}

const TextField: React.FC<FormGroupProps> = ({
  label,
  type,
  id,
  required = false,
  autoComplete,
}) => {
  const [value, setValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        value={value} // Controlled component
        onChange={handleChange} // Cập nhật state khi nhập
        required={required}
        aria-required={required}
        autoComplete={autoComplete}
      />
    </div>
  );
};

export default TextField;