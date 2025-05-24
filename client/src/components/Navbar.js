import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaChartBar, FaBriefcase, FaPlus, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import DarkModeToggle from './DarkModeToggle';
import { useAppContext } from '../context/appContext';
import Logo from './Logo';
import Wrapper from '../assets/wrappers/Navbar';

const Navbar = () => {
  const { user, logoutUser } = useAppContext();

  return (
    <Wrapper>
      <div className="nav-center">
        <div className="logo-container">
          <Link to="/">
            <Logo className="navbar-logo" />
          </Link>
        </div>

        {user && (
          <div className="nav-links">
            <Link to="/stats" className="nav-link">
              <FaChartBar className="nav-icon" />
              <span>Dashboard</span>
            </Link>
            <Link to="/all-jobs" className="nav-link">
              <FaBriefcase className="nav-icon" />
              <span>All Jobs</span>
            </Link>
            <Link to="/add-job" className="nav-link">
              <FaPlus className="nav-icon" />
              <span>Add Job</span>
            </Link>
          </div>
        )}

        <div className="nav-controls">
          <DarkModeToggle />
          {user ? (
            <div className="user-controls">
              <Link to="/profile" className="profile-link">
                <FaUserCircle className="nav-icon" />
                <span>{user.name}</span>
              </Link>
              <button className="logout-btn" onClick={logoutUser}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-controls">
              <Link to="/login" className="auth-btn login-btn">
                <FaSignInAlt className="nav-icon" />
                <span>Login</span>
              </Link>
              <Link to="/signup" className="auth-btn signup-btn">
                <FaUserPlus className="nav-icon" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default Navbar;
