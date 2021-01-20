import * as React from "react";

import Chipper from "./lib";
import { One } from "./example/One";
import { Two } from "./example/Two";

Chipper.createQueue([
  ["user", { uid: "12345", name: "piglet" }],
  ["theme", { dark: true, color: "pink" }]
]);

export default function App() {
  return (
    <div className="App">
      <One />
      <Two />
    </div>
  );
}
