import { Link, NavLink } from "react-router-dom";

import "./Navbar.css";

import FullLogo from "/src/assets/png/LogoTitle.png";
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
    <div className="nav">
      <nav className="nav-container">
        <div className="nav-logo">
          <img src={FullLogo} alt="Full Logo" height={"60"} />
        </div>
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
            <Link className="signup button-27">Sign Up</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
