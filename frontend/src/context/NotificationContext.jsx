import { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, ...notification }]);
    
    // Auto remove after timeout
    setTimeout(() => {
      removeNotification(id);
    }, notification.duration || 5000);
    
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const notify = {
    success: (message, options = {}) => 
      addNotification({ type: 'success', message, ...options }),
    error: (message, options = {}) => 
      addNotification({ type: 'error', message, ...options }),
    warning: (message, options = {}) => 
      addNotification({ type: 'warning', message, ...options }),
    info: (message, options = {}) => 
      addNotification({ type: 'info', message, ...options }),
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        addNotification, 
        removeNotification,
        notify
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};