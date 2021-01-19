import * as React from "react";

import Chipper, { ChipperOperator } from "../lib";
import { One } from "./One";
import { Two } from "./Two";

Chipper.createQueue([
  ["user", { uid: "12345", name: "piglet" }],
  ["theme", { dark: true, color: "pink" }],
  ["joey", "how you doin?"]
]);

const Other = new ChipperOperator();
Other.createQueue([
  ["user", { uid: "12345", name: "piglet" }],
  ["theme", { dark: true, color: "pink" }],
  ["joey", "how you doin?"]
]);
// console.log(Chipper.queryQueue("theme").get()); // -> { dark: true, color: "pink" }
// Chipper.queryQueue("user").set({ dark: false, color: "purple" }, "theme");
// console.log(Chipper.queryQueue("theme").get()); // -> { dark: false, color: "purple" }
// console.log(Chipper.queryQueue("user").get("theme")); // -> { dark: false, color:

const styles = {
  container: {
    display: "inline-grid",
    gridTemplateColumns: "auto",
    gridTemplateRows: "auto",
    gap: "4px 4px",
    gridTemplateAreas: "."
  }
};

export const Main: React.FC = () => {
  return (
    <div style={styles.container}>
      <One />
      <Two />
    </div>
  );
};
