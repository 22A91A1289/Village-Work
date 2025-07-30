import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  role: null,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        role: action.payload.user.role,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        role: null,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        role: null,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const navigate = useNavigate()

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          // Verify token with backend
          const response = await fetch('/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          
          if (response.ok) {
            const data = await response.json()
            dispatch({
              type: 'LOGIN_SUCCESS',
              payload: {
                user: data.user,
                token: token,
              },
            })
          } else {
            localStorage.removeItem('token')
            dispatch({ type: 'LOGIN_FAILURE' })
          }
        } catch (error) {
          console.error('Auth check failed:', error)
          localStorage.removeItem('token')
          dispatch({ type: 'LOGIN_FAILURE' })
        }
      } else {
        dispatch({ type: 'LOGIN_FAILURE' })
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: data.user,
            token: data.token,
          },
        })
        
        toast.success('Login successful!')
        
        // Redirect based on role
        switch (data.user.role) {
          case 'worker':
            navigate('/worker')
            break
          case 'owner':
            navigate('/owner')
            break
          case 'admin':
            navigate('/admin')
            break
          default:
            navigate('/')
        }
      } else {
        toast.error(data.message || 'Login failed')
        dispatch({ type: 'LOGIN_FAILURE' })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Network error. Please try again.')
      dispatch({ type: 'LOGIN_FAILURE' })
    }
  }

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' })
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: data.user,
            token: data.token,
          },
        })
        
        toast.success('Registration successful!')
        
        // Redirect based on role
        switch (data.user.role) {
          case 'worker':
            navigate('/worker')
            break
          case 'owner':
            navigate('/owner')
            break
          case 'admin':
            navigate('/admin')
            break
          default:
            navigate('/')
        }
      } else {
        toast.error(data.message || 'Registration failed')
        dispatch({ type: 'LOGIN_FAILURE' })
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Network error. Please try again.')
      dispatch({ type: 'LOGIN_FAILURE' })
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
    navigate('/')
    toast.success('Logged out successfully')
  }

  const updateUser = (updates) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: updates,
    })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 