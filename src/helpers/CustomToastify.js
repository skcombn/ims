import { toast } from 'react-toastify';
// a wrapper around Chakra UI's useToast that has my default options applied
export const Toast = ({ title, status, customId }) => {
  switch (status) {
    case 'success':
      toast.success(title, {
        position: toast.POSITION.BOTTOM_CENTER,
        toastId: customId,
      });
      break;
    case 'warn':
      toast.warn(title, {
        position: toast.POSITION.BOTTOM_CENTER,
        toastId: customId,
      });
      break;
    case 'warning':
      toast.warn(title, {
        position: toast.POSITION.BOTTOM_CENTER,
        toastId: customId,
      });
      break;
    case 'error':
      toast.error(title, {
        position: toast.POSITION.BOTTOM_CENTER,
        toastId: customId,
      });
      break;
    case 'D':
      toast.info(title, {
        position: toast.POSITION.BOTTOM_CENTER,
        toastId: customId,
      });
      break;
    default:
      toast(title, {
        position: toast.POSITION.BOTTOM_CENTER,
        toastId: customId,
      });
      break;
  }
};
