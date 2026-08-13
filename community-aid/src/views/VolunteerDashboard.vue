<template>
  <div class="dashboard-layout">
    <!-- 側欄 -->
    <aside class="sidebar">
      <div class="sidebar-logo">🏘️ 志工後台</div>
      <nav class="sidebar-nav">
        <button :class="['snav', { active: view === 'map' }]" @click="view = 'map'">🗺️ 附近地圖</button>
        <button :class="['snav', { active: view === 'list' }]" @click="view = 'list'">📋 清單視圖</button>
        <button :class="['snav', { active: view === 'my' }]" @click="view = 'my'">✅ 我的任務</button>
        <RouterLink to="/resources" class="snav">📦 物資共享</RouterLink>
      </nav>
      <div class="sidebar-user">
        <div class="su-name">{{ auth.user?.full_name }}</div>
        <div class="su-role">志工</div>
        <button class="btn btn-ghost btn-sm" @click="doLogout" style="margin-top:8px; width:100%">登出</button>
      </div>
    </aside>

    <!-- 主內容 -->
    <main class="main-area">
      <!-- 地圖視圖 -->
      <div v-show="view === 'map'" class="map-view">
        <div class="view-toolbar">
          <h2 class="view-title">附近求助地圖</h2>
          <div class="toolbar-filters">
            <select class="form-select filter-sel" v-model="filterCategory">
              <option value="">全部類型</option>
              <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
            <select class="form-select filter-sel" v-model="filterRadius">
              <option value="1000">1 公里內</option>
              <option value="3000">3 公里內</option>
              <option value="5000">5 公里內</option>
              <option value="10000">10 公里內</option>
            </select>
          </div>
        </div>
        <div id="leaflet-map" class="leaflet-wrap"></div>
        <div class="map-legend">
          <span class="leg-item"><span class="dot red"></span>緊急</span>
          <span class="leg-item"><span class="dot blue"></span>一般</span>
          <span class="leg-item"><span class="dot green"></span>我的任務</span>
        </div>
      </div>

      <!-- 清單視圖 -->
      <div v-show="view === 'list'" class="list-view">
        <div class="view-toolbar">
          <h2 class="view-title">求助清單</h2>
          <div class="toolbar-filters">
            <select class="form-select filter-sel" v-model="filterCategory">
              <option value="">全部類型</option>
              <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
            </select>
            <select class="form-select filter-sel" v-model="sortBy">
              <option value="distance">距離最近</option>
              <option value="date">日期最近</option>
              <option value="urgent">緊急優先</option>
            </select>
          </div>
        </div>
        <div class="req-list">
          <div class="req-card" v-for="req in filteredRequests" :key="req.id">
            <div class="rc-top">
              <span class="badge" :class="req.is_urgent ? 'badge-red' : 'badge-blue'">
                {{ req.is_urgent ? '🔴 緊急' : '🔵 一般' }}
              </span>
              <span class="badge badge-gray">{{ categoryLabel(req.category) }}</span>
              <span class="rc-dist">📍 {{ req.distance_km }} 公里</span>
            </div>
            <h3 class="rc-title">{{ req.title }}</h3>
            <p class="rc-meta">{{ req.addr_city }}{{ req.addr_district }} ｜ {{ req.preferred_date }} ｜ 約 {{ req.estimated_hours }} 小時</p>
            <p class="rc-desc">{{ req.description }}</p>
            <div class="rc-btns">
              <button class="btn btn-primary" @click="acceptReq(req)">✋ 接受任務</button>
              <button class="btn btn-ghost" @click="viewDetail(req)">查看詳情</button>
            </div>
          </div>
          <div v-if="filteredRequests.length === 0" class="empty-state">
            <div>🔍</div>
            <p>目前附近沒有符合條件的求助需求</p>
          </div>
        </div>
      </div>

      <!-- 我的任務 -->
      <div v-show="view === 'my'" class="list-view">
        <div class="view-toolbar"><h2 class="view-title">我的任務</h2></div>
        <div class="req-list">
          <div class="req-card" v-for="m in myMatches" :key="m.id">
            <div class="rc-top">
              <span class="badge" :class="matchBadge(m.status).cls">{{ matchBadge(m.status).label }}</span>
            </div>
            <h3 class="rc-title">{{ m.title }}</h3>
            <p class="rc-meta">{{ m.addr_city }}{{ m.addr_district }} ｜ {{ m.preferred_date }}</p>
            <!-- 配對後揭露聯絡資訊 -->
            <template v-if="m.status === 'accepted' || m.status === 'in_progress'">
              <div class="contact-box">
                <div>👤 求助者：{{ m.requester_name }}</div>
                <div>📞 電話：{{ m.requester_phone }}</div>
                <div>📍 地址：{{ m.full_address }}</div>
              </div>
            </template>
            <div class="rc-btns" v-if="m.status === 'accepted'">
              <button class="btn btn-success" @click="completeMatch(m)">✓ 完成任務</button>
            </div>
          </div>
          <div v-if="myMatches.length === 0" class="empty-state">
            <div>📋</div>
            <p>目前尚無進行中的任務</p>
          </div>
        </div>
      </div>
    </main>

    <!-- 詳情 Modal -->
    <div v-if="selectedReq" class="modal-overlay" @click.self="selectedReq = null">
      <div class="modal-box">
        <button class="modal-close" @click="selectedReq = null">✕</button>
        <div class="rc-top">
          <span class="badge" :class="selectedReq.is_urgent ? 'badge-red' : 'badge-blue'">
            {{ selectedReq.is_urgent ? '🔴 緊急' : '🔵 一般' }}
          </span>
          <span class="badge badge-gray">{{ categoryLabel(selectedReq.category) }}</span>
        </div>
        <h2 style="margin: 0.75rem 0 0.5rem">{{ selectedReq.title }}</h2>
        <p class="rc-meta">{{ selectedReq.addr_city }}{{ selectedReq.addr_district }}</p>
        <p class="rc-meta">日期：{{ selectedReq.preferred_date }} ｜ 預估 {{ selectedReq.estimated_hours }} 小時</p>
        <p style="margin: 1rem 0; font-size: 0.95rem; color: #334155;">{{ selectedReq.description }}</p>
        <div class="alert alert-info" style="margin-bottom:1rem; font-size:0.85rem">
          📍 詳細地址與聯絡電話將在接受任務後才顯示
        </div>
        <div style="display:flex; gap:10px">
          <button class="btn btn-primary btn-lg" style="flex:1" @click="acceptReq(selectedReq); selectedReq = null">
            ✋ 接受任務
          </button>
          <button class="btn btn-ghost" @click="selectedReq = null">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const view = ref('map')
const filterCategory = ref('')
const filterRadius = ref('3000')
const sortBy = ref('distance')
const selectedReq = ref(null)

function doLogout() { auth.logout(); router.push('/') }

const categories = [
  { value: 'transportation', label: '交通接送' },
  { value: 'errand', label: '代購跑腿' },
  { value: 'home_repair', label: '居家維修' },
  { value: 'companionship', label: '陪伴聊天' },
  { value: 'medical_accompany', label: '陪同就醫' },
  { value: 'tech_help', label: '科技協助' },
  { value: 'other', label: '其他' },
]

function categoryLabel(v) { return categories.find(c => c.value === v)?.label || v }

// 模擬求助資料（正式版改為 GET /api/help-requests?lat=&lng=&radius= ）
const requests = ref([
  { id: '1', title: '需要協助就醫', category: 'medical_accompany', is_urgent: true, addr_city: '台北市', addr_district: '大安區', preferred_date: '2024-07-20', estimated_hours: 3, description: '本週六上午需要陪同前往醫院複診，行動不便，需要輪椅協助。', distance_km: 0.8 },
  { id: '2', title: '幫忙買菜', category: 'errand', is_urgent: false, addr_city: '台北市', addr_district: '信義區', preferred_date: '2024-07-18', estimated_hours: 1, description: '家中老人行動不便，需要幫忙至附近市場採買蔬菜水果。', distance_km: 1.2 },
  { id: '3', title: '水龍頭漏水修繕', category: 'home_repair', is_urgent: false, addr_city: '台北市', addr_district: '松山區', preferred_date: '2024-07-22', estimated_hours: 2, description: '廚房水龍頭有點漏水，需要有修繕經驗的志工協助處理。', distance_km: 2.1 },
  { id: '4', title: '教用智慧型手機', category: 'tech_help', is_urgent: false, addr_city: '台北市', addr_district: '中山區', preferred_date: '2024-07-21', estimated_hours: 1.5, description: '希望有人教我如何使用 LINE 視訊通話，想跟遠地的孩子視訊。', distance_km: 2.8 },
])

const myMatches = ref([
  { id: 'm1', title: '協助就醫（上午）', status: 'accepted', addr_city: '台北市', addr_district: '大安區', preferred_date: '2024-07-15', requester_name: '王○先生', requester_phone: '0912-XXX-XXX', full_address: '台北市大安區和平東路一段100號' },
])

const filteredRequests = computed(() => {
  let list = requests.value
  if (filterCategory.value) list = list.filter(r => r.category === filterCategory.value)
  if (sortBy.value === 'distance') list = [...list].sort((a, b) => a.distance_km - b.distance_km)
  if (sortBy.value === 'urgent') list = [...list].sort((a, b) => (b.is_urgent ? 1 : 0) - (a.is_urgent ? 1 : 0))
  return list
})

function matchBadge(s) {
  return { accepted: { cls: 'badge-blue', label: '⏳ 進行中' }, in_progress: { cls: 'badge-yellow', label: '🔄 執行中' }, completed: { cls: 'badge-green', label: '✅ 已完成' } }[s] || { cls: 'badge-gray', label: s }
}

function viewDetail(req) { selectedReq.value = req }
function acceptReq(req) {
  // TODO: POST /api/matches { request_id: req.id }
  alert(`已接受「${req.title}」，聯絡資訊將顯示於「我的任務」中`)
}
function completeMatch(m) {
  // TODO: PATCH /api/matches/:id { status: 'completed' }
  m.status = 'completed'
}

// Leaflet 地圖初始化
onMounted(async () => {
  if (view.value === 'map') initMap()
})
watch(view, (v) => { if (v === 'map') setTimeout(initMap, 50) })

let mapInstance = null
function initMap() {
  if (mapInstance) return
  const L = window.L
  if (!L) return
  mapInstance = L.map('leaflet-map').setView([25.047, 121.517], 14)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapInstance)

  // 模擬標記
  const coords = [
    [25.055, 121.531, '需要協助就醫', true],
    [25.041, 121.526, '幫忙買菜', false],
    [25.051, 121.558, '水龍頭漏水修繕', false],
    [25.063, 121.524, '教用智慧型手機', false],
  ]
  coords.forEach(([lat, lng, title, urgent]) => {
    const marker = L.circleMarker([lat, lng], {
      radius: 10,
      fillColor: urgent ? '#dc2626' : '#2563eb',
      color: '#fff',
      weight: 2,
      fillOpacity: 0.9
    })
    marker.bindPopup(`<strong>${title}</strong><br><small>點擊查看詳情</small>`)
    marker.addTo(mapInstance)
  })
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}
/* ── Sidebar ─── */
.sidebar {
  width: 210px;
  flex-shrink: 0;
  background: #1e1a2e;   /* 深紫灰，比純黑更有層次感 */
  color: #e8e4f0;
  display: flex;
  flex-direction: column;
  padding: 1rem 0.75rem;
  position: sticky;
  top: 0;
  height: 100vh;
  border-right: 1px solid rgba(255,255,255,0.06);
}
.sidebar-logo {
  font-size: 1rem; font-weight: 800;
  padding: 0.5rem 0.7rem 1.3rem;
  color: #fff;
  letter-spacing: -0.03em;
}
.sidebar-nav { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.snav {
  display: block;
  padding: 0.6rem 0.8rem;
  border-radius: var(--r-sm);
  font-size: 0.88rem;
  font-weight: 500;
  color: rgba(255,255,255,0.45);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: var(--font);
  text-decoration: none;
  transition: background var(--duration) var(--ease), color var(--duration);
}
.snav:hover { background: rgba(255,255,255,0.08); color: #fff; }
.snav.active, .snav.router-link-active {
  background: rgba(255,107,53,0.22);  /* 橘色高亮 */
  color: #FF9166;
}
.sidebar-user {
  border-top: 1px solid rgba(255,255,255,0.08);
  padding-top: 0.85rem;
}
.su-name { font-weight: 700; font-size: 0.88rem; color: #fff; }
.su-role { font-size: 0.76rem; color: rgba(255,255,255,0.4); margin-top: 1px; }
.btn-sm { padding: 0.32rem 0.8rem; font-size: 0.8rem; border-radius: var(--r-sm); }

/* Main */
.main-area { flex: 1; overflow-y: auto; background: var(--c-bg); }
.view-toolbar {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
  padding: 0.85rem 1.5rem;
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-bottom: 1px solid var(--c-border);
  position: sticky; top: 0; z-index: 10;
  box-shadow: var(--shadow-xs);
}
.view-title { font-size: 1rem; font-weight: 700; letter-spacing: -0.02em; }
.toolbar-filters { display: flex; gap: 8px; }
.filter-sel { width: auto; min-width: 120px; padding: 0.4rem 0.75rem; font-size: 0.83rem; }

/* Map */
.map-view { display: flex; flex-direction: column; height: calc(100vh - 58px); }
.leaflet-wrap { flex: 1; z-index: 1; }
.map-legend {
  display: flex; gap: 1.2rem; padding: 0.5rem 1.2rem;
  background: var(--glass-bg); backdrop-filter: var(--glass-blur);
  border-top: 1px solid var(--c-border); font-size: 0.8rem;
}
.leg-item { display: flex; align-items: center; gap: 5px; color: var(--c-muted); }
.dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; }
.dot.red   { background: #ef4444; }
.dot.blue  { background: var(--c-primary); }
.dot.green { background: var(--c-success); }

/* List */
.list-view { padding: 0; }
.req-list {
  padding: 1.2rem 1.5rem;
  display: grid; gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
.req-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-xl);
  padding: 1.2rem 1.4rem;
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--duration) var(--ease), transform var(--duration) var(--ease);
}
.req-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.rc-top { display: flex; gap: 6px; align-items: center; margin-bottom: 0.65rem; flex-wrap: wrap; }
.rc-dist { font-size: 0.78rem; color: var(--c-muted); margin-left: auto; }
.rc-title { font-size: 0.97rem; font-weight: 700; margin-bottom: 0.3rem; color: var(--c-text); letter-spacing: -0.01em; }
.rc-meta { font-size: 0.8rem; color: var(--c-muted); margin-bottom: 0.45rem; }
.rc-desc { font-size: 0.85rem; color: var(--c-text-2); margin-bottom: 1rem; line-height: 1.55; }
.rc-btns { display: flex; gap: 8px; }
.contact-box {
  background: var(--c-accent-lt);
  border: 1px solid rgba(46,196,182,0.3);
  border-radius: var(--r-md);
  padding: 0.9rem 1rem;
  margin: 0.75rem 0;
  font-size: 0.86rem;
  line-height: 1.75;
}
.empty-state { text-align: center; padding: 4rem 1rem; color: var(--c-subtle); font-size: 2rem; }
.empty-state p { font-size: 0.88rem; margin-top: 0.5rem; color: var(--c-muted); }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(10,10,20,0.6);
  backdrop-filter: blur(6px);
  z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 1rem;
}
.modal-box {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-2xl);
  padding: 2rem;
  max-width: 480px; width: 100%;
  position: relative;
  max-height: 90vh; overflow-y: auto;
  box-shadow: var(--shadow-xl);
}
.modal-close {
  position: absolute; top: 1rem; right: 1rem;
  background: var(--c-bg-2); border: 1px solid var(--c-border);
  width: 30px; height: 30px; border-radius: var(--r-full);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; cursor: pointer; color: var(--c-muted);
  transition: background var(--duration);
}
.modal-close:hover { background: var(--c-border); color: var(--c-text); }

@media (max-width: 680px) {
  .sidebar { width: 54px; padding: 0.75rem 0.4rem; }
  .sidebar-logo, .su-name, .su-role, .snav span { display: none; }
  .snav { font-size: 1.1rem; padding: 0.65rem 0; text-align: center; }
}
</style>
