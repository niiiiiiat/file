import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('aid_user') || 'null'))
  const token = ref(localStorage.getItem('aid_token') || '')

  const isLoggedIn = computed(() => !!token.value && !!user.value)

  function login(userData, accessToken) {
    user.value = userData
    token.value = accessToken
    localStorage.setItem('aid_user', JSON.stringify(userData))
    localStorage.setItem('aid_token', accessToken)
  }

  function logout() {
    user.value = null
    token.value = ''
    localStorage.removeItem('aid_user')
    localStorage.removeItem('aid_token')
  }

  return { user, token, isLoggedIn, login, logout }
})
