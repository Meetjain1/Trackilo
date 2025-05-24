import React from 'react';
import styled from 'styled-components';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Wrapper>
      <div className="footer-content">
        <div className="footer-section">
          <h3>Meet jain</h3>
          <p>Copyright © {currentYear}</p>
        </div>
        
        <div className="social-links">
          <a href="https://github.com/Meetjain1" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub />
          </a>
          <a href="https://twitter.com/Meetjain_100" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href="https://www.linkedin.com/in/meet-jain-413015265/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="https://www.instagram.com/m.jain_17/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.footer`
  background: var(--white);
  border-top: 1px solid var(--grey-100);
  padding: 2rem 0;
  transition: all 0.3s ease;

  .dark-mode & {
    background: var(--dark-background-secondary);
    border-top: 1px solid var(--dark-border);
  }

  .footer-content {
    width: 90vw;
    max-width: var(--max-width);
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 2rem;
  }

  .footer-section {
    h3 {
      color: var(--primary-500);
      margin-bottom: 0.5rem;
      font-size: 1.5rem;

      .dark-mode & {
        color: var(--primary-300);
      }
    }

    p {
      color: var(--grey-500);
      margin: 0;
      font-size: 0.875rem;

      .dark-mode & {
        color: var(--dark-text-secondary);
      }
    }
  }

  .social-links {
    display: flex;
    gap: 1.5rem;
    font-size: 1.5rem;

    a {
      color: var(--grey-500);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: var(--primary-500);
        transform: translateY(-3px);
      }

      .dark-mode & {
        color: var(--dark-text-secondary);

        &:hover {
          color: var(--primary-300);
        }
      }
    }
  }

  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column;
      text-align: center;
      gap: 1.5rem;
    }

    .social-links {
      justify-content: center;
    }
  }
`;

export default Footer; 