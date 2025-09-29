import { Link, useLocation } from 'react-router-dom'
import { 
  Home,
  Users,
  UserCheck,
  Clock,
  Building2,
  Bell,
  Calculator
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Quản lý nhân sự', href: '/employees', icon: Users },
  { name: 'Phòng ban', href: '/departments', icon: Building2 },
  { name: 'Cổng Nhân viên', href: '/ess', icon: UserCheck },
  { name: 'Chấm công', href: '/attendance', icon: Clock },
  { name: 'Cài đặt lương', href: '/payroll', icon: Calculator },
  { name: 'Thông báo', href: '/announcements', icon: Bell },
]

export default function SimpleSidebar() {
  const location = useLocation()

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '256px',
      height: '100vh',
      backgroundColor: 'white',
      borderRight: '1px solid #e5e7eb',
      zIndex: 50,
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '20px 16px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <Building2 style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
        <h1 style={{
          marginLeft: '8px',
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#111827'
        }}>
          HRM System
        </h1>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '16px 8px' }}>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              to={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 12px',
                margin: '2px 0',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s',
                backgroundColor: isActive ? '#eff6ff' : 'transparent',
                color: isActive ? '#1d4ed8' : '#6b7280',
                borderRight: isActive ? '2px solid #3b82f6' : 'none'
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = '#f9fafb'
                  e.target.style.color = '#111827'
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.color = '#6b7280'
                }
              }}
              onClick={() => {
                console.log('Navigating to:', item.href)
              }}
            >
              <Icon style={{
                width: '20px',
                height: '20px',
                marginRight: '12px',
                color: isActive ? '#3b82f6' : '#9ca3af'
              }} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        padding: '16px',
        borderTop: '1px solid #e5e7eb',
        fontSize: '12px',
        color: '#6b7280'
      }}>
        © 2024 HRM System v1.0
      </div>
    </div>
  )
}
