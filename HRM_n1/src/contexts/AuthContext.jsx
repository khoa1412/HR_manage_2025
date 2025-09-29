import { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUserId, setCurrentUserId, getIsHR, setIsHR, getEmployee } from '../services/api'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const currentUserId = getCurrentUserId()
      console.log('Loading user, currentUserId:', currentUserId)
      
      if (currentUserId) {
        const employee = await getEmployee(currentUserId)
        console.log('Found employee:', employee)
        
        if (employee) {
          const userData = {
            id: employee.id,
            name: employee.fullName,
            email: employee.email,
            role: getIsHR() ? 'admin' : 'employee',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.fullName)}&background=3b82f6&color=ffffff`,
            department: employee.department,
            code: employee.code
          }
          console.log('Setting user data:', userData)
          setUser(userData)
        } else {
          console.log('No employee found for ID:', currentUserId)
        }
      } else {
        console.log('No currentUserId found')
      }
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    console.log('Login attempt:', { email, password })
    
    // Simulate login API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (email === 'admin@company.com' && password === 'admin123') {
      console.log('Admin login successful')
      // Set as HR admin
      setCurrentUserId('1')
      setIsHR(true)
      localStorage.setItem('authToken', 'fake-jwt-token')
      await loadUser()
      return { success: true }
    } else if (email === 'user@company.com' && password === 'user123') {
      console.log('User login successful')
      // Set as regular employee
      setCurrentUserId('2')
      setIsHR(false)
      localStorage.setItem('authToken', 'fake-jwt-token')
      await loadUser()
      return { success: true }
    }
    
    console.log('Login failed - invalid credentials')
    return { success: false, error: 'Email hoặc mật khẩu không đúng' }
  }

  const logout = () => {
    setUser(null)
    setCurrentUserId('')
    setIsHR(false)
    localStorage.removeItem('authToken')
  }

  const value = {
    user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
