import api from './api'

export interface Tenant {
  id: number
  name: string
  slug: string
  domain: string
  subscription_tier: string
  is_active: boolean
}

export interface Showroom {
  id: number
  tenant: number
  name: string
  code: string
  phone: string
  email: string
  is_active: boolean
}

export interface Department {
  id: number
  tenant: number
  name: string
  code: string
  description: string
  is_active: boolean
}

export interface StaffProfile {
  id: number
  user: number
  tenant: number
  employee_id: string
  phone: string
  is_active: boolean
  user_email?: string
  user_name?: string
}

const service = {
  list: <T>(endpoint: string) => api.get<{ results: T[] }>(endpoint).then(r => r.data.results),
  get: <T>(endpoint: string, id: number) => api.get<T>(`${endpoint}${id}/`).then(r => r.data),
  create: <T>(endpoint: string, data: Partial<T>) => api.post<T>(endpoint, data).then(r => r.data),
  update: <T>(endpoint: string, id: number, data: Partial<T>) => api.patch<T>(`${endpoint}${id}/`, data).then(r => r.data),
  delete: (endpoint: string, id: number) => api.delete(`${endpoint}${id}/`),
}

export const tenantsApi = {
  list: () => service.list<Tenant>('/tenants/'),
  create: (data: Partial<Tenant>) => service.create('/tenants/', data),
}

export const showroomsApi = {
  list: () => service.list<Showroom>('/showrooms/'),
  get: (id: number) => service.get<Showroom>('/showrooms/', id),
  create: (data: Partial<Showroom>) => service.create('/showrooms/', data),
  update: (id: number, data: Partial<Showroom>) => service.update('/showrooms/', id, data),
  delete: (id: number) => service.delete('/showrooms/', id),
}

export const departmentsApi = {
  list: () => service.list<Department>('/departments/'),
  create: (data: Partial<Department>) => service.create('/departments/', data),
  update: (id: number, data: Partial<Department>) => service.update('/departments/', id, data),
  delete: (id: number) => service.delete('/departments/', id),
}

export const staffApi = {
  list: () => service.list<StaffProfile>('/staff/'),
  create: (data: Partial<StaffProfile>) => service.create('/staff/', data),
  update: (id: number, data: Partial<StaffProfile>) => service.update('/staff/', id, data),
  delete: (id: number) => service.delete('/staff/', id),
}

export interface VehicleCategory {
  id: number; name: string; slug: string; parent: number | null
}
export interface VehicleBrand {
  id: number; name: string; logo: string
}
export interface VehicleModel {
  id: number; brand: number; name: string
}
export interface VehicleYear {
  id: number; model: number; year: number
}
export interface VehicleImage {
  id: number; vehicle: number; image: string; is_primary: boolean; sort_order: number
}
export interface VehicleSpecValue {
  id: number; vehicle: number; specification: number; value: any
}
export interface VehicleInspection {
  id: number; vehicle: number; inspector: number; report: string; rating: number; created_at: string
}
export interface VehiclePriceHistory {
  id: number; vehicle: number; old_price: string; new_price: string; changed_by: number; created_at: string
}
export interface Vehicle {
  id: number; tenant: number; showroom: number; category: number | null
  brand: number | null; model: number | null; year: number; vin: string
  reg_number: string; mileage: number; fuel_type: string; transmission: string
  color: string; condition: string; price: string; status: string
  description: string; added_by: number
  images: VehicleImage[]; spec_values: VehicleSpecValue[]
  inspections: VehicleInspection[]; price_history: VehiclePriceHistory[]
}

export const vehicleCategoriesApi = {
  list: () => service.list<VehicleCategory>('/vehicle-categories/'),
}
export const vehicleBrandsApi = {
  list: () => service.list<VehicleBrand>('/brands/'),
}
export const vehicleModelsApi = {
  list: (brandId: number) => api.get<{ results: VehicleModel[] }>(`/brands/${brandId}/models/`).then(r => r.data.results),
}
export const vehiclesApi = {
  list: () => service.list<Vehicle>('/vehicles/'),
  get: (id: number) => service.get<Vehicle>('/vehicles/', id),
  create: (data: Partial<Vehicle>) => service.create('/vehicles/', data),
  update: (id: number, data: Partial<Vehicle>) => service.update('/vehicles/', id, data),
  delete: (id: number) => service.delete('/vehicles/', id),
}
