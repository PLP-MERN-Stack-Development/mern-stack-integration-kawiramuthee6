import React from 'react';

const Alert = ({ type = 'error', message, onClose }) => {
  const styles = {
    error: 'bg-destructive/10 border-destructive/20 text-destructive-foreground',
    success: 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400',
  };

  const icons = {
    error: '❌',
    success: '✅',
    warning: '⚠️'
  };

  return (
    <div className={`${styles[type]} border rounded-lg p-4 mb-4 flex items-center justify-between`}>
      <div className="flex items-center space-x-2">
        <span>{icons[type]}</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors text-lg"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Alert;