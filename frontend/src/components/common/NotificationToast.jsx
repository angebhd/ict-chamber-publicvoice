import { useNotification } from '../../context/NotificationContext';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiXCircle, FiX } from 'react-icons/fi';

const NotificationToast = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="h-5 w-5 text-success" />;
      case 'error':
        return <FiAlertCircle className="h-5 w-5 text-error" />;
      case 'warning':
        return <FiInfo className="h-5 w-5 text-warning" />;
      default:
        return <FiInfo className="h-5 w-5 text-primary" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success-light border-l-4 border-success';
      case 'error':
        return 'bg-error-light border-l-4 border-error';
      case 'warning':
        return 'bg-warning-light border-l-4 border-warning';
      default:
        return 'bg-primary-50 border-l-4 border-primary';
    }
  };

  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 space-y-2 md:max-w-sm w-full pointer-events-none">
      {notifications.map((notification) => (
        <div 
          key={notification.id}
          className={`animate-slide-up pointer-events-auto ${getBgColor(notification.type)} rounded-r-lg p-4 shadow-md flex items-start gap-3`}
        >
          <div className="flex-shrink-0">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-sm font-medium text-neutral-900">
              {notification.message}
            </p>
          </div>
          <button 
            className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
            onClick={() => removeNotification(notification.id)}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;