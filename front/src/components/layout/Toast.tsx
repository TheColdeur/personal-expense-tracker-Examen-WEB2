import { theme } from '../../assets/theme';

const Toast = () => (
  <div
    style={{
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
      backgroundColor: theme.colors.primary,
      color: theme.colors.background,
      padding: '1rem',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    }}
  >
    🔔 Notification active
  </div>
);

export default Toast;
