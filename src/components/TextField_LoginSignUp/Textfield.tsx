import React from "react";
import styles from "./TextField.module.css";

interface FormGroupProps {
  label: string;
  type: string;
  id: string;
  required?: boolean;
  autoComplete?: string;
  value?: string;
  onChange?:  (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextField: React.FC<FormGroupProps> = ({
  label,
  type,
  id,
  required = false,
  autoComplete,
  value,
  onChange
}) => {
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        required={required}
        aria-required={required}
        autoComplete={autoComplete}
        value={value || ''}
        onChange={onChange}
      />
    </div>
  );
};

export default TextField;
