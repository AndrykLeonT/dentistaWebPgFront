<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="$emit('update:modelValue', false)">
        <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-title">

          <!-- Close button -->
          <button class="modal-close" @click="$emit('update:modelValue', false)" aria-label="Cerrar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12M4 4l8 8" stroke="#4a6279" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>

          <!-- Header -->
          <div class="modal-header">
            <h2 id="modal-title" class="modal-title">Registrar Nueva Cita</h2>
            <p class="modal-subtitle">Completa el formulario para agendar una nueva cita</p>
          </div>

          <!-- Form -->
          <div class="modal-body">

            <!-- Paciente -->
            <div class="field-group">
              <label class="field-label">Paciente *</label>
              <div class="select-wrapper">
                <select v-model="form.paciente" class="field-select">
                  <option value="" disabled>Selecciona un paciente</option>
                  <option v-for="p in pacientes" :key="p.id" :value="p.id">{{ p.nombre }}</option>
                </select>
                <span class="select-chevron">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6l4 4 4-4" stroke="#4a6279" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>

            <!-- Dentista -->
            <div class="field-group">
              <label class="field-label">Dentista *</label>
              <div class="select-wrapper">
                <select v-model="form.dentista" class="field-select">
                  <option value="" disabled>Selecciona un dentista</option>
                  <option v-for="d in dentistas" :key="d.id" :value="d.id">{{ d.nombre }}</option>
                </select>
                <span class="select-chevron">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6l4 4 4-4" stroke="#4a6279" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>

            <!-- Servicio -->
            <div class="field-group">
              <label class="field-label">Servicio *</label>
              <div class="select-wrapper">
                <select v-model="form.servicio" class="field-select">
                  <option value="" disabled>Selecciona un servicio</option>
                  <option v-for="s in servicios" :key="s.id" :value="s.id">{{ s.nombre }}</option>
                </select>
                <span class="select-chevron">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6l4 4 4-4" stroke="#4a6279" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
              </div>
            </div>

            <!-- Fecha + Hora -->
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">Fecha *</label>
                <input
                  v-model="form.fecha"
                  type="date"
                  class="field-input"
                />
              </div>
              <div class="field-group">
                <label class="field-label">Hora de inicio *</label>
                <input
                  v-model="form.hora"
                  type="time"
                  class="field-input"
                />
              </div>
            </div>

            <!-- Motivo -->
            <div class="field-group">
              <label class="field-label">Motivo de consulta</label>
              <textarea
                v-model="form.motivo"
                class="field-textarea"
                placeholder="Describe el motivo de la consulta..."
                rows="3"
              ></textarea>
            </div>

          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button class="btn-cancel" @click="$emit('update:modelValue', false)">
              Cancelar
            </button>
            <button class="btn-save" @click="handleGuardar">
              Guardar Cita
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  pacientes: {
    type: Array,
    default: () => [],
  },
  dentistas: {
    type: Array,
    default: () => [],
  },
  servicios: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'guardar'])

const form = reactive({
  paciente: '',
  dentista: '',
  servicio: '',
  fecha: '',
  hora: '',
  motivo: '',
})

function handleGuardar() {
  // No-op for now — will be wired up later
  console.log('Guardar cita:', { ...form })
}
</script>

<style scoped>
/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Container */
.modal-container {
  position: relative;
  background: #f5f9fc;
  border: 1px solid #b5d4f4;
  border-radius: 8px;
  width: 512px;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Close button */
.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s;
}
.modal-close:hover {
  opacity: 1;
}

/* Header */
.modal-header {
  margin-bottom: 22px;
}
.modal-title {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 18px;
  color: #0c3660;
  margin: 0 0 8px;
}
.modal-subtitle {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #4a6279;
  margin: 0;
}

/* Body */
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 16px;
}

/* Field group */
.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.field-label {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  color: #0c3660;
}

/* Select */
.select-wrapper {
  position: relative;
}
.field-select {
  width: 100%;
  height: 36px;
  padding: 0 36px 0 13px;
  background: #ffffff;
  border: 1px solid transparent;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #4a6279;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field-select:focus {
  border-color: #378add;
  box-shadow: 0 0 0 2px rgba(55, 138, 221, 0.15);
}
.field-select option[value=""][disabled] {
  color: #4a6279;
}
.select-chevron {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
}

/* Date / Time inputs */
.field-input {
  width: 100%;
  height: 36px;
  padding: 0 12px;
  background: #ffffff;
  border: 1px solid transparent;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #0c3660;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field-input:focus {
  border-color: #378add;
  box-shadow: 0 0 0 2px rgba(55, 138, 221, 0.15);
}

/* Two-column row */
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Textarea */
.field-textarea {
  width: 100%;
  padding: 8px 12px;
  background: #ffffff;
  border: 1px solid transparent;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #0c3660;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field-textarea::placeholder {
  color: #4a6279;
}
.field-textarea:focus {
  border-color: #378add;
  box-shadow: 0 0 0 2px rgba(55, 138, 221, 0.15);
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
}
.btn-cancel {
  height: 36px;
  padding: 0 17px;
  background: #f5f9fc;
  border: 1px solid #b5d4f4;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #0c3660;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-cancel:hover {
  background: #e6f1fb;
}
.btn-save {
  height: 36px;
  padding: 0 16px;
  background: #378add;
  border: none;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #ffffff;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-save:hover {
  background: #2b6eb5;
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: translateY(-12px);
  opacity: 0;
}
</style>