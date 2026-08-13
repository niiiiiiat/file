<template>
  <div class="page-container-sm" style="padding-top:2rem">
    <div class="page-header">
      <RouterLink to="/requester/dashboard" class="back-link">← 返回後台</RouterLink>
      <h1 class="page-title">📝 發布求助需求</h1>
    </div>

    <div v-if="!submitted" class="card">
      <div class="form-group">
        <label class="form-label">需求標題<span class="required">*</span></label>
        <input class="form-input" v-model="form.title" type="text" placeholder="例如：需要協助就醫" maxlength="50" />
        <div class="form-hint">{{ form.title.length }}/50 字</div>
      </div>

      <div class="form-group">
        <label class="form-label">服務類型<span class="required">*</span></label>
        <div class="category-grid">
          <button
            v-for="c in categories"
            :key="c.value"
            class="cat-btn"
            :class="{ active: form.category === c.value }"
            @click="form.category = c.value"
          >
            <span class="cat-icon">{{ c.icon }}</span>
            <span>{{ c.label }}</span>
          </button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">需求說明（選填）</label>
        <textarea class="form-textarea" v-model="form.description" placeholder="請描述你需要什麼幫助，越詳細越好…" />
      </div>

      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">希望日期<span class="required">*</span></label>
          <input class="form-input" v-model="form.preferred_date" type="date" :min="today" />
        </div>
        <div class="form-group">
          <label class="form-label">預估時間（小時）</label>
          <select class="form-select" v-model="form.estimated_hours">
            <option value="">不確定</option>
            <option v-for="h in [0.5, 1, 1.5, 2, 3, 4]" :key="h" :value="h">{{ h }} 小時</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">服務地點</label>
        <div class="loc-opts">
          <label class="radio-row">
            <input type="radio" v-model="useHomeAddr" :value="true" />
            使用我的登記地址
          </label>
          <label class="radio-row">
            <input type="radio" v-model="useHomeAddr" :value="false" />
            指定其他地點
          </label>
        </div>
        <AddressForm v-if="!useHomeAddr" v-model="form.address" style="margin-top:0.75rem" />
        <div v-else class="alert alert-info" style="margin-top:0.5rem; font-size:0.85rem">
          將使用您的登記地址，配對確認後才揭露詳細資訊
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">特別需求（選填）</label>
        <div class="req-tags">
          <label class="tag-check" v-for="t in specialTags" :key="t">
            <input type="checkbox" :value="t" v-model="form.special_needs" />
            {{ t }}
          </label>
        </div>
      </div>

      <label class="check-row">
        <input type="checkbox" v-model="form.is_urgent" />
        <span>🔴 標記為<strong>緊急需求</strong>（將優先顯示給志工）</span>
      </label>

      <div v-if="errorMsg" class="alert alert-danger" style="margin-top:1rem">{{ errorMsg }}</div>

      <button class="btn btn-success btn-full btn-lg" style="margin-top:1.5rem"
        @click="submit" :disabled="!formValid || submitting">
        {{ submitting ? '送出中…' : '📢 發布求助' }}
      </button>
    </div>

    <!-- 成功 -->
    <div v-else class="card done-card">
      <div class="done-icon">✅</div>
      <h2>已成功發布！</h2>
      <p>你的求助需求已刊出，附近志工將能看到並接受任務。</p>
      <div style="display:flex; gap:10px; margin-top:1rem">
        <RouterLink to="/requester/dashboard" class="btn btn-primary" style="flex:1">← 返回後台</RouterLink>
        <button class="btn btn-outline" style="flex:1" @click="submitted = false; resetForm()">再發一則</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AddressForm from '@/components/AddressForm.vue'

const today = new Date().toISOString().split('T')[0]
const submitted = ref(false)
const submitting = ref(false)
const errorMsg = ref('')
const useHomeAddr = ref(true)

const categories = [
  { value: 'transportation', label: '交通接送', icon: '🚗' },
  { value: 'errand', label: '代購跑腿', icon: '🛒' },
  { value: 'home_repair', label: '居家維修', icon: '🔧' },
  { value: 'companionship', label: '陪伴聊天', icon: '💬' },
  { value: 'medical_accompany', label: '陪同就醫', icon: '🏥' },
  { value: 'tech_help', label: '科技協助', icon: '📱' },
  { value: 'other', label: '其他', icon: '🤝' },
]
const specialTags = ['需要輪椅通道', '需要女性志工', '需要男性志工', '需要粵語/閩南語', '可攜帶寵物']

const initForm = () => ({
  title: '', category: '', description: '', preferred_date: '', estimated_hours: '',
  address: { city: '', district: '', detail: '' }, special_needs: [], is_urgent: false
})
const form = ref(initForm())
function resetForm() { Object.assign(form.value, initForm()) }

const formValid = computed(() =>
  form.value.title.trim() && form.value.category && form.value.preferred_date &&
  (useHomeAddr.value || (form.value.address.city && form.value.address.district && form.value.address.detail))
)

async function submit() {
  submitting.value = true
  errorMsg.value = ''
  try {
    await new Promise(r => setTimeout(r, 800))
    // TODO: POST /api/help-requests { ...form.value, use_home_addr: useHomeAddr.value }
    submitted.value = true
  } catch {
    errorMsg.value = '發布失敗，請稍後再試'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.page-header { margin-bottom: 1.75rem; }
.back-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 0.82rem; color: var(--c-muted); font-weight: 500;
  padding: 4px 12px; border-radius: var(--r-full);
  border: 1px solid var(--c-border);
  transition: background var(--duration), color var(--duration), border-color var(--duration); opacity: 1;
}
.back-link:hover { background: var(--c-bg-2); color: var(--c-text); border-color: var(--c-border-strong); }
.page-title { font-size: 1.6rem; font-weight: 900; letter-spacing: -0.04em; margin-top: 0.5rem; color: var(--c-text); }

/* 服務類型選擇 Grid */
.category-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
@media (max-width: 480px) { .category-grid { grid-template-columns: repeat(3, 1fr); } }
.cat-btn {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 0.85rem 0.4rem; border-radius: var(--r-md);
  border: 1.5px solid var(--c-border);
  background: var(--c-surface); cursor: pointer; font-size: 0.8rem;
  font-family: var(--font); font-weight: 600; color: var(--c-muted);
  box-shadow: var(--shadow-xs);
  transition: border-color var(--duration) var(--ease), background var(--duration), color var(--duration), transform var(--duration), box-shadow var(--duration);
}
.cat-btn:hover {
  border-color: var(--c-primary);
  background: var(--c-primary-lt);
  color: var(--c-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}
.cat-btn.active {
  border-color: var(--c-primary);
  background: var(--c-primary-lt);
  color: var(--c-primary);
  box-shadow: var(--shadow-glow);
}
.cat-icon { font-size: 1.6rem; }

.loc-opts { display: flex; gap: 1.5rem; margin-top: 0.35rem; }
.radio-row { display: flex; gap: 7px; align-items: center; cursor: pointer; font-size: 0.88rem; }
.radio-row input { accent-color: var(--c-primary); }

.req-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.tag-check {
  display: flex; gap: 5px; align-items: center; font-size: 0.83rem; cursor: pointer;
  padding: 5px 14px; border: 1.5px solid var(--c-border);
  border-radius: var(--r-full); background: var(--c-surface);
  box-shadow: var(--shadow-xs);
  transition: all var(--duration) var(--ease); color: var(--c-muted);
}
.tag-check:hover { border-color: var(--c-accent); color: var(--c-accent); }
.tag-check:has(input:checked) {
  border-color: var(--c-accent);
  background: var(--c-accent-lt);
  color: #1a8f85;
}

.check-row {
  display: flex; gap: 9px; align-items: flex-start;
  font-size: 0.88rem; cursor: pointer; margin-top: 0.6rem; color: var(--c-text-2);
}
.check-row input { accent-color: var(--c-primary); }
.done-card { text-align: center; padding: 3rem 2rem; }
.done-icon { font-size: 3.5rem; margin-bottom: 1rem; }
.done-card h2 { font-size: 1.4rem; margin-bottom: 0.5rem; }
.done-card p { color: #64748b; }
</style>
