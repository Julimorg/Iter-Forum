import React from "react";
import styles from "./TextFieldOnlyNumber.module.css";

interface TextFieldProps {
    label: string;
    id: string;
    required?: boolean;
    autoComplete?: string;
    value: number;
    onChange: (value: number) => void;
}

const InputNum: React.FC<TextFieldProps> = ({
    label,
    id,
    required = false,
    autoComplete = "",
    value,
    onChange,
}) => {
    return (
        <div className={styles.formGroup}>
            <label htmlFor={id}>{label}</label>
            <input
                type="number"
                id={id}
                name={id}
                value={value}
                required={required}
                autoComplete={autoComplete}
                onChange={(e) => onChange(Number(e.target.value))}
            />
        </div>
    );
};

export default InputNum;
