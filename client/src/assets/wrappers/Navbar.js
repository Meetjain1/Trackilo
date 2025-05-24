import styled from 'styled-components'

const Wrapper = styled.nav`
  height: var(--nav-height);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 0px 0px rgba(0, 0, 0, 0.1);
  background: var(--white);
  transition: var(--transition);
  padding: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  .nav-center {
    display: flex;
    width: 90vw;
    align-items: center;
    justify-content: space-between;
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: 3rem;
    margin-left: 2rem;

    .logo {
      display: flex;
      align-items: center;
      gap: 2.5rem;
      width: auto;
      max-width: none;
      justify-content: flex-start;
      position: relative;

      .logo-img {
        position: static;
        width: 40px;
        height: 40px;
      }

      .logo-text {
        transform: none;
        margin-left: 15px;
        font-size: 2.25rem;
      }
    }
  }

  .toggle-btn {
    background: transparent;
    border-color: transparent;
    font-size: 1.75rem;
    color: var(--primary-500);
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .btn-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--grey-500);
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.3s ease;
    text-transform: capitalize;
    padding: 0.5rem 1rem;
    border-radius: var(--borderRadius);
    
    &:hover {
      color: var(--primary-500);
      background: var(--primary-50);
    }

    &.active {
      color: var(--primary-500);
      background: var(--primary-50);
    }
  }

  .nav-controls {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .auth-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .auth-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: var(--borderRadius);
    font-weight: 500;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }

  .login-btn {
    background: transparent;
    border: 1.5px solid var(--primary-500);
    color: var(--primary-500);

    &:hover {
      background: var(--primary-500);
      color: var(--white);
      transform: translateY(-2px);
    }
  }

  .signup-btn {
    background: var(--primary-500);
    color: var(--white);
    border: 1.5px solid var(--primary-500);

    &:hover {
      background: var(--primary-600);
      border-color: var(--primary-600);
      transform: translateY(-2px);
    }
  }

  .user-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .profile-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--grey-600);
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: var(--borderRadius);
    transition: all 0.3s ease;
    
    svg {
      font-size: 1.5rem;
    }

    &:hover {
      color: var(--primary-500);
      background: var(--primary-50);
    }
  }

  .logout-btn {
    background: transparent;
    border: 1.5px solid var(--red-dark);
    color: var(--red-dark);
    font-weight: 500;
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: var(--borderRadius);
    transition: all 0.3s ease;

    &:hover {
      background: var(--red-dark);
      color: var(--white);
      transform: translateY(-2px);
    }
  }

  /* Dark mode styles */
  .dark-mode & {
    background: var(--dark-background);
    box-shadow: 0 1px 0px 0px var(--dark-border);

    .toggle-btn {
      color: var(--primary-400);
    }

    .nav-link {
      color: var(--grey-300);
      
      &:hover {
        color: var(--primary-300);
        background: rgba(79, 193, 233, 0.1);
      }

      &.active {
        color: var(--primary-300);
        background: rgba(79, 193, 233, 0.1);
      }
    }

    .login-btn {
      border-color: var(--primary-300);
      color: var(--primary-300);

      &:hover {
        background: var(--primary-300);
        color: var(--dark-background);
      }
    }

    .signup-btn {
      background: var(--primary-300);
      border-color: var(--primary-300);
      color: var(--dark-background);

      &:hover {
        background: var(--primary-400);
        border-color: var(--primary-400);
      }
    }

    .profile-link {
      color: var(--grey-300);
      
      &:hover {
        color: var(--primary-300);
        background: rgba(79, 193, 233, 0.1);
      }
    }

    .logout-btn {
      border-color: var(--red-300);
      color: var(--red-300);
      
      &:hover {
        background: var(--red-300);
        color: var(--dark-background);
      }
    }
  }

  @media (min-width: 992px) {
    position: sticky;
    top: 0;
  }

  @media (max-width: 992px) {
    .logo-text {
      font-size: 2rem;
    }

    .nav-links {
      gap: 1.5rem;
      
      .nav-link {
        padding: 0.5rem;
      }
    }

    .nav-controls {
      gap: 1rem;
    }
  }

  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }

    .nav-controls {
      gap: 0.75rem;
    }

    .user-controls {
      gap: 0.75rem;
    }

    .profile-link span {
      display: none;
    }

    .logout-btn {
      padding: 0.5rem;
    }
  }
`

export default Wrapper

