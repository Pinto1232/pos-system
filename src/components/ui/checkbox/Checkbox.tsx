import React from 'react';

interface CheckboxProps {
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    disabled?: boolean;
    className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, disabled, className }) => {
    return (
        <div className={`checkbox-container ${className}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="checkbox-input"
            />
            {label && <label className="checkbox-label">{label}</label>}
        </div>
    );
};

export default Checkbox;