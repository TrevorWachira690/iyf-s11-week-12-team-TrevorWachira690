import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <aside className="hidden md:block w-64 shrink-0 border-l border-gray-200 p-4">
      <h3 className="font-semibold mb-3">Quick Links</h3>
      <nav className="flex flex-col gap-2">
        <Link to="/profile" className="hover:underline">
          My Profile
        </Link>
        <Link to="/" className="hover:underline">
          Home
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;