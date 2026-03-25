<template>
  <div class="agenda-page">

    <!-- Top bar -->
    <div class="agenda-header">
      <div class="agenda-heading">
        <h1 class="agenda-title">Agenda</h1>
        <p class="agenda-subtitle">Gestión de citas y calendario</p>
      </div>
      <button class="btn-nueva-cita" @click="showModal = true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 3v10M3 8h10" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
        Nueva Cita
      </button>
    </div>

    <!-- Date navigation bar -->
    <div class="agenda-nav-bar">
      <div class="date-nav">
        <button class="nav-btn" aria-label="Día anterior">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8l4-4" stroke="#0c3660" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="date-pill">{{ fechaFormateada }}</div>
        <button class="nav-btn" aria-label="Día siguiente">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12l4-4-4-4" stroke="#0c3660" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button class="nav-btn today-btn">Hoy</button>
      </div>
      <div class="dentista-filter">
        <span class="filter-label">Dentista:</span>
        <div class="filter-select-wrapper">
          <select class="filter-select">
            <option>Todos</option>
          </select>
          <svg class="filter-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="#0c3660" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Citas card -->
    <div class="citas-card">
      <div class="citas-card-header">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="14" height="13" rx="2" stroke="#378add" stroke-width="1.5"/>
          <path d="M3 8h14M7 2v4M13 2v4" stroke="#378add" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span class="citas-card-title">Citas del Día (0)</span>
      </div>
      <div class="citas-empty">
        <svg class="empty-icon" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="8" width="36" height="34" rx="4" stroke="#b5d4f4" stroke-width="2"/>
          <path d="M6 18h36M16 4v8M32 4v8" stroke="#b5d4f4" stroke-width="2" stroke-linecap="round"/>
          <path d="M16 28h16M16 34h10" stroke="#b5d4f4" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <p class="empty-text">No hay citas programadas para este día</p>
      </div>
    </div>

    <!-- Modal -->
    <NuevaCitaModal
      v-model="showModal"
      :pacientes="pacientes"
      :dentistas="dentistas"
      :servicios="servicios"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import NuevaCitaModal from './NuevaCitaModal.vue'

const showModal = ref(false)

// Sample data — replace with real API calls
const pacientes = ref([])
const dentistas = ref([])
const servicios = ref([])

const fechaFormateada = computed(() => {
  return new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})
</script>

<style scoped>
.agenda-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background: #f5f9fc;
  min-height: 100%;
}

/* Header */
.agenda-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}
.agenda-title {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 30px;
  line-height: 36px;
  color: #0c3660;
  margin: 0;
}
.agenda-subtitle {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #4a6279;
  margin: 4px 0 0;
}
.btn-nueva-cita {
  display: flex;
  align-items: center;
  gap: 8px;
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
  white-space: nowrap;
  transition: background 0.15s;
}
.btn-nueva-cita:hover {
  background: #2b6eb5;
}

/* Nav bar */
.agenda-nav-bar {
  background: #ffffff;
  border: 1px solid #b5d4f4;
  border-radius: 12px;
  padding: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.date-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}
.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 32px;
  background: #f5f9fc;
  border: 1px solid #b5d4f4;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}
.nav-btn:hover {
  background: #e6f1fb;
}
.today-btn {
  width: auto;
  padding: 0 13px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #0c3660;
}
.date-pill {
  background: #e6f1fb;
  border-radius: 8px;
  padding: 8px 16px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #0c3660;
  text-transform: capitalize;
}
.dentista-filter {
  display: flex;
  align-items: center;
  gap: 8px;
}
.filter-label {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #0c3660;
  white-space: nowrap;
}
.filter-select-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.filter-select {
  height: 36px;
  padding: 0 32px 0 13px;
  background: #ffffff;
  border: 1px solid transparent;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #0c3660;
  appearance: none;
  cursor: pointer;
  outline: none;
}
.filter-chevron {
  position: absolute;
  right: 8px;
  pointer-events: none;
}

/* Citas card */
.citas-card {
  background: #ffffff;
  border: 1px solid #b5d4f4;
  border-radius: 12px;
  padding: 24px;
  flex: 1;
}
.citas-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 50px;
}
.citas-card-title {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #0c3660;
}
.citas-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 0;
}
.empty-icon {
  opacity: 0.5;
}
.empty-text {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #4a6279;
  margin: 0;
  text-align: center;
}
</style>