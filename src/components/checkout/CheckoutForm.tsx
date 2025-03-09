import React from "react";
import styles from "./CheckoutForm.module.css";
import { CheckoutFormProps } from "./CheckoutFormInterfaces";

const CheckoutForm: React.FC<CheckoutFormProps> = ({
    title,
    checkoutFields,
    orderSummaryTitle,
    orderSummaryItems,
    formData,
    onChange,
    onSubmit,
}) => {
    return (
        <div className={styles.checkoutContainer}>
            {/* Left side: Form */}
            <div className={styles.checkoutLeft}>
                <h2>{title}</h2>
                <form onSubmit={onSubmit}>
                    {checkoutFields.map((field) => (
                        <div key={field.name} className={styles.formGroup}>
                            <label>
                                {field.label}
                                {field.required && " *"}
                            </label>
                            <input
                                type={field.type ?? "text"}
                                name={field.name}
                                required={field.required}
                                value={formData[field.name] || ""}
                                onChange={onChange}
                            />
                        </div>
                    ))}
                </form>
            </div>

            {/* Right side: Order Summary */}
            <div className={styles.checkoutRight}>
                <h2>{orderSummaryTitle}</h2>
                {orderSummaryItems.map((item, index) => (
                    <p key={index}>
                        <strong>{item.label}:</strong> {item.value}
                    </p>
                ))}
                <button type="submit" onClick={onSubmit}>
                    Checkout
                </button>
            </div>
        </div>
    );
};

export default CheckoutForm;
