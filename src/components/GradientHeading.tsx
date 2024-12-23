import React from 'react';

const GradientHeading: React.FC = () => {
  return (
    <h2
      className="text-2xl font-bold mb-4 leading-none"
      style={{
        fontFamily: 'Bayon, sans-serif',
        fontSize: '50px',
        background: 'linear-gradient(to bottom, #994C4C, #FF7F7F)', 
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'left',
        lineHeight: '1em',
        transform: 'scaleY(1.3)',
        paddingBottom: '30px',
        paddingTop: '20px'
      }}
    >
      YOUR MEAL <br /> YOUR WAY <br /> RIGHT AWAY
    </h2>
  );
};

export default GradientHeading;
