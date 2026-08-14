import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import {Navigate} from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  
);
}

export default App;