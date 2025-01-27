import React, { useState } from "react";

import { NavLink } from "react-router-dom";

import "./Navbar.css";

interface NavItem {
  name: string;
  path: string;
}

const NavLinks: NavItem[] = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

function Navbar() {
  return (
    <nav className="nav-container">
      <div className="nav-logo">Logo</div>
      <ul className="nav-list">
        {NavLinks.map((item, index) => (
          <li key={index} className="nav-item">
            <NavLink
              to={item.path}
              className="nav-link"
              activeClassName="active"
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
      <ul className="nav-login">
        <li>
          <NavLink to={"/login"} className="login">
            Log In
          </NavLink>
        </li>
        <li>
          <NavLink to={"/signup"} className="signup">
            Sign Up
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
