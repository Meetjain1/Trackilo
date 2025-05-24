import styled from 'styled-components'

const Wrapper = styled.section`
  border-radius: var(--borderRadius);
  width: 100%;
  background: var(--white);
  padding: 3rem;
  box-shadow: var(--shadow-2);
  transition: var(--transition);
  border: 1px solid var(--grey-200);

  h3 {
    margin-top: 0;
    margin-bottom: 2rem;
    color: var(--grey-900);
    font-size: 1.75rem;
    font-weight: 600;
    text-transform: capitalize;
  }

  .form {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    padding: 0;
    max-width: 100%;
    width: 100%;
    background: transparent;
    border: none;
  }

  .form-row {
    margin-bottom: 1.5rem;
  }

  .form-label {
    font-size: 1rem;
    margin-bottom: 0.75rem;
    color: var(--grey-700);
    text-transform: capitalize;
    letter-spacing: 0.5px;
  }

  .form-input,
  .form-select {
    height: 45px;
    padding: 0.75rem;
    border-radius: var(--borderRadius);
    background: var(--grey-50);
    border: 1px solid var(--grey-300);
    color: var(--grey-900);
    font-size: 1rem;
    width: 100%;

    &:focus {
      border-color: var(--primary-500);
      box-shadow: 0 0 0 2px var(--primary-50);
    }

    &::placeholder {
      color: var(--grey-400);
    }

    &:disabled {
      background: var(--grey-50);
      border-color: var(--grey-300);
      color: var(--grey-500);
      cursor: not-allowed;
    }
  }

  .form-select {
    padding-right: 2.5rem;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 16px;
  }

  .form-center {
    display: grid;
    row-gap: 1rem;
  }

  .btn-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }

  .btn {
    height: 45px;
    padding: 0.75rem 1.5rem;
    border-radius: var(--borderRadius);
    font-size: 1rem;
    font-weight: 500;
    text-transform: capitalize;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .submit-btn, .btn-block {
    background: var(--primary-500);
    color: var(--white);

    &:hover {
      background: var(--primary-600);
      transform: translateY(-2px);
      box-shadow: var(--shadow-3);
    }

    &:disabled {
      background: var(--grey-300);
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
  }

  .clear-btn {
    background: var(--red-light);
    color: var(--red-dark);
    border: 1px solid var(--red-dark);

    &:hover {
      background: var(--red-dark);
      color: var(--white);
      transform: translateY(-2px);
      box-shadow: var(--shadow-3);
    }
  }

  /* Dark mode styles */
  body.dark-mode & {
    background: var(--dark-card);
    border: 1px solid var(--dark-border);

    h3 {
      color: var(--dark-text);
    }

    .form-label {
      color: var(--dark-text-secondary);
    }

    .form-input,
    .form-select {
      background: var(--dark-input);
      border-color: var(--dark-border);
      color: var(--dark-text);

      &:focus {
        border-color: var(--primary-400);
        box-shadow: 0 0 0 2px rgba(79, 193, 233, 0.2);
      }

      &::placeholder {
        color: var(--dark-text-secondary);
      }

      &:disabled {
        background: var(--dark-background);
        border-color: var(--dark-border);
        color: var(--dark-text-secondary);
      }
    }

    .form-select {
      background-color: var(--dark-input);
      border-color: var(--dark-border);
      color: var(--dark-text);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23b3b3b3' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") !important;
      background-repeat: no-repeat !important;
      background-position: right 0.75rem center !important;
      background-size: 16px !important;
    }

    .submit-btn, .btn-block {
      background: var(--primary-500);
      color: var(--white);

      &:hover {
        background: var(--primary-600);
      }

      &:disabled {
        background: var(--dark-button-disabled);
        color: var(--dark-text-secondary);
        border: 1px solid var(--dark-border);
      }
    }

    .clear-btn {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      border: 1px solid #ef4444;

      &:hover {
        background: #ef4444;
        color: var(--white);
      }
    }
  }

  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
      align-items: center;
      column-gap: 1.5rem;
    }
  }

  @media (min-width: 1120px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
    }
  }
`

export default Wrapper
