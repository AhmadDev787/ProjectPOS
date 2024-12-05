
import React, { useEffect, useState } from 'react';

const Alert = ({ message }) => {
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    // Set a timer to hide the alert after 5 seconds
    const timer = setTimeout(() => {
      setShowAlert(false);
    }, 4000); // 5000 ms = 5 seconds

    // Clean up the timer when the component is unmounted or when message changes
    return () => clearTimeout(timer);
  }, [message]); // Effect will run again if message prop changes

  if (!showAlert) {
    return null; // If showAlert is false, don't render the alert
  }

  return (
    <div className="p-2 bg-red-500 text-white m-2" style={{ display: 'inline', position: 'absolute' }}>
      <span>{message}</span>
    </div>
  );
};

export default Alert;
