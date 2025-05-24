import { useState, useEffect } from 'react'
import { FormRow, Alert } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'
import styled from 'styled-components'

const Profile = () => {
  const { user, showAlert, displayAlert, updateUser, isLoading } = useAppContext()

  const [isEditing, setIsEditing] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showNoChangesDialog, setShowNoChangesDialog] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    lastName: user?.lastName || '',
    location: user?.location || ''
  })

  // Reset form data when user changes
  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      lastName: user?.lastName || '',
      location: user?.location || ''
    })
  }, [user])

  const handleChange = (e) => {
    const newFormData = { ...formData, [e.target.name]: e.target.value }
    setFormData(newFormData)
    
    // Check if any field is different from the original user data
    const hasAnyChange = 
      newFormData.name !== user.name ||
      newFormData.email !== user.email ||
      newFormData.lastName !== user.lastName ||
      newFormData.location !== user.location
    
    setHasChanges(hasAnyChange)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setHasChanges(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      lastName: user?.lastName || '',
      location: user?.location || ''
    })
    setIsEditing(false)
    setHasChanges(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.lastName || !formData.location) {
      displayAlert()
      return
    }

    if (!hasChanges) {
      setShowNoChangesDialog(true)
      return
    }

    setShowConfirmDialog(true)
  }

  const confirmSave = () => {
    updateUser(formData)
    setShowConfirmDialog(false)
    setIsEditing(false)
    setHasChanges(false)
  }

  return (
    <Wrapper>
      <form className='form' onSubmit={handleSubmit}>
        <h3>{isEditing ? 'Edit Profile' : 'Profile'}</h3>
        {showAlert && <Alert />}
        <div className='form-center'>
          <FormRow
            type='text'
            name='name'
            value={formData.name}
            handleChange={handleChange}
            disabled={!isEditing}
          />
          <FormRow
            type='text'
            labelText='last name'
            name='lastName'
            value={formData.lastName}
            handleChange={handleChange}
            disabled={!isEditing}
          />
          <FormRow
            type='email'
            name='email'
            value={formData.email}
            handleChange={handleChange}
            disabled={!isEditing}
          />
          <FormRow
            type='text'
            name='location'
            value={formData.location}
            handleChange={handleChange}
            disabled={!isEditing}
          />
          
          <div className='btn-container'>
            {!isEditing ? (
              <button 
                type='button' 
                className='btn btn-block submit-btn'
                onClick={handleEdit}
              >
                Edit Profile
              </button>
            ) : (
              <div className='btn-group'>
                <button
                  type='submit'
                  className='btn btn-block submit-btn'
                  disabled={isLoading}
                >
                  {isLoading ? 'Please Wait...' : 'Save Changes'}
                </button>
                <button
                  type='button'
                  className='btn btn-block clear-btn'
                  onClick={handleCancel}
                >
                  Cancel
          </button>
              </div>
            )}
          </div>
        </div>
      </form>

      {showConfirmDialog && (
        <ConfirmDialog>
          <div className="confirm-content">
            <h4>Confirm Changes</h4>
            <p>Are you sure you want to save these changes?</p>
            <div className="confirm-buttons">
              <button 
                className="btn submit-btn" 
                onClick={confirmSave}
                disabled={isLoading}
              >
                Yes, Save Changes
              </button>
              <button 
                className="btn clear-btn" 
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </ConfirmDialog>
      )}

      {showNoChangesDialog && (
        <ConfirmDialog>
          <div className="confirm-content">
            <h4>No Changes Detected</h4>
            <p>You haven't made any changes to your profile.</p>
            <div className="confirm-buttons">
              <button 
                className="btn submit-btn" 
                onClick={() => setShowNoChangesDialog(false)}
              >
                Close
              </button>
            </div>
          </div>
        </ConfirmDialog>
      )}
    </Wrapper>
  )
}

const ConfirmDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .confirm-content {
    background: var(--white);
    padding: 2rem;
    border-radius: var(--borderRadius);
    width: 90%;
    max-width: 400px;
    text-align: center;
    box-shadow: var(--shadow-4);

    h4 {
      margin-bottom: 1rem;
      color: var(--grey-900);
      font-size: 1.5rem;
    }

    p {
      margin-bottom: 2rem;
      color: var(--grey-700);
    }

    .confirm-buttons {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;

      &.two-buttons {
        grid-template-columns: 1fr 1fr;
      }

      .btn {
        padding: 0.75rem 1rem;
        height: 45px;
        font-size: 1rem;
        white-space: nowrap;
        width: 100%;
      }
    }
  }

  /* Dark mode styles */
  body.dark-mode & {
    .confirm-content {
      background: var(--dark-card);
      border: 1px solid var(--dark-border);

      h4 {
        color: var(--dark-text);
      }

      p {
        color: var(--dark-text-secondary);
      }
    }
  }
`

export default Profile
