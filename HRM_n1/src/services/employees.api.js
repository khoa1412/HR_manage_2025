import { http } from './http'

export function listEmployees({ q, departmentId, status, page = 1, pageSize = 20 } = {}) {
  const qs = new URLSearchParams()
  if (q) qs.set('q', q)
  if (departmentId) qs.set('departmentId', departmentId)
  if (status) qs.set('status', status)
  qs.set('page', String(page))
  qs.set('pageSize', String(pageSize))
  const s = qs.toString()
  return http.get(`/employees${s ? `?${s}` : ''}`)
}

export const getEmployee = (id) => http.get(`/employees/${id}`)
export const getMe = () => http.get(`/employees/me`)
export const createEmployee = (payload) => http.post(`/employees`, payload)
export const updateEmployee = (id, payload) => http.patch(`/employees/${id}`, payload)
export const deleteEmployee = (id, hard = false) => http.del(`/employees/${id}${hard ? '' : ''}`)
export const terminateEmployee = (id, payload) => http.post(`/employees/${id}/terminate`, payload)

// Positions
export const listPositions = (id, activeOnly) => http.get(`/employees/${id}/positions${activeOnly ? '?activeOnly=true' : ''}`)
export const createPosition = (id, payload) => http.post(`/employees/${id}/positions`, payload)
export const updatePosition = (id, positionId, payload) => http.patch(`/employees/${id}/positions/${positionId}`, payload)
export const deletePosition = (id, positionId) => http.del(`/employees/${id}/positions/${positionId}`)

// Salaries
export const listSalaries = (id) => http.get(`/employees/${id}/salaries`)
export const getCurrentSalary = (id) => http.get(`/employees/${id}/salaries/current`)
export const createSalary = (id, payload) => http.post(`/employees/${id}/salaries`, payload)
export const updateSalary = (id, salaryId, payload) => http.patch(`/employees/${id}/salaries/${salaryId}`, payload)
export const deleteSalary = (id, salaryId) => http.del(`/employees/${id}/salaries/${salaryId}`)

// Benefits
export const listBenefits = (id) => http.get(`/employees/${id}/benefits`)
export const createBenefit = (id, payload) => http.post(`/employees/${id}/benefits`, payload)
export const updateBenefit = (id, benefitId, payload) => http.patch(`/employees/${id}/benefits/${benefitId}`, payload)
export const deleteBenefit = (id, benefitId) => http.del(`/employees/${id}/benefits/${benefitId}`)


