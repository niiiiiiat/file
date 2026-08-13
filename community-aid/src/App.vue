<template>
  <div id="app-root">
    <AppNavbar v-if="showNav" />
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'

const route = useRoute()
const noNavRoutes = ['Home', 'VolunteerRegister', 'RequesterRegister']
const showNav = computed(() => !noNavRoutes.includes(route.name))
</script>

<style>
#app-root { min-height: 100vh; display: flex; flex-direction: column; }
.main-content { flex: 1; }

/* Page transition */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s cubic-bezier(0.16,1,0.3,1),
              transform 0.25s cubic-bezier(0.16,1,0.3,1);
}
.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to   { opacity: 0; transform: translateY(-4px); }
</style>
