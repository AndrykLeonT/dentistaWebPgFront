// ─── Clasificaciones ──────────────────────────────────────────────────────────

export type EstadoCita = 'Confirmada' | 'Pendiente' | 'En curso' | 'Completada' | 'Cancelada'

export type MetodoPago = 'Efectivo' | 'Tarjeta de crédito' | 'Transferencia'

export type TipoSangre = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

// ─── Empleado (estructura real de la API) ─────────────────────────────────────

/** Objeto tipoEmpleado anidado en la respuesta de /login y /me. */
export interface TipoEmpleado {
  id: number
  nombre: 'Administrador' | 'admin' | 'Dentista' | 'Recepcionista' | string
  descripcion?: string
}

/** Datos personales anidados dentro del Empleado. */
export interface EmpleadoPersona {
  id: number
  nombreCompleto: string
  nombre?: string
  apellidoP?: string
  apellidoM?: string | null
  celular?: string
  correoElectronico?: string
  fechaRegistro?: string
}

/** Empleado tal como lo devuelve el backend (/login y /me). */
export interface Empleado {
  id: number
  usuario: string
  rfc?: string
  tipoEmpleado: TipoEmpleado
  persona: EmpleadoPersona
  estado?: boolean
  cambioContraseña?: boolean
  fechaRegistro?: string
  ultimoAcceso?: string | null
  requiresPasswordChange?: boolean
}

export interface StoreEmpleadoPayload {
  nombre: string
  apellidoP: string
  apellidoM?: string | null
  celular: string
  correoElectronico?: string | null
  idTipoEmpleado: number
  usuario: string
  rfc?: string | null
  contraseña: string
  palabraClave: string
}

export interface UpdateEmpleadoPayload {
  nombre?: string
  apellidoP?: string
  apellidoM?: string | null
  celular?: string
  correoElectronico?: string | null
  idTipoEmpleado?: number
  usuario?: string
  rfc?: string | null
  contraseña?: string
  palabraClave?: string
  cambioContraseña?: boolean
}

export interface ResetPasswordPayload {
  nuevaContraseña: string
  nuevaContraseña_confirmation: string
}

/** Respuesta completa del endpoint POST /login. */
export interface LoginResponse {
  token: string
  empleado: Empleado
  requiresPasswordChange?: boolean
}

export interface RecoverPasswordKeywordPayload {
  usuario: string
  palabraClave: string
  new_password: string
  new_password_confirmation: string
}

export interface RecoverPasswordKeywordResponse {
  message: string
}

// ─── Paciente ─────────────────────────────────────────────────────────────────

export interface Direccion {
  calle: string
  numero: string
  colonia: string
  ciudad: string
  codigoPostal: string
}

export interface ContactoEmergencia {
  nombre: string
  telefono: string
}

/** Persona = Paciente en el dominio del sistema. */
export interface Persona {
  id: number
  nombreCompleto: string
  nombre: string
  apellidoP: string
  apellidoM: string | null
  celular: string
  correoElectronico: string | null
  fechaRegistro: string
  estado?: boolean
}

export interface HistorialCitaPaciente {
  id: number
  fecha: string
  hora: string
  estado: string
  servicio: string
  dentista: string
  observaciones?: string | null
}

export interface HistorialPagoPaciente {
  id: number
  fecha: string
  total: number
  efectivo: number
  tarjeta: number
  folioComprobante?: string | null
  estado: string
}

// ─── Servicios ────────────────────────────────────────────────────────────────

/** Categoría de servicio dental (GET /api/clases-servicio). */
export interface ClaseServicio {
  id: number
  nombre: string
}

export interface Servicio {
  id: number
  nombre: string
  claseServicio?: ClaseServicio
  descripcion?: string
  duracion?: string       // HH:mm:ss
  costo?: string
  precio?: number         // MXN
  estado?: boolean
  activo?: boolean
}

export interface StoreServicioPayload {
  idClaseServicio: number
  nombre: string
  descripcion?: string | null
  costo: number
  duracion: string
}

export interface UpdateServicioPayload {
  idClaseServicio?: number
  nombre?: string
  descripcion?: string | null
  costo?: number
  duracion?: string
  estado?: boolean
}

// ─── Citas ────────────────────────────────────────────────────────────────────

export interface Cita {
  id: number
  fecha?: string          // YYYY-MM-DD
  fechaRegistro?: string
  fechaProgramada?: string
  hora?: string           // HH:mm
  horaInicio?: string     // HH:mm
  horaFin?: string        // HH:mm
  paciente?: {
    id: number
    nombreCompleto: string
  }
  persona?: Persona
  dentista?: {
    id: number
    nombreCompleto: string
  }
  empleado?: Empleado
  servicio?: Servicio
  estado?: EstadoCita
  duracion?: string
  motivo?: string
  notasClinicas?: string
}

// ─── Recetas ──────────────────────────────────────────────────────────────────

export interface Receta {
  id: number
  cita?: Cita
  persona?: Persona
  empleado?: Empleado
  indicaciones: string
  fecha?: string          // YYYY-MM-DD
  fechaRegistro?: string
  createdAt?: string
}

// ─── Pagos ────────────────────────────────────────────────────────────────────

export interface Pago {
  id: number
  total: string | number
  efectivo: string | number
  tarjeta: string | number
  pendiente?: string | number
  pagado?: boolean
  fechaRegistro?: string
  paciente?: {
    id: number
    nombreCompleto: string
  }
  empleado?: {
    id: number
    nombreCompleto?: string
    usuario?: string
  }
}

// ─── Comprobantes ─────────────────────────────────────────────────────────────

export interface Comprobante {
  id: number
  idPago: number
  folio: string
  fechaEmision: string
  observaciones?: string
  estado: boolean
}

// ─── Cortes de caja ───────────────────────────────────────────────────────────

export interface Corte {
  id: number
  fechaInicio: string
  fechaFin?: string | null
  fDeCaja: string | number
  tEfectivo: string | number
  tTarjeta: string | number
  totalRecaudado: string | number
  numPagos?: number
  activo?: boolean
}

// ─── Wrappers de respuesta API ────────────────────────────────────────────────

export interface ApiListResponse<T> {
  data: T[]
  meta?: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

export interface ApiSingleResponse<T> {
  data: T
  message?: string
}

// ─── Inventario ───────────────────────────────────────────────────────────────

export interface ProductoInventario {
  id: number
  nombre: string
  unidadMedida: string
  descripcion?: string | null
  stockActual: number
  estado?: boolean
  bajoStock?: boolean
}

export type TipoMovimientoInventario = 'entrada' | 'salida' | 'ajuste'

export interface MovimientoInventario {
  id: number
  idProductoInventario?: number
  idEmpleado?: number
  tipoMovimiento: TipoMovimientoInventario
  cantidad: number
  stockAnterior?: number
  stockNuevo?: number
  motivo?: string | null
  fechaRegistro?: string
  producto?: ProductoInventario
  empleado?: { id: number; nombreCompleto?: string }
}

export interface ConsumoServicio {
  id: number
  idServicio: number
  servicio?: string
  idProductoInventario: number
  producto?: string
  cantidad: number
  activo?: boolean
}

export interface StoreConsumoServicioPayload {
  idServicio: number
  idProductoInventario: number
  cantidad: number
}

export interface DashboardResumen {
  pacientesActivos: number
  citasHoy: number
  ingresosHoy: number
  productosBajoStock: number
  citasProximas: Array<{
    id: number
    hora?: string
    estado?: string
    paciente?: string
    servicio?: string
    dentista?: string
  }>
  alertasInventario: Array<{
    id?: number
    nombre: string
    stockActual?: number
    stock?: number
    minimo?: number
    sinStock?: boolean
  }>
}
