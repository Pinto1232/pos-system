import React, { memo } from 'react';
import './ErrorModal.css';

interface ErrorModalProps {
  message?: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = memo(({ message, onClose }) => {
  return (
    <div className="error-modal-overlay">
      <div className="error-modal">
        <div className="error-modal-content">
          {}
          <div className="error-icon-container">
            <span className="error-icon">×</span>
          </div>

          {}
          <h2>Error</h2>

          {}
          <p>
            {message ||
              'Oops, something went wrong. Our team is working on it. Please try again later or contact support.'}
          </p>

          {}
          <button onClick={onClose}>Try again</button>
        </div>
      </div>
    </div>
  );
});

ErrorModal.displayName = 'ErrorModal';

export default ErrorModal;
