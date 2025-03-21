import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import AnimatedOutlet from "../animations/AnimatedOutlet";
import { useLocation } from "react-router";

function NavLayout() {
  return (
    <div>
      <NavBar />
      <div>
        <AnimatedOutlet />
      </div>
    </div>
  );
}

export default NavLayout;
