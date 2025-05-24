import React from 'react'
import moment from 'moment'
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/appContext'
import styled from 'styled-components'

const Job = ({
  _id,
  position,
  company,
  jobLocation,
  jobType,
  createdAt,
  status,
}) => {
  const { setEditJob, deleteJob } = useAppContext()

  let date = moment(createdAt)
  date = date.format('MMM Do, YYYY')

  return (
    <Wrapper>
      <header>
        <div className='main-icon'>{company.charAt(0)}</div>
        <div className='info'>
          <h5>{position}</h5>
          <p>{company}</p>
        </div>
      </header>
      <div className='content'>
        <div className='content-center'>
          <div className='job-info'>
            <span className='icon'><FaLocationArrow /></span>
            <span className='text'>{jobLocation}</span>
          </div>
          <div className='job-info'>
            <span className='icon'><FaCalendarAlt /></span>
            <span className='text'>{date}</span>
          </div>
          <div className='job-info'>
            <span className='icon'><FaBriefcase /></span>
            <span className='text'>{jobType}</span>
          </div>
          <div className={`status ${status}`}>{status}</div>
        </div>
        <footer>
          <div className='actions'>
            <Link
              to='/add-job'
              className='btn edit-btn'
              onClick={() => setEditJob(_id)}
            >
              Edit
            </Link>
            <button
              type='button'
              className='btn delete-btn'
              onClick={() => deleteJob(_id)}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.article`
  background: var(--white);
  border-radius: var(--borderRadius);
  box-shadow: var(--shadow-2);
  transition: var(--transition);
  padding: 2rem;
  margin-bottom: 2rem;

  header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .main-icon {
    width: 60px;
    height: 60px;
    display: grid;
    place-items: center;
    background: var(--primary-500);
    border-radius: var(--borderRadius);
    font-size: 1.5rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--white);
  }

  .info {
    h5 {
      margin-bottom: 0.5rem;
      color: var(--grey-900);
    }
    p {
      margin: 0;
      color: var(--grey-600);
      letter-spacing: var(--letterSpacing);
    }
  }

  .content {
    padding: 1rem 0;
  }

  .content-center {
    display: grid;
    margin-top: 1rem;
    margin-bottom: 1.5rem;
    grid-template-columns: 1fr;
    row-gap: 1.5rem;
    align-items: center;
    @media (min-width: 576px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  .job-info {
    display: flex;
    align-items: center;
    gap: 1rem;

    .icon {
      font-size: 1rem;
      display: flex;
      align-items: center;
      color: var(--grey-600);
    }
    .text {
      color: var(--grey-600);
      letter-spacing: var(--letterSpacing);
    }
  }

  .status {
    border-radius: var(--borderRadius);
    text-transform: capitalize;
    letter-spacing: var(--letterSpacing);
    text-align: center;
    width: 100px;
    height: 30px;
    display: grid;
    place-items: center;
    color: var(--white);
    font-size: 0.85rem;
  }

  .pending {
    background: #fef3c7;
    color: #f59e0b;
  }

  .interview {
    background: #e0e8f9;
    color: #647acb;
  }

  .declined {
    background: #ffeeee;
    color: #d66a6a;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .edit-btn,
  .delete-btn {
    height: 30px;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
  }

  &:hover {
    box-shadow: var(--shadow-3);
    transform: translateY(-2px);
  }

  /* Dark mode styles */
  .dark-mode & {
    background: var(--dark-card);
    box-shadow: none;
    border: 1px solid var(--dark-border);

    .main-icon {
      background: var(--primary-400);
    }

    .info {
      h5 {
        color: var(--dark-text);
      }
      p {
        color: var(--dark-text-secondary);
      }
    }

    .job-info {
      .icon {
        color: var(--dark-text-secondary);
      }
      .text {
        color: var(--dark-text-secondary);
      }
    }

    .status {
      &.pending {
        background: rgba(254, 243, 199, 0.1);
        color: #fcd34d;
      }
      &.interview {
        background: rgba(224, 232, 249, 0.1);
        color: #818cf8;
      }
      &.declined {
        background: rgba(255, 238, 238, 0.1);
        color: #f87171;
      }
    }

    .edit-btn {
      background: var(--primary-400);
      color: var(--dark-text);
      &:hover {
        background: var(--primary-500);
      }
    }

    .delete-btn {
      background: rgba(220, 38, 38, 0.1);
      color: #ef4444;
      &:hover {
        background: rgba(220, 38, 38, 0.2);
      }
    }

    &:hover {
      box-shadow: var(--shadow-2);
      background: var(--dark-card-hover);
    }
  }
`

export default Job
