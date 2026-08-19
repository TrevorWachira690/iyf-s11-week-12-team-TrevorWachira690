import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="bg-blue-600 text-white py-20 px-6 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Welcome to CommunityHub
      </h1>
      <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
        Connect with your community, discover local businesses, and grow together.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          to="/register"
          className="bg-white text-blue-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="border border-white text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Log In
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;