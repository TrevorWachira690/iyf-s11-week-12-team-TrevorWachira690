import React from 'react';
import { Link } from 'react-router-dom';

const HERO_IMAGE = 'https://interiordesign.net/wp-content/uploads/2023/03/Interior-Design-Estudio-Montevideo-Cordiez-Cordoba-g.jpg';

export default function HeroSection() {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-8 shadow-2xl">
      <img
        src={HERO_IMAGE}
        alt="TBM-DeepIn Marketplace"
        className="w-full h-64 sm:h-80 md:h-96 object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      
      <div className="relative z-10 flex flex-col justify-end p-4 sm:p-6 md:p-8 text-white">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
          Discover Local Businesses
        </h2>
        <p className="text-sm sm:text-base mb-4 text-gray-200">
          Browse, compare, and connect with verified sellers in your community
        </p>
        <Link
          to="/"
          className="inline-block bg-white/90 hover:bg-white text-indigo-700 font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-lg"
        >
          Browse Listings
        </Link>
      </div>
    </div>
  );
}