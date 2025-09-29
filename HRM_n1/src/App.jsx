import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import EmployeeManagement from './pages/EmployeeManagement'
import EmployeeProfile from './pages/EmployeeProfile'
import Departments from './pages/Departments'
import ESS from './pages/ESS'
import TimeAttendance from './pages/TimeAttendance'
import PayrollSettings from './pages/PayrollSettings'
import Announcements from './pages/Announcements'

import Login from './pages/Login'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="employees/:id" element={<EmployeeProfile />} />
            <Route path="departments" element={<Departments />} />
            <Route path="ess" element={<ESS />} />
            <Route path="attendance" element={<TimeAttendance />} />
            <Route path="payroll" element={<PayrollSettings />} />
            <Route path="announcements" element={<Announcements />} />

          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
