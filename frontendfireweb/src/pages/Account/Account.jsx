import React, { useState } from 'react';
import './Account.css';
import {
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit, Logout } from '@mui/icons-material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import EditUserModal from '../../components/EditAccountModal/EditAccountModal';

const Account = () => {
  const [user, setUser] = useState({
    name: 'ABC Nguyễn Văn',
    email: 'abc12345@gmail.com',
    phone: '123456789',
    address: '334 Nguyễn Trãi, Thanh Xuân, Hà Nội',
  });

  const [userInfo, setUserInfo] = useState(user);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleEditSave = (newData) => {
    setUser(newData);
    setUserInfo(newData);
    setSnackbarOpen(true);
  };

  const handleDownload = () => {
    const blob = new Blob(['Demo video content'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'free_fire_abc_video.mp4';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="user-container">
      <div className="account-box">
        <div className="account-header">
          <h2>Tài khoản</h2>
          <IconButton>
            <Logout />
          </IconButton>
        </div>

        <div className="account-content">
          <div className="account-name">
            <AccountCircleOutlinedIcon className='account-avatar'/>
            <span className="name-input">{user.name}</span>
            <IconButton onClick={() => setEditModalVisible(true)} style={{ color: 'white' }}>
              <Edit />
            </IconButton>
          </div>

          <div className="account-details">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>SĐT:</strong> {user.phone}</p>
            <p><strong>Địa chỉ:</strong> {user.address}</p>
          </div>
        </div>
      </div>

      <div className="history-box">
        <h3>Lịch sử người dùng:</h3>
        <div className="history-table">
          <div className="table-header">
            <span>Ngày</span>
            <span>Giờ</span>
            <span>Video</span>
          </div>
          <div className="table-row">
            <span>05/03/2025</span>
            <span>21:00</span>
            <span className="video-name">Free fire abc video...</span>
            <IconButton onClick={handleDownload}>
             <SaveAltOutlinedIcon style={{ color: "#60477D" }} />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Modal chỉnh sửa */}
      <EditUserModal
        isVisible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        userInfo={userInfo}
        onSave={handleEditSave}
      />

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
        >
          Cập nhật thành công!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Account;
