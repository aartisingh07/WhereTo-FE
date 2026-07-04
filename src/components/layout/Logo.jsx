import React from 'react';

const Logo = ({ className = "w-8 h-8" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`${className} transition-all duration-300`} 
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Cyan Glow Filter */}
      <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      {/* Pink Glow Filter */}
      <filter id="glow-pink" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      
      {/* Semi-transparent Pin Gradient */}
      <linearGradient id="pinGradient" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#06b6d4" stopOpacity="0.25" />
        <stop offset="1" stopColor="#0891b2" stopOpacity="0.05" />
      </linearGradient>
    </defs>

    {/* Location Pin Path */}
    <path 
      d="M12 2C7.58 2 4 5.58 4 10C4 15.25 12 22 12 22C12 22 20 15.25 20 10C20 5.58 16.42 2 12 2Z" 
      fill="url(#pinGradient)"
      stroke="#06b6d4" 
      strokeWidth="1.8"
      strokeLinecap="round" 
      strokeLinejoin="round"
      filter="url(#glow-cyan)"
    />

    {/* Connected Friend Nodes inside the Pin */}
    {/* Central Node */}
    <circle cx="12" cy="8.5" r="2.2" fill="#f43f5e" filter="url(#glow-pink)" />
    
    {/* Connection lines to sub-nodes */}
    <line x1="12" y1="10" x2="9.5" y2="13.5" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
    <line x1="12" y1="10" x2="14.5" y2="13.5" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="1.5 1.5" />
    
    {/* Sub Nodes */}
    <circle cx="9.5" cy="13.5" r="1.5" fill="#ec4899" />
    <circle cx="14.5" cy="13.5" r="1.5" fill="#ec4899" />
  </svg>
);

export default Logo;
