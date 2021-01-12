import * as React from 'react';
import { render } from 'react-dom';

import App from './App';
import Chipper from './lib/Chipper';

Chipper.createQueue([
  ['user', { uid: '12345', name: 'piglet' }],
  ['theme', { dark: true, color: 'pink' }],
]);

const rootElement = document.getElementById('root');
render(<App />, rootElement);
