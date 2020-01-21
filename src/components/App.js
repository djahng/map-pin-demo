import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Map from './Map';
import RegisterCoin from './RegisterCoin';
import ThankYou from './ThankYou';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/map" component={Map} />
        <Route path="/register" component={RegisterCoin} />
        <Route path="/thank-you" component={ThankYou} />
        <Route path="/" component={Map} />
      </Switch>
    </Router>
  );
};

export default App;
