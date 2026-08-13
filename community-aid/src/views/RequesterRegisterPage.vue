<template>
  <div class="page-container-sm" style="padding-top:2.5rem">
    <div class="reg-header">
      <RouterLink to="/" class="back-link">← 返回首頁</RouterLink>
      <h1 class="reg-title">🤲 尋求協助</h1>
      <p class="reg-sub">三種方式，選擇最適合你的入口</p>
    </div>

    <!-- 入口選擇（未選時顯示） -->
    <div v-if="!entryType" class="entry-grid">
      <button class="entry-card" @click="entryType = 'A'">
        <div class="e-icon">👴</div>
        <div class="e-title">入口 A</div>
        <div class="e-name">本人自行登記</div>
        <div class="e-desc">長者親自填寫，免簡訊驗證，3 步完成</div>
      </button>
      <button class="entry-card" @click="entryType = 'B'">
        <div class="e-icon">👨‍👩‍👦</div>
        <div class="e-title">入口 B</div>
        <div class="e-name">家屬代辦</div>
        <div class="e-desc">由家屬幫長者填寫資料，留家屬手機作聯絡</div>
      </button>
      <button class="entry-card" @click="entryType = 'C'">
        <div class="e-icon">🙋</div>
        <div class="e-title">入口 C</div>
        <div class="e-name">志工代辦</div>
        <div class="e-desc">由社區志工協助長者完成登記</div>
      </button>
    </div>

    <!-- 入口 A：長者自行 -->
    <template v-if="entryType === 'A'">
      <div class="entry-label">
        <button class="back-entry" @click="entryType = null">← 重新選擇</button>
        👴 入口 A — 長者自行登記
      </div>
      <div v-if="!done" class="card">
        <div class="alert alert-info">
          免簡訊驗證，填完即可使用！
        </div>
        <div class="form-group">
          <label class="form-label">姓名<span class="required">*</span></label>
          <input class="form-input" v-model="formA.full_name" type="text" placeholder="請輸入姓名" />
        </div>
        <div class="form-group">
          <label class="form-label">手機號碼<span class="required">*</span></label>
          <input class="form-input" v-model="formA.phone" type="tel" placeholder="09XXXXXXXX" maxlength="10" />
          <div v-if="formA.phone && !phoneAValid" class="form-error">請輸入正確的手機號碼</div>
        </div>
        <AddressForm v-model="formA.address" />
        <div class="form-group">
          <label class="form-label">個人備注（選填）</label>
          <textarea class="form-textarea" v-model="formA.note" placeholder="例如：行動不便、需要輪椅通道" />
        </div>
        <button class="btn btn-success btn-full btn-lg" @click="submitA" :disabled="!formAValid || submitting">
          {{ submitting ? '送出中…' : '✓ 完成登記' }}
        </button>
      </div>
    </template>

    <!-- 入口 B / C：代辦 -->
    <template v-if="entryType === 'B' || entryType === 'C'">
      <div class="entry-label">
        <button class="back-entry" @click="entryType = null">← 重新選擇</button>
        {{ entryType === 'B' ? '👨‍👩‍👦 入口 B — 家屬代辦' : '🙋 入口 C — 志工代辦' }}
      </div>
      <div v-if="!done" class="card">
        <div class="alert alert-warn">
          請確認已取得長者本人同意後再代為填寫
        </div>
        <h3 class="sub-section">長者基本資料</h3>
        <div class="form-group">
          <label class="form-label">長者姓名<span class="required">*</span></label>
          <input class="form-input" v-model="formBC.full_name" type="text" placeholder="請輸入長者姓名" />
        </div>
        <div class="form-group">
          <label class="form-label">長者手機號碼<span class="required">*</span></label>
          <input class="form-input" v-model="formBC.phone" type="tel" placeholder="09XXXXXXXX" maxlength="10" />
        </div>
        <AddressForm v-model="formBC.address" />

        <h3 class="sub-section" style="margin-top:1.5rem">
          {{ entryType === 'B' ? '家屬資料' : '代辦志工資料' }}
        </h3>
        <div class="form-group">
          <label class="form-label">{{ entryType === 'B' ? '家屬' : '志工' }}姓名<span class="required">*</span></label>
          <input class="form-input" v-model="formBC.proxy_name" type="text" placeholder="請輸入姓名" />
        </div>
        <div class="form-group">
          <label class="form-label">{{ entryType === 'B' ? '家屬' : '志工' }}手機（作為代理聯絡人）<span class="required">*</span></label>
          <input class="form-input" v-model="formBC.proxy_phone" type="tel" placeholder="09XXXXXXXX" maxlength="10" />
        </div>
        <div class="form-group">
          <label class="form-label">與長者關係</label>
          <select class="form-select" v-model="formBC.relation">
            <option value="">請選擇（選填）</option>
            <option v-for="r in relations" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>
        <label class="check-row">
          <input type="checkbox" v-model="formBC.consent" />
          <span>長者已同意由本人代為填寫此資料</span>
        </label>
        <button class="btn btn-success btn-full btn-lg" style="margin-top:1rem"
          @click="submitBC" :disabled="!formBCValid || submitting">
          {{ submitting ? '送出中…' : '✓ 完成代辦登記' }}
        </button>
      </div>
    </template>

    <!-- 完成畫面 -->
    <div v-if="done" class="card done-card">
      <div class="done-icon">✅</div>
      <h2>登記完成！</h2>
      <p v-if="entryType === 'A'">歡迎加入，{{ formA.full_name }}！現在可以發布求助需求了。</p>
      <p v-else>已成功為 {{ formBC.full_name }} 完成登記。</p>
      <RouterLink to="/requester/dashboard" class="btn btn-primary btn-lg btn-full" style="margin-top:1rem">
        前往求助者後台 →
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AddressForm from '@/components/AddressForm.vue'

const auth = useAuthStore()
const entryType = ref(null)
const done = ref(false)
const submitting = ref(false)

const formA = ref({ full_name: '', phone: '', address: { city: '', district: '', detail: '' }, note: '' })
const formBC = ref({
  full_name: '', phone: '', address: { city: '', district: '', detail: '' },
  proxy_name: '', proxy_phone: '', relation: '', consent: false
})

const relations = ['兒子', '女兒', '配偶', '兄弟姐妹', '孫子女', '鄰居', '朋友', '社區志工', '其他']

const phoneAValid = computed(() => /^09\d{8}$/.test(formA.value.phone))
const formAValid = computed(() =>
  formA.value.full_name.trim() && phoneAValid.value &&
  formA.value.address.city && formA.value.address.district && formA.value.address.detail.trim()
)
const formBCValid = computed(() =>
  formBC.value.full_name.trim() && /^09\d{8}$/.test(formBC.value.phone) &&
  formBC.value.address.city && formBC.value.address.district && formBC.value.address.detail.trim() &&
  formBC.value.proxy_name.trim() && /^09\d{8}$/.test(formBC.value.proxy_phone) &&
  formBC.value.consent
)

async function submitA() {
  submitting.value = true
  await new Promise(r => setTimeout(r, 800))
  // TODO: POST /api/auth/requester/register { reg_method: 'self', ...formA }
  auth.login({ full_name: formA.value.full_name, role: 'requester' }, 'mock_token_req')
  done.value = true
  submitting.value = false
}

async function submitBC() {
  submitting.value = true
  await new Promise(r => setTimeout(r, 800))
  // TODO: POST /api/auth/requester/register { reg_method: entryType === 'B' ? 'proxy_family' : 'proxy_volunteer', ...formBC }
  auth.login({ full_name: formBC.value.full_name, role: 'requester' }, 'mock_token_req')
  done.value = true
  submitting.value = false
}
</script>

<style scoped>
.reg-header { text-align: center; margin-bottom: 2.5rem; }
.back-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 0.82rem; color: var(--c-muted); font-weight: 500;
  padding: 4px 10px; border-radius: var(--r-sm);
  transition: background var(--duration), color var(--duration); opacity: 1;
}
.back-link:hover { background: var(--c-bg-2); color: var(--c-text); }
.reg-title {
  font-size: 2rem; font-weight: 900; letter-spacing: -0.04em;
  color: var(--c-text); margin: 0.75rem 0 0.4rem;
}
.reg-sub { color: var(--c-muted); }

/* Entry grid */
.entry-grid { display: grid; grid-template-columns: 1fr; gap: 0.85rem; margin-bottom: 1rem; }
@media (min-width: 500px) { .entry-grid { grid-template-columns: 1fr 1fr 1fr; } }
.entry-card {
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: var(--r-xl);
  padding: 1.7rem 1.2rem;
  text-align: center;
  cursor: pointer;
  transition: border-color var(--duration) var(--ease), transform var(--duration) var(--ease), box-shadow var(--duration) var(--ease);
  font-family: var(--font);
  box-shadow: var(--shadow-card);
}
.entry-card:hover {
  border-color: var(--c-accent);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}
.e-icon { font-size: 2.5rem; margin-bottom: 0.6rem; }
.e-title {
  font-size: 0.72rem; color: var(--c-accent); font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.07em;
}
.e-name { font-size: 0.97rem; font-weight: 700; margin: 0.25rem 0 0.5rem; color: var(--c-text); }
.e-desc { font-size: 0.79rem; color: var(--c-muted); line-height: 1.5; }

/* Entry label */
.entry-label {
  display: flex; align-items: center; gap: 10px;
  font-weight: 700; margin-bottom: 1.2rem;
  font-size: 0.93rem; color: var(--c-text-2);
}
.back-entry {
  font-size: 0.82rem; color: var(--c-muted);
  background: var(--c-bg-2); border: 1px solid var(--c-border);
  cursor: pointer; font-family: var(--font);
  padding: 4px 12px; border-radius: var(--r-sm);
  transition: background var(--duration); opacity: 1;
}
.back-entry:hover { background: var(--c-border); }
.sub-section {
  font-size: 0.88rem; font-weight: 700; color: var(--c-text-2);
  margin-bottom: 0.9rem; padding-top: 0.3rem;
  display: flex; align-items: center; gap: 6px;
}
.sub-section::after { content: ''; flex: 1; height: 1px; background: var(--c-border); }
.check-row {
  display: flex; gap: 9px; align-items: flex-start;
  font-size: 0.88rem; margin-top: 1rem; cursor: pointer; color: var(--c-text-2);
}
.check-row input { margin-top: 3px; flex-shrink: 0; accent-color: var(--c-primary); }

.done-card { text-align: center; padding: 3.5rem 2rem; }
.done-icon { font-size: 4rem; margin-bottom: 1.25rem; line-height: 1; }
.done-card h2 { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.03em; color: var(--c-text); margin-bottom: 0.6rem; }
.done-card p { color: var(--c-muted); margin-bottom: 0.5rem; font-size: 0.93rem; }
</style>
