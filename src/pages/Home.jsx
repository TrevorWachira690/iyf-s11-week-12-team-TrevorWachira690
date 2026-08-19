import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import SEO from '../components/SEO';


function Home() {
  return (
    <div>
      <SEO title="CommunityHub - Home" description="Connect with your community and discover local businesses." />
      <HeroSection />
    </div>
  );
}

export default Home;