import styled from 'styled-components'

const Wrapper = styled.section`
  min-height: calc(100vh - var(--nav-height));
  display: grid;
  align-items: center;
  min-height: calc(100vh - var(--nav-height) - 3rem);

  .form {
    max-width: 400px;
    border-top: 5px solid var(--primary-500);
    background: var(--white);
    border-radius: var(--borderRadius);
    box-shadow: var(--shadow-2);
    padding: 2rem 2.5rem;
    margin: 0 auto;
    transition: var(--transition);
    text-align: center;
    position: relative;

    .form-label {
      display: block;
      text-align: left;
      margin-bottom: 0.5rem;
      font-size: 1rem;
      color: var(--grey-700);
    }

    .form-input {
      width: 100%;
      padding: 0.75rem;
      border-radius: var(--borderRadius);
      background: var(--grey-50);
      border: 1px solid var(--grey-200);
      margin-bottom: 1rem;
    }

    .form-row {
      margin-bottom: 1rem;
      text-align: left;
    }
  }

  .logo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
    gap: 1rem;
    width: 100%;

    .logo {
      margin: 0;
      width: fit-content;
    }

    h3 {
      margin: 0;
      color: var(--grey-900);
      font-size: 2.5rem;
      font-weight: 500;
      letter-spacing: 1px;
      line-height: 1;
      width: 100%;
    }
  }

  p {
    margin: 0;
    margin-top: 1rem;
    text-align: center;
    color: var(--grey-600);
  }

  .btn {
    margin-top: 1rem;
  }

  .member-btn {
    background: transparent;
    border: transparent;
    color: var(--primary-500);
    cursor: pointer;
    letter-spacing: var(--letterSpacing);
    padding: 0.25rem;
    transition: var(--transition);

    &:hover {
      color: var(--primary-700);
    }
  }

  /* Dark mode styles */
  .dark-mode & {
    .form {
      background: var(--dark-card);
      border-color: var(--primary-400);
      box-shadow: none;
      border: 1px solid var(--dark-border);

      .form-label {
        color: var(--grey-300);
      }

      .form-input {
        background: var(--dark-input);
        border-color: var(--dark-border);
        color: var(--dark-text);

        &::placeholder {
          color: var(--grey-500);
        }
      }
    }

    h3 {
      color: var(--dark-text);
    }

    p {
      color: var(--dark-text-secondary);
    }

    .member-btn {
      color: var(--primary-400);

      &:hover {
        color: var(--primary-300);
      }
    }
  }
`

export default Wrapper
