import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h2>Welcome to CommunityHub</h2>
      <p>
        <Link to="/login">Log In</Link>
        {' | '}
        <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Home;