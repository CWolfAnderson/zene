import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './components/Footer';

import Routes from './Routes';

const App = () => (
  <div>
    <BrowserRouter>
      <main>
        <Routes />
        <Footer />
      </main>
    </BrowserRouter>
  </div>
);

export default App;
