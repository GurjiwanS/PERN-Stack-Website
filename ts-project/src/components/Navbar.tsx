import React from "react";
import { Link, NavLink } from "react-router-dom";
import "../App.css";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-transparent">
      <a className="navbar-brand ms-3 fs-5 h1 mb-1" href="#">
        THE BARBER
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className="collapse navbar-collapse justify-content-center"
        style={{ position: "relative", left: "-9.5%" }}
        id="navbarNav"
      >
        <ul className="navbar-nav fs-5">
          <li className="nav-item ms-4 me-4">
            <NavLink className="nav-link" to="/">
              Startsida
            </NavLink>
          </li>
          <li className="nav-item ms-4 me-4">
            <NavLink
              className={({ isActive, isPending }) =>
                isActive ? "activeNavbar nav-link" : "nav-link"
              }
              to="/boka"
            >
              Boka
            </NavLink>
          </li>
          <li className="nav-item ms-4 me-4">
            <NavLink className="nav-link" to="/priser">
              Priser
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
