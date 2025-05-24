import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styled from 'styled-components';

const FormRow = ({ type, name, value, handleChange, labelText, disabled }) => {
  const [showPassword, setShowPassword] = useState(false);

  console.log(`FormRow ${name} disabled:`, disabled);
  return (
    <Wrapper className='form-row'>
      <label htmlFor={name} className='form-label'>
        {labelText || name}
      </label>
      <div className="input-container">
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          name={name}
          onChange={handleChange}
          className='form-input'
          disabled={disabled}
        />
        {type === 'password' && (
          <button
            type="button"
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  .input-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .form-input {
    width: 100%;
    padding-right: 2.5rem;
    height: 35px;
  }

  .toggle-password {
    position: absolute;
    right: 12px;
    top: 35%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--grey-500);
    transition: all 0.3s ease;
    padding: 0;
    width: 20px;
    height: 20px;
    
    &:hover {
      color: var(--primary-500);
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }

  .dark-mode & {
    .toggle-password {
      color: var(--grey-400);
      
      &:hover {
        color: var(--primary-300);
      }
    }
  }
`;

export default FormRow
