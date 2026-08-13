<template>
  <div class="page-container" style="padding-top:1.5rem">
    <div class="dash-header">
      <div>
        <h1 class="dash-title">🤲 {{ auth.user?.full_name }} 的求助後台</h1>
        <p class="dash-sub">管理你的求助需求與配對志工</p>
      </div>
      <RouterLink to="/request/new" class="btn btn-success">+ 發布新求助</RouterLink>
    </div>

    <!-- 統計卡 -->
    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-num">{{ myRequests.length }}</div>
        <div class="stat-label">總求助數</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">{{ myRequests.filter(r => r.status === 'open').length }}</div>
        <div class="stat-label">等待配對</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">{{ myRequests.filter(r => r.status === 'matched' || r.status === 'in_progress').length }}</div>
        <div class="stat-label">進行中</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">{{ myRequests.filter(r => r.status === 'completed').length }}</div>
        <div class="stat-label">已完成</div>
      </div>
    </div>

    <!-- 求助清單 -->
    <h2 class="sec-title-sm">我的求助需求</h2>
    <div class="req-list">
      <div class="req-card" v-for="req in myRequests" :key="req.id">
        <div class="rc-top">
          <span class="badge" :class="statusBadge(req.status).cls">{{ statusBadge(req.status).label }}</span>
          <span class="badge badge-gray">{{ categoryLabel(req.category) }}</span>
          <button class="rc-delete" @click="deleteReq(req)" title="刪除">✕</button>
        </div>
        <h3 class="rc-title">{{ req.title }}</h3>
        <p class="rc-meta">{{ req.preferred_date }} ｜ 約 {{ req.estimated_hours }} 小時</p>

        <!-- 已配對：顯示志工資訊 -->
        <div v-if="req.status === 'matched' || req.status === 'in_progress'" class="vol-box">
          <div class="vb-title">🙋 已配對志工</div>
          <div>姓名：{{ req.volunteer_name }}</div>
          <div>電話：{{ req.volunteer_phone }}</div>
        </div>
      </div>

      <div v-if="myRequests.length === 0" class="empty-state">
        <div style="font-size:2.5rem">🔍</div>
        <p>目前尚無求助需求，點擊上方「發布新求助」開始</p>
      </div>
    </div>

    <!-- 物資共享快捷入口 -->
    <div class="res-banner">
      <div>
        <div style="font-weight:700; font-size:1.05rem">📦 社區物資共享</div>
        <div style="font-size:0.88rem; color:#64748b; margin-top:4px">瀏覽社區居民提供的免費物資</div>
      </div>
      <RouterLink to="/resources" class="btn btn-outline">前往瀏覽</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const categories = [
  { value: 'transportation', label: '交通接送' }, { value: 'errand', label: '代購跑腿' },
  { value: 'home_repair', label: '居家維修' }, { value: 'companionship', label: '陪伴聊天' },
  { value: 'medical_accompany', label: '陪同就醫' }, { value: 'tech_help', label: '科技協助' },
  { value: 'other', label: '其他' },
]
function categoryLabel(v) { return categories.find(c => c.value === v)?.label || v }

function statusBadge(s) {
  return {
    open:        { cls: 'badge-blue',   label: '🔵 等待配對' },
    matched:     { cls: 'badge-yellow', label: '⏳ 已配對' },
    in_progress: { cls: 'badge-yellow', label: '🔄 進行中' },
    completed:   { cls: 'badge-green',  label: '✅ 已完成' },
    cancelled:   { cls: 'badge-gray',   label: '⬜ 已取消' },
  }[s] || { cls: 'badge-gray', label: s }
}

// 模擬資料（正式版改為 GET /api/help-requests?mine=true）
const myRequests = ref([
  { id: 'r1', title: '需要協助就醫', category: 'medical_accompany', status: 'matched', preferred_date: '2024-07-20', estimated_hours: 3, volunteer_name: '陳○○', volunteer_phone: '0987-XXX-XXX' },
  { id: 'r2', title: '幫忙買菜', category: 'errand', status: 'open', preferred_date: '2024-07-25', estimated_hours: 1 },
])

function deleteReq(req) {
  if (confirm(`確定取消「${req.title}」這筆求助嗎？`)) {
    // TODO: DELETE /api/help-requests/:id
    myRequests.value = myRequests.value.filter(r => r.id !== req.id)
  }
}
</script>

<style scoped>
.dash-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap;
}
.dash-title { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.03em; color: var(--c-text); }
.dash-sub { font-size: 0.85rem; color: var(--c-muted); margin-top: 3px; }

/* 統計卡 Grid */
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem; }
@media (max-width: 500px) { .stat-grid { grid-template-columns: 1fr 1fr; } }
.stat-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-xl);
  padding: 1.4rem;
  text-align: center;
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--duration), transform var(--duration);
}
.stat-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.stat-num { font-size: 2.2rem; font-weight: 900; color: var(--c-primary); letter-spacing: -0.04em; }
.stat-label { font-size: 0.78rem; color: var(--c-muted); margin-top: 4px; }

.sec-title-sm {
  font-size: 0.8rem; font-weight: 700; margin-bottom: 1rem;
  color: var(--c-muted); text-transform: uppercase; letter-spacing: 0.07em;
}

/* 求助卡片 Grid */
.req-list {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  margin-bottom: 2rem;
}
.req-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-xl);
  padding: 1.3rem 1.4rem;
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--duration), transform var(--duration);
}
.req-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.rc-top { display: flex; gap: 6px; align-items: center; margin-bottom: 0.65rem; flex-wrap: wrap; }
.rc-delete {
  margin-left: auto; background: none; border: none;
  color: var(--c-subtle); cursor: pointer; font-size: 0.85rem;
  padding: 3px 8px; border-radius: var(--r-sm);
  transition: background var(--duration), color var(--duration);
}
.rc-delete:hover { background: var(--c-danger-lt); color: var(--c-danger); }
.rc-title { font-size: 0.97rem; font-weight: 700; margin-bottom: 0.3rem; color: var(--c-text); }
.rc-meta { font-size: 0.8rem; color: var(--c-muted); }
.vol-box {
  background: var(--c-primary-lt);
  border: 1px solid rgba(255,107,53,0.2);
  border-radius: var(--r-md);
  padding: 0.85rem 1rem;
  margin-top: 0.75rem;
  font-size: 0.86rem;
  line-height: 1.75;
}
.vb-title { font-weight: 700; margin-bottom: 4px; color: var(--c-primary); }
.empty-state {
  text-align: center; padding: 3rem 1rem;
  color: var(--c-subtle); grid-column: 1 / -1; font-size: 2rem;
}
.empty-state p { font-size: 0.86rem; margin-top: 0.5rem; color: var(--c-muted); }
.res-banner {
  background: linear-gradient(135deg, var(--c-primary-lt), var(--c-accent-lt));
  border: 1px solid rgba(255,107,53,0.15);
  border-radius: var(--r-xl);
  padding: 1.3rem 1.5rem;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  box-shadow: var(--shadow-card);
}
</style>
