import { Outlet } from 'react-router-dom'
import styled from 'styled-components'

const SharedLayout = () => {
  return (
    <Wrapper>
          <div className='dashboard-page'>
            <Outlet />
          </div>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  .dashboard-page {
    width: 90vw;
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 2rem 0;
    min-height: calc(100vh - var(--nav-height) - 6rem);
  }
`;

export default SharedLayout
