// ─── Clasificaciones ──────────────────────────────────────────────────────────

export type TipoEmpleado = 'Administrador' | 'Dentista' | 'Recepcionista'

export type ClaseServicio = 'Preventivo' | 'Restaurativo' | 'Estético' | 'Cirugía' | 'Ortodoncia'

export type EstadoCita = 'Confirmada' | 'Pendiente' | 'En curso' | 'Completada' | 'Cancelada'

export type MetodoPago = 'Efectivo' | 'Tarjeta de crédito' | 'Transferencia'

export type TipoSangre = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

// ─── Sub-objetos reutilizables ────────────────────────────────────────────────

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

// ─── Entidades principales ────────────────────────────────────────────────────

/** Paciente del consultorio. */
export interface Persona {
  id: number
  expediente: string
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
  estado: 'Activo' | 'Inactivo'
  ultimaVisita?: string // YYYY-MM-DD
}

/** Usuario interno del sistema (dentista, recepcionista, admin). */
export interface Empleado {
  id: number
  nombre: string
  apellidos: string
  correo: string
  telefono?: string
  tipo: TipoEmpleado
  estado: 'Activo' | 'Inactivo'
  fotoPerfil?: string
  fechaRegistro?: string // YYYY-MM-DD
  ultimoAcceso?: string  // ISO datetime
}

export interface Servicio {
  id: number
  nombre: string
  clase: ClaseServicio
  descripcion?: string
  duracion: number       // minutos
  precio: number         // MXN
  multipleSesiones: boolean
  numSesiones: number
  notas?: string
  activo: boolean
}

export interface Cita {
  id: number
  fecha: string          // YYYY-MM-DD
  horaInicio: string     // HH:mm
  horaFin?: string       // HH:mm
  pacienteId: number
  paciente?: Pick<Persona, 'id' | 'nombre' | 'apellidos'>
  empleadoId: number
  empleado?: Pick<Empleado, 'id' | 'nombre' | 'apellidos' | 'tipo'>
  servicioId: number
  servicio?: Pick<Servicio, 'id' | 'nombre'>
  estado: EstadoCita
  motivo?: string
  notasClinicas?: string
}

/** Receta emitida al finalizar una cita. */
export interface Receta {
  id: number
  citaId: number
  pacienteId: number
  empleadoId: number
  fecha: string          // YYYY-MM-DD
  medicamentos: string
  indicaciones: string
  notas?: string
}

export interface Pago {
  id: number
  folio: string
  fecha: string          // YYYY-MM-DD
  pacienteId: number
  paciente?: Pick<Persona, 'id' | 'nombre' | 'apellidos'>
  citaId?: number
  servicioId: number
  servicio?: Pick<Servicio, 'id' | 'nombre'>
  empleadoId?: number
  empleado?: Pick<Empleado, 'id' | 'nombre' | 'apellidos'>
  precio: number         // antes de descuento
  descuento: number
  total: number          // precio - descuento
  metodo: MetodoPago
  referencia?: string
  factura: boolean
  notas?: string
}

/** Cierre de caja diario o por período. */
export interface Corte {
  id: number
  fecha: string          // YYYY-MM-DD
  empleadoId: number
  empleado?: Pick<Empleado, 'id' | 'nombre' | 'apellidos'>
  totalEfectivo: number
  totalTarjeta: number
  totalTransferencia: number
  totalGeneral: number
  numPagos: number
  notas?: string
  creadoEn: string       // ISO datetime
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
}
