<template>
  <div class="page-container" style="padding-top:1.5rem">
    <div class="page-header">
      <div>
        <h1 class="page-title">📦 社區物資共享</h1>
        <p class="page-sub">社區居民提供的免費物資，歡迎取用</p>
      </div>
      <button class="btn btn-success" @click="showDonate = true">+ 提供物資</button>
    </div>

    <!-- 篩選列 -->
    <div class="filter-bar">
      <input class="form-input search-inp" v-model="search" type="search" placeholder="🔍 搜尋物資…" />
      <select class="form-select filter-sel" v-model="filterCat">
        <option value="">全部類別</option>
        <option v-for="c in resCats" :key="c">{{ c }}</option>
      </select>
      <select class="form-select filter-sel" v-model="filterStatus">
        <option value="">全部狀態</option>
        <option value="available">可領取</option>
        <option value="reserved">已預約</option>
      </select>
    </div>

    <!-- 物資卡片 -->
    <div class="res-grid">
      <div class="res-card" v-for="r in filteredRes" :key="r.id">
        <div class="res-img-wrap">
          <div class="res-img-placeholder">{{ r.icon }}</div>
        </div>
        <div class="res-body">
          <div class="res-top">
            <span class="badge" :class="r.status === 'available' ? 'badge-green' : 'badge-yellow'">
              {{ r.status === 'available' ? '✅ 可領取' : '⏳ 已預約' }}
            </span>
            <span class="badge badge-gray">{{ r.category }}</span>
          </div>
          <h3 class="res-name">{{ r.name }}</h3>
          <p class="res-desc">{{ r.description }}</p>
          <div class="res-meta">
            📍 {{ r.addr_city }}{{ r.addr_district }} ｜ 數量：{{ r.quantity }}
          </div>
          <div class="res-provider">由 {{ r.provider_name }} 提供</div>
          <button class="btn btn-primary btn-full" style="margin-top:0.8rem"
            :disabled="r.status !== 'available'"
            @click="reserve(r)">
            {{ r.status === 'available' ? '📩 預約領取' : '已被預約' }}
          </button>
        </div>
      </div>
      <div v-if="filteredRes.length === 0" class="empty-state" style="grid-column:1/-1">
        <div style="font-size:2.5rem">📦</div>
        <p>目前沒有符合條件的物資</p>
      </div>
    </div>

    <!-- 提供物資 Modal -->
    <div v-if="showDonate" class="modal-overlay" @click.self="showDonate = false">
      <div class="modal-box">
        <button class="modal-close" @click="showDonate = false">✕</button>
        <h2 style="margin-bottom:1.2rem">提供物資</h2>
        <div class="form-group">
          <label class="form-label">物資名稱<span class="required">*</span></label>
          <input class="form-input" v-model="donateForm.name" type="text" placeholder="例如：輪椅、嬰兒車、書籍" />
        </div>
        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">類別<span class="required">*</span></label>
            <select class="form-select" v-model="donateForm.category">
              <option value="">請選擇</option>
              <option v-for="c in resCats" :key="c">{{ c }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">數量</label>
            <input class="form-input" v-model.number="donateForm.quantity" type="number" min="1" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">說明</label>
          <textarea class="form-textarea" v-model="donateForm.description" placeholder="物資現況、使用建議等" style="min-height:70px" />
        </div>
        <AddressForm v-model="donateForm.address" />
        <div class="modal-btns">
          <button class="btn btn-ghost" @click="showDonate = false">取消</button>
          <button class="btn btn-success" @click="submitDonate" :disabled="!donateValid">確認提供</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AddressForm from '@/components/AddressForm.vue'

const search = ref('')
const filterCat = ref('')
const filterStatus = ref('')
const showDonate = ref(false)

const resCats = ['食物/飲品', '生活用品', '醫療輔具', '書籍/文具', '嬰幼兒用品', '衣物/鞋子', '家電/3C', '其他']

const donateForm = ref({ name: '', category: '', quantity: 1, description: '', address: { city: '', district: '', detail: '' } })
const donateValid = computed(() => donateForm.value.name.trim() && donateForm.value.category)

const resources = ref([
  { id: '1', name: '輪椅（可借用）', category: '醫療輔具', status: 'available', description: '九成新，可外借，歸還時清潔即可', addr_city: '台北市', addr_district: '大安區', quantity: 1, provider_name: '陳○○', icon: '♿', tags: ['輪椅'] },
  { id: '2', name: '嬰兒推車', category: '嬰幼兒用品', status: 'available', description: '寶寶長大不用了，功能正常，送有需要的家庭', addr_city: '台北市', addr_district: '信義區', quantity: 1, provider_name: '林○○', icon: '🛒', tags: ['嬰兒車'] },
  { id: '3', name: '兒童故事書（20本）', category: '書籍/文具', status: 'reserved', description: '適合3-8歲，已消毒，整套贈出', addr_city: '台北市', addr_district: '中山區', quantity: 20, provider_name: '王○○', icon: '📚', tags: ['書籍'] },
  { id: '4', name: '米（5公斤）', category: '食物/飲品', status: 'available', description: '台梗米，未開封，因家中存量過多分享', addr_city: '台北市', addr_district: '松山區', quantity: 5, provider_name: '社區協會', icon: '🍚', tags: ['米'] },
  { id: '5', name: '老花眼鏡（+250度）', category: '醫療輔具', status: 'available', description: '品牌不詳，鏡框完好，適合長者使用', addr_city: '台北市', addr_district: '文山區', quantity: 2, provider_name: '志工站', icon: '👓', tags: ['眼鏡'] },
  { id: '6', name: '冬季大衣（XL）', category: '衣物/鞋子', status: 'available', description: '深藍色，已乾洗，適合身材較高者', addr_city: '台北市', addr_district: '士林區', quantity: 1, provider_name: '黃○○', icon: '🧥', tags: ['衣物'] },
])

const filteredRes = computed(() => resources.value.filter(r => {
  const matchSearch = !search.value || r.name.includes(search.value) || r.description.includes(search.value)
  const matchCat = !filterCat.value || r.category === filterCat.value
  const matchStatus = !filterStatus.value || r.status === filterStatus.value
  return matchSearch && matchCat && matchStatus
}))

function reserve(r) {
  if (confirm(`確定預約領取「${r.name}」嗎？\n\n提供者聯絡方式將在確認後顯示。`)) {
    r.status = 'reserved'
    // TODO: POST /api/resources/:id/reserve
  }
}

function submitDonate() {
  // TODO: POST /api/resources { ...donateForm.value }
  resources.value.unshift({
    id: Date.now().toString(),
    name: donateForm.value.name,
    category: donateForm.value.category,
    status: 'available',
    description: donateForm.value.description,
    addr_city: donateForm.value.address.city,
    addr_district: donateForm.value.address.district,
    quantity: donateForm.value.quantity,
    provider_name: '我',
    icon: '📦',
    tags: []
  })
  showDonate.value = false
  Object.assign(donateForm.value, { name: '', category: '', quantity: 1, description: '', address: { city: '', district: '', detail: '' } })
}
</script>

<style scoped>
.page-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;
}
.page-title { font-size: 1.6rem; font-weight: 900; letter-spacing: -0.03em; color: var(--c-text); }
.page-sub { font-size: 0.85rem; color: var(--c-muted); margin-top: 3px; }

.filter-bar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1.75rem; }
.search-inp { flex: 1; min-width: 180px; }
.filter-sel { width: auto; min-width: 110px; padding: 0.48rem 0.85rem; font-size: 0.85rem; }

/* 物資卡片 Grid */
.res-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.2rem;
}
.res-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-xl);
  overflow: hidden;
  display: flex; flex-direction: column;
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--duration) var(--ease), transform var(--duration) var(--ease);
}
.res-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); }
.res-img-wrap {
  background: linear-gradient(135deg, var(--c-primary-lt), var(--c-accent-lt));
  height: 110px;
  display: flex; align-items: center; justify-content: center;
}
.res-img-placeholder { font-size: 3.8rem; }
.res-body { padding: 1.1rem 1.2rem; flex: 1; display: flex; flex-direction: column; }
.res-top { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 0.6rem; }
.res-name { font-size: 0.97rem; font-weight: 700; margin-bottom: 0.3rem; color: var(--c-text); letter-spacing: -0.01em; }
.res-desc { font-size: 0.81rem; color: var(--c-text-2); line-height: 1.55; flex: 1; margin-bottom: 0.55rem; }
.res-meta { font-size: 0.77rem; color: var(--c-muted); }
.res-provider { font-size: 0.76rem; color: var(--c-subtle); margin-top: 2px; }

.empty-state { text-align: center; padding: 4rem; color: var(--c-subtle); font-size: 2rem; }
.empty-state p { font-size: 0.88rem; margin-top: 0.5rem; color: var(--c-muted); }

.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(10,10,20,0.55);
  backdrop-filter: blur(8px);
  z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 1rem;
}
.modal-box {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-2xl);
  padding: 1.8rem; max-width: 480px; width: 100%;
  position: relative; max-height: 90vh; overflow-y: auto;
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
.modal-btns { display: flex; gap: 10px; justify-content: flex-end; margin-top: 1.2rem; }
</style>
