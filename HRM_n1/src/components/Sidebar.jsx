import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home,
  Users,
  UserCheck,
  Clock,
  UserPlus,
  TrendingUp,
  GraduationCap,
  BarChart3,
  X,
  Building2,
  Bell,
  Calculator
} from 'lucide-react'
import { cn } from '../utils/cn'

const navigation = [
  { name: 'Tổng quan', href: '/', icon: Home },
  { name: 'Quản lý nhân sự', href: '/employees', icon: Users },
  { name: 'Phòng ban', href: '/departments', icon: Building2 },
  { name: 'Self-Service Portal', href: '/ess', icon: UserCheck },
  { name: 'Chấm công', href: '/attendance', icon: Clock },
  { name: 'Cài đặt lương', href: '/payroll', icon: Calculator },
  { name: 'Thông báo', href: '/announcements', icon: Bell },
  { name: 'Tuyển dụng', href: '/recruitment', icon: UserPlus },
  { name: 'Đánh giá hiệu suất', href: '/performance', icon: TrendingUp },
  { name: 'Đào tạo', href: '/training', icon: GraduationCap },
  { name: 'Báo cáo', href: '/reports', icon: BarChart3 },
]

export default function Sidebar({ open, setOpen }) {
  const location = useLocation()

  return (
    <>
      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent currentPath={location.pathname} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <SidebarContent currentPath={location.pathname} />
        </div>
      </div>
    </>
  )
}

function SidebarContent({ currentPath }) {
  return (
    <>
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-6">
          <Building2 className="h-8 w-8 text-primary-600" />
          <h1 className="ml-2 text-xl font-bold text-gray-900">HRM System</h1>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = currentPath === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  isActive
                    ? 'bg-primary-50 border-r-2 border-primary-600 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer relative z-20 pointer-events-auto sidebar-link'
                )}
                style={{ pointerEvents: 'auto' }}
                onClick={(e) => {
                  console.log('Sidebar link clicked:', item.name, item.href)
                }}
              >
                <item.icon
                  className={cn(
                    isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 flex-shrink-0 h-5 w-5 pointer-events-none'
                  )}
                />
                <span className="pointer-events-none">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="text-xs text-gray-500">
          © 2024 HRM System v1.0
        </div>
      </div>
    </>
  )
}
