import React from 'react'
import { useAppContext } from '../context/appContext'
import StatItem from './StatItem'
import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from 'react-icons/fa'
import styled from 'styled-components'

const StatsContainer = () => {
  const { stats } = useAppContext()

  const defaultStats = [
    {
      title: 'Pending Applications',
      count: stats.pending || 0,
      icon: <FaSuitcaseRolling />,
      color: '#fca311',
      bcg: '#fef3c7',
      borderColor: '#fca311',
    },
    {
      title: 'Interviews Scheduled',
      count: stats.interview || 0,
      icon: <FaCalendarCheck />,
      color: '#647acb',
      bcg: '#e0e8f9',
      borderColor: '#647acb',
    },
    {
      title: 'Jobs Declined',
      count: stats.declined || 0,
      icon: <FaBug />,
      color: '#d66a6a',
      bcg: '#ffeeee',
      borderColor: '#d66a6a',
    },
  ]

  return (
    <Wrapper>
      {defaultStats.map((item, index) => {
        return <StatItem key={index} {...item} />
      })}
    </Wrapper>
  )
}

const Wrapper = styled.section`
  display: grid;
  row-gap: 2rem;
  column-gap: 2rem;
  margin-top: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: 1120px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .stat {
    background: var(--white);
    border-radius: var(--borderRadius);
    padding: 2rem;
    border: 1px solid var(--grey-100);
    transition: all 0.3s ease;
    
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .count {
      display: block;
      font-weight: 700;
      font-size: 2.5rem;
      color: inherit;
    }

    .title {
      margin: 0;
      text-transform: capitalize;
      letter-spacing: var(--letterSpacing);
      text-align: left;
      margin-top: 0.5rem;
      font-size: 1.25rem;
    }

    .icon {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        font-size: 1.5rem;
      }
    }
  }

  .dark-mode & {
    .stat {
      background: var(--dark-card);
      border-color: var(--dark-border);
      color: var(--dark-text);

      .count {
        color: var(--dark-stats-number);
      }

      .title {
        color: var(--dark-text);
      }

      .icon {
        background: var(--dark-background);
      }
    }
  }
`

export default StatsContainer
