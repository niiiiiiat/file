<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <RouterLink to="/" class="navbar-brand">
        <span class="brand-icon">🏘️</span>
        <span class="brand-text">社區互助</span>
      </RouterLink>

      <div class="navbar-links">
        <template v-if="auth.user?.role === 'volunteer'">
          <RouterLink to="/volunteer/dashboard" class="nav-link">地圖探索</RouterLink>
          <RouterLink to="/resources" class="nav-link">物資共享</RouterLink>
          <div class="nav-divider"></div>
          <div class="nav-user">
            <div class="user-avatar">{{ auth.user.full_name?.charAt(0) }}</div>
            <span class="user-name">{{ auth.user.full_name }}</span>
          </div>
          <button class="btn btn-ghost btn-sm" @click="doLogout">登出</button>
        </template>
        <template v-else-if="auth.user?.role === 'requester'">
          <RouterLink to="/requester/dashboard" class="nav-link">我的求助</RouterLink>
          <RouterLink to="/request/new" class="nav-link">發布求助</RouterLink>
          <RouterLink to="/resources" class="nav-link">物資共享</RouterLink>
          <div class="nav-divider"></div>
          <div class="nav-user">
            <div class="user-avatar req">{{ auth.user.full_name?.charAt(0) }}</div>
            <span class="user-name">{{ auth.user.full_name }}</span>
          </div>
          <button class="btn btn-ghost btn-sm" @click="doLogout">登出</button>
        </template>
        <template v-else>
          <RouterLink to="/volunteer/register" class="nav-link">成為志工</RouterLink>
          <RouterLink to="/requester/register" class="btn btn-primary btn-sm">尋求協助</RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
function doLogout() { auth.logout(); router.push('/') }
</script>

<style scoped>
.navbar {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid rgba(43,45,66,0.08);
  position: sticky;
  top: 0;
  z-index: 200;
  box-shadow: 0 2px 8px rgba(43,45,66,0.06);
}
.navbar-inner {
  max-width: 1060px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

/* Brand */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  opacity: 1;
}
.brand-icon { font-size: 1.25rem; line-height: 1; }
.brand-text {
  font-size: 1rem;
  font-weight: 800;
  color: var(--c-text);
  letter-spacing: -0.03em;
}

/* Links */
.navbar-links {
  display: flex;
  align-items: center;
  gap: 4px;
}
.nav-link {
  padding: 0.4rem 0.75rem;
  border-radius: var(--r-sm);
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--c-muted);
  text-decoration: none;
  transition: background var(--duration) var(--ease), color var(--duration);
  opacity: 1;
}
.nav-link:hover { background: var(--c-bg-2); color: var(--c-text); }
.nav-link.router-link-active {
  background: var(--c-primary-lt);
  color: var(--c-primary);
  font-weight: 700;
}

.nav-divider {
  width: 1px;
  height: 20px;
  background: var(--c-border-strong);
  margin: 0 8px;
}

/* User chip */
.nav-user {
  display: flex;
  align-items: center;
  gap: 7px;
}
.user-avatar {
  width: 28px; height: 28px;
  border-radius: var(--r-full);
  background: var(--c-primary);
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.78rem;
  font-weight: 700;
}
.user-avatar.req { background: var(--c-accent); }
.user-name { font-size: 0.85rem; font-weight: 600; color: var(--c-text-2); }

.btn-sm { padding: 0.33rem 0.85rem; font-size: 0.82rem; }

@media (max-width: 600px) {
  .nav-link { display: none; }
  .nav-divider { display: none; }
  .user-name { display: none; }
}
</style>
