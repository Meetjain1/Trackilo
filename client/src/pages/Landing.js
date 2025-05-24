import main from '../assets/images/main.svg';
import Wrapper from '../assets/wrappers/LandingPage';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import React from 'react';
import { FaChartLine } from 'react-icons/fa';
import styled from 'styled-components';

const Landing = () => {
  const { user } = useAppContext();
  
  return (
    <React.Fragment>
      {user && <Navigate to='/' />}
      <StyledWrapper>
        <div className='container page'>
          {/* info */}
          <div className='info'>
            <h2 className='tagline'><span className='white-text'>The</span> ultimate</h2>
            <h1>
              Job <span>Tracking</span> App
            </h1>
            <p>
              Track your job applications, interviews, and career progress all in one place.
              Organize your job search efficiently and increase your chances of landing your dream job.
            </p>
            <div className='btn-container'>
              <Link to='/signup' className='btn btn-hero track'>
                <FaChartLine />
                Track Your Jobs
              </Link>
            </div>
          </div>
          <img src={main} alt='job hunt' className='img main-img' />
        </div>
      </StyledWrapper>
    </React.Fragment>
  );
};

const StyledWrapper = styled(Wrapper)`
  .tagline {
    color: var(--primary-500);
    font-size: 3rem;
    margin-bottom: 0.5rem;
    font-family: var(--headingFont);
    
    .white-text {
      color: var(--white);
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    }
  }

  .btn-container {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    flex-wrap: wrap;
  }

  .btn-hero {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    font-weight: 500;
    border-radius: var(--borderRadius);
    text-transform: capitalize;
    transition: all 0.3s ease;
    min-width: 200px;
    
    svg {
      font-size: 1.2rem;
    }
  }

  .track {
    background: var(--primary-500);
    color: var(--white);
    border: 2px solid var(--primary-500);
    font-weight: 600;

    &:hover {
      background: var(--primary-600);
      border-color: var(--primary-600);
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
  }

  /* Dark mode styles */
  body.dark-mode & {
    .tagline {
      color: var(--primary-300);
      
      .white-text {
        color: var(--dark-text);
      }
    }
  }
`;

export default Landing;
