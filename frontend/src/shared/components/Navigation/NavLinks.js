import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../../context/auth-context";
import Button from "../FormElements/Button";
import "./NavLinks.css";
const NavLinks = (props) => {
  const authContext = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>
      {authContext.isLoggedIn && (
        <li>
          <NavLink to={`/${authContext.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {authContext.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}
      {!authContext.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      <li>
        {authContext.isLoggedIn && (
          <Button onClick={authContext.logout}>LOGOUT</Button>
        )}
      </li>
    </ul>
  );
};

export default NavLinks;
