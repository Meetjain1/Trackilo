import { useState, useEffect } from 'react';
import { Logo, FormRow, Alert } from '../components';
import Wrapper from '../assets/wrappers/RegisterPage';
import { useAppContext } from '../context/appContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import styled from 'styled-components';

const initialState = {
  name: '',
  email: '',
  password: '',
};

const Signup = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialState);
  const { user, isLoading, showAlert, displayAlert, setupUser, loginWithGoogle } = useAppContext();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password } = values;
    if (!email || !password || !name) {
      displayAlert();
      return;
    }
    const currentUser = { name, email, password };
    setupUser({
      currentUser,
      endPoint: 'register',
      alertText: 'User Created! Redirecting...',
    });
  };

  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google authentication failed:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [user, navigate]);

  return (
    <StyledWrapper className='full-page'>
      <form className='form' onSubmit={onSubmit}>
        <div className='logo-container'>
          <Logo />
          <h3>Sign Up</h3>
        </div>
        {showAlert && <Alert />}
        <FormRow
          type='text'
          name='name'
          value={values.name}
          handleChange={handleChange}
        />
        <FormRow
          type='email'
          name='email'
          value={values.email}
          handleChange={handleChange}
        />
        <FormRow
          type='password'
          name='password'
          value={values.password}
          handleChange={handleChange}
        />
        <button type='submit' className='btn btn-block' disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Sign Up'}
        </button>
        
        <div className='divider'>
          <span>or</span>
        </div>

        <button 
          type='button'
          onClick={handleGoogleAuth} 
          className='btn btn-block google-btn'
          disabled={isLoading}
        >
          <FaGoogle /> Sign up with Google
        </button>

        <p>
          Already have an account?{' '}
          <Link to='/login' className='member-btn'>
            Login
          </Link>
        </p>
      </form>
    </StyledWrapper>
  );
};

const StyledWrapper = styled(Wrapper)`
  .divider {
    text-align: center;
    margin: 1rem 0;
    position: relative;
    
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 45%;
      height: 1px;
      background-color: var(--grey-200);
    }
    
    &::before {
      left: 0;
    }
    
    &::after {
      right: 0;
    }
    
    span {
      background-color: var(--white);
      padding: 0 1rem;
      color: var(--grey-500);
      text-transform: uppercase;
      font-size: 0.85rem;
    }
  }

  .google-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: var(--white);
    color: var(--grey-700);
    border: 2px solid var(--grey-200);
    
    &:hover {
      background: var(--grey-50);
      border-color: var(--grey-300);
      color: var(--grey-900);
    }
    
    svg {
      color: #4285f4;
      font-size: 1.2rem;
    }
  }

  body.dark-mode & {
    .divider {
      span {
        background-color: var(--grey-900);
      }
    }

    .google-btn {
      background: var(--grey-900);
      color: var(--white);
      border-color: var(--grey-700);

      &:hover {
        background: var(--grey-800);
        border-color: var(--grey-600);
      }

      svg {
        color: #4285f4;
      }
    }
  }
`;

export default Signup;
