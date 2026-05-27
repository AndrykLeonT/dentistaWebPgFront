// ─── Clasificaciones ──────────────────────────────────────────────────────────

export type EstadoCita = 'Confirmada' | 'Pendiente' | 'En curso' | 'Completada' | 'Cancelada'

export type MetodoPago = 'Efectivo' | 'Tarjeta de crédito' | 'Transferencia'

export type TipoSangre = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

// ─── Empleado (estructura real de la API) ─────────────────────────────────────

/** Objeto tipoEmpleado anidado en la respuesta de /login y /me. */
export interface TipoEmpleado {
  id: number
  nombre: 'Administrador' | 'Dentista' | 'Recepcionista'
}

/** Datos personales anidados dentro del Empleado. */
export interface EmpleadoPersona {
  id: number
  nombreCompleto: string
  celular?: string
  correoElectronico?: string
}

/** Empleado tal como lo devuelve el backend (/login y /me). */
export interface Empleado {
  id: number
  usuario: string
  rfc?: string
  tipoEmpleado: TipoEmpleado
  persona: EmpleadoPersona
  requiresPasswordChange?: boolean
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
  duracion: number        // minutos
  precio: number          // MXN
  multipleSesiones: boolean
  numSesiones: number
  notas?: string
  activo: boolean
}

// ─── Citas ────────────────────────────────────────────────────────────────────

export interface Cita {
  id: number
  fecha: string           // YYYY-MM-DD
  horaInicio: string      // HH:mm
  horaFin?: string        // HH:mm
  persona?: Persona
  empleado?: Empleado
  servicio?: Servicio
  estado: EstadoCita
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
  meta: {
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
