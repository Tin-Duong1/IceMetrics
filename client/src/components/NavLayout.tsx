import React from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router";

function NavLayout() {
  return (
    <div>
      <NavBar />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default NavLayout;
