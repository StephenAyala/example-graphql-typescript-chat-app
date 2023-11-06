import React from "react";

// Define the types for the props that NavBar will receive
type NavBarProps = {
  user: string | null; // assuming user is of type string or can be null
  onLogout: () => void; // onLogout is a function that takes no arguments and returns nothing
};

// NavBar component using arrow function syntax and destructuring props
const NavBar: React.FC<NavBarProps> = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <p className="navbar-item is-size-5 has-text-weight-bold">
          GraphQL Chat
        </p>
      </div>
      <div className="navbar-end">
        {Boolean(user) && (
          <div className="navbar-item">
            <button className="button is-link" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
