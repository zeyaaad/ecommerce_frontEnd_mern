import React from 'react';
import './CustomModal.css'; // Import your CSS file for styles

const CustomModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Don't render anything if not open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        {children}
      </div>
    </div>
  );
};

export default CustomModal;
