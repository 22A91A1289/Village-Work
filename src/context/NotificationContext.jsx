import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const NotificationContext = createContext()

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
}

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length,
      }
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }
    case 'MARK_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }
    case 'MARK_ALL_AS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      }
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      }
    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState)
  const { isAuthenticated, user } = useAuth()

  // Fetch notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications()
    }
  }, [isAuthenticated, user])

  // Set up WebSocket connection for real-time notifications
  useEffect(() => {
    if (!isAuthenticated || !user) return

    let ws = null

    const connectWebSocket = () => {
      try {
        ws = new WebSocket(`${import.meta.env.VITE_SOCKET_URL}/notifications`)
        
        ws.onopen = () => {
          console.log('WebSocket connected for notifications')
          ws.send(JSON.stringify({
            type: 'subscribe',
            userId: user.id,
          }))
        }

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data)
          
          if (data.type === 'notification') {
            dispatch({
              type: 'ADD_NOTIFICATION',
              payload: data.notification,
            })
            
            // Show toast for new notifications
            toast(data.notification.message, {
              icon: '🔔',
              duration: 4000,
            })
          }
        }

        ws.onclose = () => {
          console.log('WebSocket disconnected')
          // Reconnect after 5 seconds
          setTimeout(connectWebSocket, 5000)
        }

        ws.onerror = (error) => {
          console.error('WebSocket error:', error)
        }
      } catch (error) {
        console.error('Failed to connect WebSocket:', error)
      }
    }

    connectWebSocket()

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [isAuthenticated, user])

  const fetchNotifications = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      const response = await fetch('/api/notifications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        dispatch({ type: 'SET_NOTIFICATIONS', payload: data.notifications })
      } else {
        console.error('Failed to fetch notifications')
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (response.ok) {
        dispatch({ type: 'MARK_AS_READ', payload: notificationId })
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (response.ok) {
        dispatch({ type: 'MARK_ALL_AS_READ' })
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const clearNotifications = async () => {
    try {
      const response = await fetch('/api/notifications/clear', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (response.ok) {
        dispatch({ type: 'CLEAR_NOTIFICATIONS' })
      }
    } catch (error) {
      console.error('Error clearing notifications:', error)
    }
  }

  const value = {
    ...state,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
} 