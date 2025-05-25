// =============================
// ⚠️ PROTECTED CODE - DO NOT COPY ⚠️
// Author: Meet Jain
// This project is protected. Do not copy, fork, or reuse without permission.
// Unauthorized use is strictly prohibited.
// =============================

import React, { useReducer, useContext, useEffect, useCallback, useRef } from 'react';

import reducer from './reducer';
import axios from 'axios';
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  DELETE_JOB_ERROR,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
} from './actions';

const initialState = {
  userLoading: true,
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: null,
  userLocation: '',
  showSidebar: false,
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobLocation: '',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: 'full-time',
  statusOptions: ['interview', 'declined', 'pending'],
  status: 'pending',
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
  isGoogleAuthLoading: false,
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // axios instance
  const authFetch = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? 'https://trackilo.onrender.com/api/v1' : '/api/v1',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add request interceptor
  authFetch.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      console.error('Response error:', error);
      if (error.response?.status === 401) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

  // Add request queue
  const requestQueue = useRef([]);
  const isProcessing = useRef(false);

  const processQueue = useCallback(async () => {
    if (isProcessing.current || requestQueue.current.length === 0) {
      return;
    }

    isProcessing.current = true;
    try {
      const request = requestQueue.current[0];
      await request();
      requestQueue.current.shift();
    } catch (error) {
      console.error('Error processing request:', error);
    } finally {
      isProcessing.current = false;
      if (requestQueue.current.length > 0) {
        processQueue();
      }
    }
  }, []);

  const queueRequest = useCallback((request) => {
    requestQueue.current.push(request);
    processQueue();
  }, [processQueue]);

  // Alert helpers
  const displayAlert = useCallback(() => {
    dispatch({ type: DISPLAY_ALERT });
    const timeout = setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  const clearAlert = useCallback(() => {
    dispatch({ type: CLEAR_ALERT });
  }, []);

  // Logout user
  const logoutUser = useCallback(async () => {
    try {
      await authFetch.get('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    dispatch({ type: LOGOUT_USER });
  }, [authFetch]);

  // Get current user
  const getCurrentUser = useCallback(async () => {
    dispatch({ type: GET_CURRENT_USER_BEGIN });
    try {
      const { data } = await authFetch('/auth/getCurrentUser');
      const { user, location } = data;
      dispatch({ type: GET_CURRENT_USER_SUCCESS, payload: { user, location } });
    } catch (error) {
      if (error.response?.status === 401) return;
      logoutUser();
    }
  }, [authFetch, logoutUser]);

  // Check and load user on mount
  useEffect(() => {
    if (!state.user) {
      const timeout = setTimeout(() => {
        queueRequest(getCurrentUser);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [getCurrentUser, state.user, queueRequest]);

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN });
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser);
      const { user, location } = data;
      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location },
      });
    } catch (error) {
      if (error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
    }
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value } });
  };

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES });
  };

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.post('/jobs', {
        position,
        company,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: CREATE_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const getJobs = async () => {
    const { page, search, searchStatus, searchType, sort } = state;

    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
    if (search) {
      url = url + `&search=${search}`;
    }
    dispatch({ type: GET_JOBS_BEGIN });
    try {
      const { data } = await authFetch(url);
      const { jobs, totalJobs, numOfPages } = data;
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };

  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };
  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status,
      });
      dispatch({ type: EDIT_JOB_SUCCESS });
      dispatch({ type: CLEAR_VALUES });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };
  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN });
    try {
      await authFetch.delete(`/jobs/${jobId}`);
      getJobs();
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: DELETE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };
  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch('/jobs/stats');
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications,
        },
      });
    } catch (error) {
      logoutUser();
    }
    clearAlert();
  };
  const clearFilters = useCallback(() => {
    dispatch({ type: CLEAR_FILTERS });
  }, []);
  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  const loginWithGoogle = async () => {
    dispatch({ type: 'GOOGLE_AUTH_BEGIN' });
    try {
      const baseUrl = process.env.NODE_ENV === 'production'
        ? 'https://trackilo.onrender.com'
        : 'http://localhost:5001';
      window.location.href = `${baseUrl}/api/v1/auth/google`;
    } catch (error) {
      dispatch({
        type: 'GOOGLE_AUTH_ERROR',
        payload: { msg: 'Google authentication failed. Please try again.' },
      });
    }
  };

  // Setup user
  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const { data } = await axios.post(`/api/v1/auth/${endPoint}`, currentUser);
      const { user, location } = data;
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { user, location, alertText },
      });
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response?.data?.msg || 'An error occurred' },
      });
    }
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage,
        loginWithGoogle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useAppContext, initialState };
