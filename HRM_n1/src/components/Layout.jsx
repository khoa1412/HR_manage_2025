import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import SimpleSidebar from './SimpleSidebar'
import Header from './Header'

export default function Layout() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f9fafb' }}>
      <SimpleSidebar />
      
      <div style={{ 
        flex: 1, 
        marginLeft: '256px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Header setSidebarOpen={setSidebarOpen} />
        
        <main style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px',
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
