import * as React from "react";

import Chipper from "../lib";
import { One } from "./One";
import { Two } from "./Two";

Chipper.createQueue([
  ["user", { uid: "12345", name: "piglet" }],
  ["theme", { dark: true, color: "pink" }],
]);

const styles = {
  container: {
    display: "inline-grid",
    gridTemplateColumns: "auto",
    gridTemplateRows: "auto",
    gap: "4px 4px",
    gridTemplateAreas: ".",
  },
};

export const Main: React.FC = () => {
  return (
    <div style={styles.container}>
      <One />
      <Two />
    </div>
  );
};
