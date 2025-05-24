import styled from 'styled-components'
import logo from '../assets/images/logo.svg'

const LogoWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 300px;

  .logo-img {
    position: absolute;
    left: 15%;
    width: 40px;
    height: 40px;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.1);
    }
  }

  .logo-text {
    font-family: var(--headingFont);
    font-weight: bold;
    letter-spacing: 1px;
    color: var(--grey-900);
    font-size: 2.25rem;
    margin: 0;
    text-transform: none;
    line-height: 1;
    transform: translateX(10px);
    
    &::first-letter {
      text-transform: uppercase;
    }
    
    .dark-mode & {
      color: var(--grey-200);
    }
  }

  &.large {
    .logo-img {
      width: 50px;
      height: 50px;
    }
    .logo-text {
      font-size: 2.5rem;
    }
  }

  &.small {
    .logo-img {
      width: 32px;
      height: 32px;
    }
    .logo-text {
      font-size: 1.75rem;
    }
  }

  &.icon-only {
    .logo-text {
      display: none;
    }
  }

  &.with-text {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    .logo-text {
      display: block;
    }
  }

  &.navbar-logo {
    width: auto;
    max-width: none;
    justify-content: flex-start;
    gap: 0.5rem;
    
    .logo-img {
      position: static;
      margin-right: 10px;
    }
    
    .logo-text {
      transform: none;
      position: relative;
      left: 0;
    }
  }
`

const Logo = ({ className }) => {
  return (
    <LogoWrapper className={className}>
      <img src={logo} alt='trackilo' className='logo-img' />
      <span className='logo-text'>trackilo</span>
    </LogoWrapper>
  )
}

export default Logo
