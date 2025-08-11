// src/utils/confirmToast.js
import { toast } from 'react-toastify';

export const confirmToast = (message, onConfirm) => {
  toast.info(
    <div>
      <p>{message}</p>
      <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
        <button
          onClick={() => {
            onConfirm();
            toast.dismiss();
          }}
          className="btn btn-success btn-sm"
        >
          Yes
        </button>
        <button
          onClick={() => toast.dismiss()}
          className="btn btn-secondary btn-sm"
        >
          No
        </button>
      </div>
    </div>,
    { autoClose: false, closeOnClick: false }
  );
};
