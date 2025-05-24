import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import styled from 'styled-components';
import { useDarkMode } from '../context/darkModeContext';

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <Wrapper onClick={toggleDarkMode} aria-label="Toggle dark mode">
      <div className="icon-container">
        {isDarkMode ? (
          <FaSun className="icon sun" />
        ) : (
          <FaMoon className="icon moon" />
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: relative;
  padding: 0;

  &:hover {
    background: var(--primary-50);
  }

  .dark-mode & {
    &:hover {
      background: var(--dark-nav-hover);
    }
  }

  .icon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    position: relative;
  }

  .icon {
    font-size: 1.25rem;
    position: absolute;
    transition: all 0.3s ease;
  }

  .sun {
    color: var(--primary-300);
    transform: rotate(0deg) scale(1);
  }

  .moon {
    color: var(--grey-600);
    transform: rotate(0deg) scale(1);
  }

  &:hover .icon {
    transform: rotate(360deg) scale(1.1);
  }

  &:active .icon {
    transform: scale(0.9);
  }
`;

export default DarkModeToggle; 