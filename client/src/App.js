import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './Routes';

const App = () => (
  <div>
    <BrowserRouter>
      <main>
        <Routes />
      </main>
    </BrowserRouter>
  </div>
);

export default App;
