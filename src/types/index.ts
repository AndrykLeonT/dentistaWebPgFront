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
  expediente?: string
  nombre: string
  apellidos: string
  fechaNacimiento: string // YYYY-MM-DD
  genero: 'Masculino' | 'Femenino' | 'Otro'
  telefonoPrincipal: string
  telefonoSecundario?: string
  correo?: string
  direccion?: Direccion
  tipoSangre?: TipoSangre
  alergias?: string
  condicionesMedicas?: string
  medicamentos?: string
  contactoEmergencia?: ContactoEmergencia
  estado?: 'Activo' | 'Inactivo'
  ultimaVisita?: string // YYYY-MM-DD
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
}

// ─── Pagos ────────────────────────────────────────────────────────────────────

export interface Pago {
  id: number
  folio?: string
  fecha?: string          // YYYY-MM-DD
  persona?: Persona
  servicio?: Servicio
  total: number
  efectivo: number
  tarjeta: number
  // idEmpleado e idCorte los asigna el backend automáticamente
}

// ─── Cortes de caja ───────────────────────────────────────────────────────────

export interface Corte {
  id: number
  fDeCaja: string         // fecha de apertura (YYYY-MM-DD HH:mm:ss)
  fechaFin?: string       // fecha de cierre  (YYYY-MM-DD HH:mm:ss)
  totalEfectivo?: number
  totalTarjeta?: number
  totalGeneral?: number
  numPagos?: number
  activo: boolean
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
