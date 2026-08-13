<template>
  <div class="otp-wrap">
    <div class="otp-boxes">
      <input
        v-for="(_, i) in length"
        :key="i"
        :ref="el => inputs[i] = el"
        class="otp-input"
        type="text"
        inputmode="numeric"
        maxlength="1"
        :value="digits[i]"
        @input="onInput(i, $event)"
        @keydown="onKeydown(i, $event)"
        @paste="onPaste($event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ modelValue: String, length: { type: Number, default: 6 } })
const emit = defineEmits(['update:modelValue'])

const inputs = ref([])
const digits = ref(Array(props.length).fill(''))

watch(() => props.modelValue, (v) => {
  if (!v) digits.value = Array(props.length).fill('')
})

function onInput(i, e) {
  const val = e.target.value.replace(/\D/g, '')
  digits.value[i] = val ? val[0] : ''
  emit('update:modelValue', digits.value.join(''))
  if (val && i < props.length - 1) inputs.value[i + 1]?.focus()
}
function onKeydown(i, e) {
  if (e.key === 'Backspace' && !digits.value[i] && i > 0) {
    digits.value[i - 1] = ''
    inputs.value[i - 1]?.focus()
  }
}
function onPaste(e) {
  const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, props.length)
  text.split('').forEach((c, i) => { digits.value[i] = c })
  emit('update:modelValue', digits.value.join(''))
  inputs.value[Math.min(text.length, props.length - 1)]?.focus()
  e.preventDefault()
}
</script>

<style scoped>
.otp-boxes { display: flex; gap: 10px; justify-content: center; }
.otp-input {
  width: 48px; height: 54px;
  text-align: center;
  font-size: 1.4rem;
  font-weight: 700;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.15s;
}
.otp-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
</style>
