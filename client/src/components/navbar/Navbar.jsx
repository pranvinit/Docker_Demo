import "./navbar.css";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <ul className="navlist">
      <li>
        <NavLink activeclassname="active" className="navitem" to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink activeclassname="active" className="navitem" to="/about">
          About
        </NavLink>
      </li>
    </ul>
  );
}
