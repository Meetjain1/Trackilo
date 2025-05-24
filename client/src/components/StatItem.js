import React from 'react'
import styled from 'styled-components'

const StatItem = ({ count, title, icon, color, bcg, borderColor }) => {
  return (
    <Wrapper color={color} bcg={bcg} borderColor={borderColor}>
      <header>
        <span className='count'>{count}</span>
        <span className='icon'>{icon}</span>
      </header>
      <h5 className='title'>{title}</h5>
    </Wrapper>
  )
}

const Wrapper = styled.article`
  padding: 2rem;
  background: var(--white);
  border-radius: var(--borderRadius);
  border-bottom: 5px solid ${props => props.borderColor};
  box-shadow: var(--shadow-1);
  transition: var(--transition);

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .count {
    display: block;
    font-weight: 700;
    font-size: 3rem;
    color: ${props => props.color};
    line-height: 1;
  }

  .title {
    margin: 0;
    text-transform: capitalize;
    letter-spacing: var(--letterSpacing);
    text-align: left;
    margin-top: 0.5rem;
    font-size: 1.25rem;
    color: var(--grey-800);
  }

  .icon {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: ${props => props.bcg};
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      font-size: 1.5rem;
      color: ${props => props.color};
    }
  }

  &:hover {
    box-shadow: var(--shadow-3);
    transform: translateY(-3px);
  }

  .dark-mode & {
    background: var(--dark-card);
    border-color: ${props => props.borderColor};
    box-shadow: none;

    .count {
      color: ${props => props.color};
    }

    .title {
      color: var(--dark-text);
    }

    .icon {
      background: ${props => props.bcg};
      svg {
        color: ${props => props.color};
      }
    }

    &:hover {
      box-shadow: var(--shadow-2);
      background: var(--dark-card-hover);
    }
  }
`

export default StatItem
