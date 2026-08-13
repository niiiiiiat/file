<template>
  <div class="page-container-sm" style="padding-top:2.5rem">
    <!-- 頁首 -->
    <div class="reg-header">
      <RouterLink to="/" class="back-link">← 返回首頁</RouterLink>
      <h1 class="reg-title">🙋 志工註冊</h1>
      <p class="reg-sub">加入社區互助志工，讓你的善意直接送達需要的人</p>
    </div>

    <!-- Step Indicator -->
    <div class="steps">
      <template v-for="(s, i) in stepLabels" :key="i">
        <div class="step-item" :class="{ active: step === i + 1, done: step > i + 1 }">
          <div class="step-circle">{{ step > i + 1 ? '✓' : i + 1 }}</div>
          <div class="step-label">{{ s }}</div>
        </div>
        <div v-if="i < stepLabels.length - 1" class="step-line" :class="{ done: step > i + 1 }" />
      </template>
    </div>

    <!-- Step 1：基本資料 -->
    <div v-if="step === 1" class="card">
      <h2 class="step-card-title">基本資料</h2>
      <div class="form-group">
        <label class="form-label">姓名<span class="required">*</span></label>
        <input class="form-input" v-model="form.full_name" type="text" placeholder="請輸入真實姓名" />
      </div>
      <div class="grid-2">
        <div class="form-group">
          <label class="form-label">性別<span class="required">*</span></label>
          <select class="form-select" v-model="form.gender">
            <option value="">請選擇</option>
            <option value="M">男</option>
            <option value="F">女</option>
            <option value="X">不公開</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">出生年份<span class="required">*</span></label>
          <input class="form-input" v-model="form.birth_year" type="number" min="1940" max="2005" placeholder="如：1975" />
        </div>
      </div>
      <AddressForm v-model="form.address" />
      <button class="btn btn-primary btn-full btn-lg" @click="nextStep(1)" :disabled="!step1Valid">
        下一步：驗證方式
      </button>
    </div>

    <!-- Step 2：驗證方式選擇 -->
    <div v-if="step === 2" class="card">
      <h2 class="step-card-title">身份驗證</h2>
      <p class="reg-note">請選擇一種驗證方式（擇一即可）</p>
      <div class="verify-tabs">
        <button class="vtab" :class="{ active: verifyType === 'sms' }" @click="verifyType = 'sms'">
          📱 手機簡訊 OTP
        </button>
        <button class="vtab" :class="{ active: verifyType === 'email' }" @click="verifyType = 'email'">
          📧 Email 驗證
        </button>
      </div>

      <!-- SMS OTP -->
      <template v-if="verifyType === 'sms'">
        <div class="form-group" style="margin-top:1rem">
          <label class="form-label">手機號碼<span class="required">*</span></label>
          <div class="phone-row">
            <input class="form-input" v-model="form.phone" type="tel" placeholder="09XXXXXXXX" maxlength="10" />
            <button class="btn btn-outline" @click="sendOtp" :disabled="otpSent || !phoneValid">
              {{ otpSent ? `重發 (${countdown}s)` : '發送驗證碼' }}
            </button>
          </div>
          <div v-if="!phoneValid && form.phone" class="form-error">請輸入正確的台灣手機號碼（09 開頭 10 碼）</div>
        </div>
        <div v-if="otpSent" class="form-group">
          <label class="form-label">輸入驗證碼<span class="required">*</span></label>
          <OtpInput v-model="form.otp" />
          <div class="form-hint">驗證碼已發送至 {{ form.phone }}，5 分鐘內有效</div>
        </div>
      </template>

      <!-- Email -->
      <template v-if="verifyType === 'email'">
        <div class="form-group" style="margin-top:1rem">
          <label class="form-label">Email<span class="required">*</span></label>
          <div class="phone-row">
            <input class="form-input" v-model="form.email" type="email" placeholder="your@email.com" />
            <button class="btn btn-outline" @click="sendEmail" :disabled="emailSent || !emailValid">
              {{ emailSent ? '已發送' : '發送驗證信' }}
            </button>
          </div>
          <div class="form-hint" v-if="emailSent">
            驗證信已發送至 {{ form.email }}，請點擊信中連結完成驗證後再繼續
          </div>
        </div>
        <label v-if="emailSent" class="check-row">
          <input type="checkbox" v-model="form.emailConfirmed" />
          <span>我已點擊信中連結完成驗證</span>
        </label>
      </template>

      <div class="step-btns">
        <button class="btn btn-ghost" @click="step = 1">← 上一步</button>
        <button class="btn btn-primary" @click="nextStep(2)" :disabled="!step2Valid">
          下一步：確認送出
        </button>
      </div>
    </div>

    <!-- Step 3：確認與送出 -->
    <div v-if="step === 3" class="card">
      <h2 class="step-card-title">確認資料</h2>
      <div class="confirm-grid">
        <div class="confirm-row"><span class="cl">姓名</span><span>{{ form.full_name }}</span></div>
        <div class="confirm-row"><span class="cl">性別</span><span>{{ genderLabel }}</span></div>
        <div class="confirm-row"><span class="cl">出生年份</span><span>{{ form.birth_year }} 年</span></div>
        <div class="confirm-row"><span class="cl">地址</span><span>{{ form.address.city }}{{ form.address.district }}{{ form.address.detail }}</span></div>
        <div class="confirm-row" v-if="verifyType === 'sms'"><span class="cl">手機</span><span>{{ form.phone }}</span></div>
        <div class="confirm-row" v-else><span class="cl">Email</span><span>{{ form.email }}</span></div>
      </div>
      <label class="check-row">
        <input type="checkbox" v-model="form.agree" />
        <span>我同意本平台的<a href="#" @click.prevent>隱私權政策</a>及<a href="#" @click.prevent>服務條款</a></span>
      </label>
      <div v-if="errorMsg" class="alert alert-danger" style="margin-top:1rem">{{ errorMsg }}</div>
      <div class="step-btns">
        <button class="btn btn-ghost" @click="step = 2">← 上一步</button>
        <button class="btn btn-success btn-lg" @click="submit" :disabled="!form.agree || submitting">
          {{ submitting ? '送出中…' : '✓ 完成註冊' }}
        </button>
      </div>
    </div>

    <!-- Step 4：完成 -->
    <div v-if="step === 4" class="card done-card">
      <div class="done-icon">🎉</div>
      <h2>歡迎加入！{{ form.full_name }} 志工</h2>
      <p>你的帳號已成功建立，現在可以開始瀏覽附近的求助需求了。</p>
      <RouterLink to="/volunteer/dashboard" class="btn btn-primary btn-lg btn-full">
        前往志工後台 →
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AddressForm from '@/components/AddressForm.vue'
import OtpInput from '@/components/OtpInput.vue'

const auth = useAuthStore()
const step = ref(1)
const stepLabels = ['基本資料', '身份驗證', '確認送出', '完成']
const verifyType = ref('sms')
const otpSent = ref(false)
const emailSent = ref(false)
const countdown = ref(60)
const submitting = ref(false)
const errorMsg = ref('')

const form = ref({
  full_name: '', gender: '', birth_year: '',
  address: { city: '', district: '', detail: '' },
  phone: '', otp: '', email: '',
  emailConfirmed: false, agree: false
})

const step1Valid = computed(() =>
  form.value.full_name.trim() &&
  form.value.gender &&
  form.value.birth_year &&
  form.value.address.city &&
  form.value.address.district &&
  form.value.address.detail.trim()
)

const phoneValid = computed(() => /^09\d{8}$/.test(form.value.phone))
const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email))

const step2Valid = computed(() => {
  if (verifyType.value === 'sms') return phoneValid.value && form.value.otp.length === 6
  return emailValid.value && form.value.emailConfirmed
})

const genderLabel = computed(() => ({ M: '男', F: '女', X: '不公開' }[form.value.gender]))

function nextStep(from) { step.value = from + 1 }

let timer = null
function sendOtp() {
  if (!phoneValid.value) return
  otpSent.value = true
  countdown.value = 60
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) { clearInterval(timer); otpSent.value = false }
  }, 1000)
  // TODO: 呼叫 POST /api/auth/otp/send { phone }
}

function sendEmail() {
  if (!emailValid.value) return
  emailSent.value = true
  // TODO: 呼叫 POST /api/auth/email/send { email }
}

async function submit() {
  submitting.value = true
  errorMsg.value = ''
  try {
    // TODO: 呼叫 POST /api/auth/volunteer/register
    // 模擬成功
    await new Promise(r => setTimeout(r, 1000))
    auth.login({ full_name: form.value.full_name, role: 'volunteer' }, 'mock_token_vol')
    step.value = 4
  } catch (e) {
    errorMsg.value = e?.response?.data?.message || '註冊失敗，請稍後再試'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.reg-header { text-align: center; margin-bottom: 2.5rem; }
.back-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 0.82rem; color: var(--c-muted); font-weight: 500;
  padding: 4px 12px; border-radius: var(--r-full);
  border: 1px solid var(--c-border);
  transition: background var(--duration), color var(--duration), border-color var(--duration); opacity: 1;
}
.back-link:hover { background: var(--c-bg-2); color: var(--c-text); border-color: var(--c-border-strong); }
.reg-title {
  font-size: 2rem; font-weight: 900; letter-spacing: -0.04em;
  color: var(--c-text); margin: 0.75rem 0 0.4rem;
}
.reg-sub { color: var(--c-muted); font-size: 0.88rem; }

.step-card-title {
  font-size: 1rem; font-weight: 700; color: var(--c-text);
  margin-bottom: 1.4rem; padding-bottom: 0.8rem;
  border-bottom: 1px solid var(--c-border);
}
.reg-note { font-size: 0.88rem; color: var(--c-muted); margin-bottom: 1.2rem; }

.verify-tabs { display: flex; gap: 8px; margin-bottom: 0.25rem; }
.vtab {
  flex: 1; padding: 0.7rem 1rem; border-radius: var(--r-md);
  border: 1.5px solid var(--c-border-strong); background: var(--c-bg);
  cursor: pointer; font-size: 0.9rem; font-weight: 600;
  color: var(--c-muted);
  transition: all var(--duration) var(--ease); font-family: var(--font);
}
.vtab:hover { border-color: var(--c-primary); color: var(--c-primary); background: var(--c-primary-lt); }
.vtab.active {
  border-color: var(--c-primary); background: var(--c-primary-lt);
  color: var(--c-primary); box-shadow: var(--shadow-glow);
}

.phone-row { display: flex; gap: 8px; }
.phone-row .form-input { flex: 1; }
.phone-row .btn { white-space: nowrap; flex-shrink: 0; }

.step-btns { display: flex; gap: 10px; margin-top: 1.75rem; justify-content: space-between; }
.confirm-grid {
  background: var(--c-bg); border: 1px solid var(--c-border);
  border-radius: var(--r-lg); padding: 1rem 1.2rem; margin-bottom: 1.2rem;
}
.confirm-row {
  display: flex; gap: 1rem; padding: 0.45rem 0;
  border-bottom: 1px solid var(--c-border); font-size: 0.88rem;
}
.confirm-row:last-child { border: none; }
.cl { color: var(--c-muted); min-width: 72px; font-size: 0.8rem; font-weight: 600; }

.check-row {
  display: flex; gap: 9px; align-items: flex-start;
  font-size: 0.88rem; margin-top: 0.85rem; cursor: pointer; color: var(--c-text-2);
}
.check-row input { margin-top: 3px; flex-shrink: 0; accent-color: var(--c-primary); }

.done-card { text-align: center; padding: 3.5rem 2rem; }
.done-icon { font-size: 4rem; margin-bottom: 1.25rem; line-height: 1; }
.done-card h2 { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.03em; color: var(--c-text); margin-bottom: 0.6rem; }
.done-card p { color: var(--c-muted); margin-bottom: 2rem; font-size: 0.93rem; }
</style>
