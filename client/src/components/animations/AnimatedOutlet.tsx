// AnimatedOutlet.tsx

import { AnimatePresence } from "framer-motion";
import React from "react";
import { useLocation, useOutlet } from "react-router";

// Using the element from the useOutlet hook
// we can render the pages as direct children with their unique keys
const AnimatedOutlet = (): React.JSX.Element => {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={true}>
      {element && React.cloneElement(element, { key: location.pathname })}
    </AnimatePresence>
  );
};

export default AnimatedOutlet;
