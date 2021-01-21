import React from 'react';


import Chipper from "./lib";

Chipper.createQueue([
  ["user", { uid: "12345", name: "piglet" }],
  ["theme", { dark: true, color: "pink" }]
]);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
