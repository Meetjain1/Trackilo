import styled from 'styled-components'

const Wrapper = styled.section`
  .form {
    width: 100%;
    max-width: 100%;
    background: var(--white);
    border-radius: var(--borderRadius);
    padding: 2rem;
    box-shadow: var(--shadow-2);
    transition: var(--transition);
    margin-bottom: 2rem;
    border: 1px solid var(--grey-200);
  }

  .form-input,
  .form-select,
  .btn-block {
    height: 45px;
    background: var(--grey-50);
    border: 1px solid var(--grey-300);
    color: var(--grey-900);
    border-radius: var(--borderRadius);
    padding: 0.375rem 0.75rem;
    transition: var(--transition);
  }

  .form-input:focus,
  .form-select:focus {
    border-color: var(--primary-500);
    box-shadow: 0 0 0 2px var(--primary-50);
  }

  .form-row {
    margin-bottom: 0;
  }

  .form-center {
    display: grid;
    grid-template-columns: 1fr;
    column-gap: 2rem;
    row-gap: 1rem;
    align-items: center;
  }

  h4 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: var(--grey-900);
    font-weight: 600;
  }

  .btn-block {
    height: 45px;
    margin-top: 0;
  }

  /* Dark mode styles */
  body.dark-mode & {
    .form {
      background: var(--dark-card);
      border: 1px solid var(--dark-border);
    }

    .form-input,
    .form-select,
    .btn-block {
      background: var(--dark-input);
      border-color: var(--dark-border);
      color: var(--dark-text);

      &:focus {
        border-color: var(--primary-400);
        box-shadow: 0 0 0 2px rgba(79, 193, 233, 0.2);
      }
    }

    h4 {
      color: var(--dark-text);
    }

    .clear-btn {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      border: 1px solid #ef4444;

      &:hover {
        background: #ef4444;
        color: var(--white);
        transform: translateY(-2px);
        box-shadow: var(--shadow-3);
  }
    }
  }

  @media (min-width: 768px) {
    .form-center {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (min-width: 992px) {
    .form-center {
      grid-template-columns: repeat(4, 1fr);
    .btn-block {
      margin-top: 0;
      }
    }
  }
`

export default Wrapper
