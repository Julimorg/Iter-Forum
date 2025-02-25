import React, { useState } from "react";
import styles from "./Passwordstyle.module.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface PasswordFieldProps {
  id: string;
  label: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ id, label }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <div className={styles.formGroup}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.inputWrapper}>
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          value={value}
          onChange={handleChange}
          required
          aria-required="true"
          aria-describedby={`${id}-description ${id}-requirements ${id}-error`}
          autoComplete="new-password"
        />
        <button
          type="button"
          className={styles.passwordToggle}
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label="Toggle password visibility"
          aria-pressed={showPassword}
        >
          {showPassword ? (
            <i className="fa-regular fa-eye-slash"></i>
          ) : (
            <i className="fa-regular fa-eye"></i>
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;
