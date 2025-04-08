import React from 'react';
import './ErrorModal.css';

interface ErrorModalProps {
  message?: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  message,
  onClose,
}) => {
  return (
    <div className="error-modal-overlay">
      <div className="error-modal">
        <div className="error-modal-content">
          {/* Red Circular Icon */}
          <div className="error-icon-container">
            <span className="error-icon">×</span>
          </div>

          {/* Main Heading */}
          <h2>Error</h2>

          {/* Fallback Message if None Provided */}
          <p>
            {message ||
              'Oops, something went wrong. Our team is working on it. Please try again later or contact support.'}
          </p>

          {/* Action Button */}
          <button onClick={onClose}>
            Try again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
