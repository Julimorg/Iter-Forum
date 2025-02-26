import React from "react";
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
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        required={required}
        aria-required={required}
        autoComplete={autoComplete}
      />
    </div>
  );
};

export default TextField;
