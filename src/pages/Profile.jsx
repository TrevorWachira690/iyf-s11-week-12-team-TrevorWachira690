import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';

function Profile() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      <div className="flex-1 p-4">
        <h2>Profile</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>

        {user.role === 'business' && (
          <>
            <p><strong>Business Name:</strong> {user.businessName}</p>
            <p><strong>Business Type:</strong> {user.businessType}</p>
            <p><strong>WhatsApp:</strong> {user.whatsappNumber}</p>
          </>
        )}

        <button onClick={logout}>Log Out</button>
      </div>

      <Sidebar />
    </div>
  );
}

export default Profile;