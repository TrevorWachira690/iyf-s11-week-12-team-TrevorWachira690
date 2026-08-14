import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function Profile() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
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
  );
}

export default Profile;