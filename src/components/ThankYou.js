import React from 'react';
import { Link } from 'react-router-dom';

const ThankYou = () => {
  return (
    <div className="container">
      <h1 className="title">Thank You!</h1>

      <p>
        <Link to="/">See the map here.</Link>
      </p>
    </div>
  );
};

export default ThankYou;
