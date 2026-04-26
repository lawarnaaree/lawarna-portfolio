
import Sidebar from './Sidebar';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-container">
      <Sidebar />
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <h2 className="page-title">Welcome back, Lawarna</h2>
          </div>
          <div className="header-right">
            <div className="admin-profile">
              <div className="profile-info">
                <span className="profile-name">Lawarna Aree</span>
                <span className="profile-role">Administrator</span>
              </div>
              <div className="profile-avatar">
                <span>LA</span>
              </div>
            </div>
          </div>
        </header>
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
