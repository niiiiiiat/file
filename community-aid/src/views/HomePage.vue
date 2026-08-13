<template>
  <div class="home-wrap">

    <!-- Hero Section -->
    <section class="hero">
      <!-- 背景裝飾 -->
      <div class="hero-orb hero-orb-1"></div>
      <div class="hero-orb hero-orb-2"></div>
      <div class="hero-orb hero-orb-3"></div>

      <div class="hero-inner">
        <div class="hero-eyebrow">
          <span class="eyebrow-dot"></span>
          社區互助平台
        </div>
        <h1 class="hero-title">
          讓善意在<br>
          <span class="title-accent">社區流動</span>
        </h1>
        <p class="hero-subtitle">
          連結社區志工與需要幫助的長者與居民，<br>
          共同打造溫暖、互助的在地生活圈。
        </p>

        <!-- 身份選擇 -->
        <div class="identity-grid">
          <button class="identity-card vol-card" @click="go('volunteer')">
            <div class="id-glow vol-glow"></div>
            <div class="id-header">
              <div class="id-badge vol-badge">志工</div>
            </div>
            <div class="id-icon">🙋</div>
            <div class="id-title">我要當志工</div>
            <div class="id-desc">付出時間與能力，協助有需要的社區鄰居</div>
            <div class="id-arrow">→</div>
          </button>

          <button class="identity-card req-card" @click="go('requester')">
            <div class="id-glow req-glow"></div>
            <div class="id-header">
              <div class="id-badge req-badge">求助者</div>
            </div>
            <div class="id-icon">🤲</div>
            <div class="id-title">我需要幫忙</div>
            <div class="id-desc">找到社區志工提供生活協助與支援</div>
            <div class="id-arrow">→</div>
          </button>
        </div>

        <p class="home-login-hint">
          已有帳號？
          <RouterLink to="/volunteer/dashboard">志工登入</RouterLink>
          <span class="hint-sep">·</span>
          <RouterLink to="/requester/dashboard">求助者登入</RouterLink>
        </p>
      </div>
    </section>

    <!-- 服務類型 -->
    <section class="features-section">
      <div class="page-container">
        <div class="sec-header">
          <div class="sec-eyebrow">服務項目</div>
          <h2 class="sec-title">我們能幫上什麼忙？</h2>
          <p class="sec-sub">從日常瑣事到緊急需求，志工們隨時準備好了</p>
        </div>
        <div class="feat-grid">
          <div class="feat-item" v-for="f in features" :key="f.icon">
            <div class="feat-icon-wrap">
              <span class="feat-icon">{{ f.icon }}</span>
            </div>
            <div class="feat-name">{{ f.name }}</div>
            <div class="feat-desc">{{ f.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 流程說明 -->
    <section class="hiw-section">
      <div class="page-container">
        <div class="sec-header">
          <div class="sec-eyebrow">使用流程</div>
          <h2 class="sec-title">三步開始互助</h2>
        </div>
        <div class="hiw-grid">
          <div class="hiw-step" v-for="(s, i) in steps" :key="i">
            <div class="hiw-num-wrap">
              <div class="hiw-num">{{ String(i + 1).padStart(2, '0') }}</div>
            </div>
            <div class="hiw-content">
              <div class="hiw-step-title">{{ s.title }}</div>
              <div class="hiw-step-desc">{{ s.desc }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 統計數字 -->
    <section class="stats-section">
      <div class="page-container">
        <div class="stats-grid">
          <div class="stat-item" v-for="s in stats" :key="s.label">
            <div class="stat-num">{{ s.num }}</div>
            <div class="stat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="home-footer">
      <div class="footer-inner">
        <div class="footer-brand">🏘️ 社區互助媒合網站</div>
        <p class="footer-copy">讓每個人都不孤單 · © 2024 Community Aid</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
function go(role) {
  router.push(role === 'volunteer' ? '/volunteer/register' : '/requester/register')
}

const features = [
  { icon: '🚗', name: '交通接送',  desc: '協助就醫、買菜、辦事接送' },
  { icon: '🛒', name: '代購跑腿',  desc: '採買日常用品、藥品' },
  { icon: '🔧', name: '居家維修',  desc: '輕型修繕、換燈泡' },
  { icon: '💬', name: '陪伴聊天',  desc: '關懷訪視、陪同散步' },
  { icon: '🏥', name: '陪同就醫',  desc: '陪診、協助掛號領藥' },
  { icon: '📱', name: '科技協助',  desc: '教學手機、視訊通話' },
  { icon: '📦', name: '物資共享',  desc: '社區物資媒合流通' },
  { icon: '🗺️', name: '地圖媒合',  desc: '依位置配對最近志工' },
]

const steps = [
  { title: '選擇身份並登記', desc: '志工需驗證，求助者免驗證 3 步完成' },
  { title: '發布或瀏覽需求', desc: '志工看附近地圖，求助者發布需求' },
  { title: '配對並完成協助', desc: '確認後才揭露聯絡資訊，互相評價' },
]

const stats = [
  { num: '1,200+', label: '已登記志工' },
  { num: '3,400+', label: '完成服務次數' },
  { num: '28 區', label: '覆蓋行政區' },
  { num: '4.9 ★', label: '平均評分' },
]
</script>

<style scoped>
/* ── Hero ────────────────────────────────── */
.home-wrap { min-height: 100vh; overflow-x: hidden; }

.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  /* 溫暖漸層：深珊瑚橘 → 深灰藍，取代純黑背景 */
  background: linear-gradient(145deg, #1a0f0a 0%, #1e1210 35%, #0e1117 70%, #0a1520 100%);
  overflow: hidden;
  padding: 4rem 1.5rem;
}

/* 背景光暈裝飾球 */
.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.hero-orb-1 {
  width: 650px; height: 650px;
  background: radial-gradient(circle, rgba(255,107,53,0.3) 0%, transparent 65%);
  top: -180px; left: -120px;
}
.hero-orb-2 {
  width: 450px; height: 450px;
  background: radial-gradient(circle, rgba(46,196,182,0.22) 0%, transparent 65%);
  bottom: -100px; right: -60px;
}
.hero-orb-3 {
  width: 320px; height: 320px;
  background: radial-gradient(circle, rgba(244,162,97,0.18) 0%, transparent 65%);
  top: 38%; left: 52%;
}

.hero-inner {
  position: relative;
  z-index: 1;
  max-width: 680px;
  margin: 0 auto;
  text-align: center;
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  margin-bottom: 1.5rem;
}
.eyebrow-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 8px #4ade80;
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.7); }
}

.hero-title {
  font-size: clamp(2.8rem, 7vw, 5rem);
  font-weight: 900;
  color: #ffffff;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin-bottom: 1.2rem;
}
.title-accent {
  background: linear-gradient(135deg, #FF6B35 0%, #FF8C60 40%, #2EC4B6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-subtitle {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.55);
  line-height: 1.75;
  margin-bottom: 3rem;
}

/* Identity Cards */
.identity-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  max-width: 560px;
  margin: 0 auto 2rem;
}
@media (max-width: 500px) { .identity-grid { grid-template-columns: 1fr; } }

.identity-card {
  position: relative;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 1.8rem 1.4rem;
  color: #fff;
  cursor: pointer;
  text-align: center;
  overflow: hidden;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  font-family: var(--font);
  backdrop-filter: blur(10px);
}
.identity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}
.vol-card:hover { border-color: rgba(255,107,53,0.55); }
.req-card:hover { border-color: rgba(46,196,182,0.55); }

.id-glow {
  position: absolute;
  width: 160px; height: 160px;
  border-radius: 50%;
  filter: blur(50px);
  top: -40px; right: -40px;
  pointer-events: none;
}
.vol-glow { background: rgba(255,107,53,0.3); }
.req-glow { background: rgba(46,196,182,0.25); }

.id-header { display: flex; justify-content: flex-end; margin-bottom: 0.75rem; }
.id-badge {
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em;
  padding: 3px 10px; border-radius: 20px; text-transform: uppercase;
}
.vol-badge { background: rgba(255,107,53,0.2); color: #FF9166; border: 1px solid rgba(255,107,53,0.35); }
.req-badge { background: rgba(46,196,182,0.2); color: #5eddd5; border: 1px solid rgba(46,196,182,0.35); }

.id-icon  { font-size: 2.6rem; margin-bottom: 0.75rem; }
.id-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; }
.id-desc  { font-size: 0.83rem; color: rgba(255,255,255,0.55); line-height: 1.5; margin-bottom: 1rem; }
.id-arrow { font-size: 1.2rem; color: rgba(255,255,255,0.3); transition: color 0.2s, transform 0.2s; }
.identity-card:hover .id-arrow { color: rgba(255,255,255,0.8); transform: translateX(4px); }

.home-login-hint { font-size: 0.85rem; color: rgba(255,255,255,0.35); }
.home-login-hint a { color: rgba(255,255,255,0.55); text-decoration: underline; text-decoration-color: rgba(255,255,255,0.2); opacity: 1; }
.home-login-hint a:hover { color: rgba(255,255,255,0.85); }
.hint-sep { margin: 0 0.5rem; opacity: 0.4; }

/* ── Features ─────────────────────────────── */
.features-section { background: var(--c-bg); padding: 6rem 0; }

.sec-header { text-align: center; margin-bottom: 3rem; }
.sec-eyebrow {
  font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--c-primary);
  margin-bottom: 0.75rem;
}
.sec-title { font-size: clamp(1.6rem, 4vw, 2.4rem); font-weight: 800; letter-spacing: -0.03em; color: var(--c-text); margin-bottom: 0.6rem; }
.sec-sub { color: var(--c-muted); font-size: 1rem; }

/* ── 服務項目卡片 Grid ── */
.feat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;           /* 改為有間隙的 Grid，不再用 1px 拼接 */
}
.feat-item {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-xl);
  padding: 1.6rem 1.4rem;
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--duration) var(--ease), transform var(--duration) var(--ease);
}
.feat-item:hover {
  background: var(--c-surface);
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}
.feat-icon-wrap {
  width: 46px; height: 46px;
  background: var(--c-primary-lt);
  border-radius: var(--r-md);
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1rem;
  transition: transform var(--duration) var(--ease), background var(--duration);
}
.feat-item:hover .feat-icon-wrap {
  transform: scale(1.1);
  background: var(--c-primary);
}
.feat-item:hover .feat-icon { filter: grayscale(0) brightness(0) invert(1); }
.feat-icon { font-size: 1.4rem; transition: filter var(--duration); }
.feat-name { font-weight: 700; font-size: 0.93rem; margin-bottom: 0.3rem; color: var(--c-text); }
.feat-desc { font-size: 0.8rem; color: var(--c-muted); line-height: 1.5; }

/* ── How it works ──────────────────────────── */
.hiw-section { background: var(--c-surface); padding: 6rem 0; }
.hiw-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
@media (max-width: 640px) { .hiw-grid { grid-template-columns: 1fr; } }
.hiw-step {
  display: flex;
  gap: 1.2rem;
  padding: 1.6rem;
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--duration), transform var(--duration);
}
.hiw-step:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.hiw-num-wrap { flex-shrink: 0; }
.hiw-num {
  font-size: 2.2rem; font-weight: 900; letter-spacing: -0.05em;
  color: var(--c-primary); opacity: 0.3;
  line-height: 1;
}
.hiw-step-title { font-size: 0.95rem; font-weight: 700; margin-bottom: 0.35rem; color: var(--c-text); }
.hiw-step-desc  { font-size: 0.83rem; color: var(--c-muted); line-height: 1.5; }

/* ── Stats ─────────────────────────────────── */
.stats-section {
  background: linear-gradient(135deg, #2B2D42 0%, #1a1c2e 100%);
  padding: 5rem 0;
}
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; text-align: center; }
@media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr 1fr; } }
.stat-num  { font-size: 2.2rem; font-weight: 900; color: #FF6B35; letter-spacing: -0.04em; }
.stat-label{ font-size: 0.83rem; color: rgba(255,255,255,0.5); margin-top: 4px; }

/* ── Footer ────────────────────────────────── */
.home-footer { background: #1a1215; padding: 2rem 1.5rem; }
.footer-inner { text-align: center; }
.footer-brand { font-size: 0.9rem; font-weight: 700; color: rgba(255,255,255,0.45); margin-bottom: 4px; }
.footer-copy  { font-size: 0.78rem; color: rgba(255,255,255,0.25); }
</style>
