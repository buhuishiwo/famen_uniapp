<template>
  <Teleport to="body">
    <div v-if="open" class="draggable-modal-container">
      <div class="draggable-modal-mask" @click="$emit('cancel')"></div>
      <div class="draggable-modal-box" :style="modalStyle" ref="modalRef">
        <div class="draggable-modal-header" @mousedown="startDrag">
          <span class="draggable-modal-title">{{ title }}</span>
          <button class="draggable-modal-close" @click.stop="$emit('cancel')">
            <span>×</span>
          </button>
        </div>
        <div class="draggable-modal-body">
          <slot></slot>
        </div>
        <div class="draggable-modal-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';

const props = defineProps({
  title: { type: String, default: '' },
  open: { type: Boolean, default: false },
  maskClosable: { type: Boolean, default: false },
  width: { type: [String, Number], default: '520px' }
});

defineEmits(['cancel']);

const modalRef = ref(null);
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const offsetX = ref(0);
const offsetY = ref(0);

const modalStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  transform: `translate(calc(-50% + ${offsetX.value}px), calc(-50% + ${offsetY.value}px))`
}));

function startDrag(e) {
  if (e.target.closest('.draggable-modal-close')) return;
  
  isDragging.value = true;
  startX.value = e.clientX;
  startY.value = e.clientY;
  
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
}

function onDrag(e) {
  if (!isDragging.value) return;
  
  offsetX.value += e.clientX - startX.value;
  offsetY.value += e.clientY - startY.value;
  startX.value = e.clientX;
  startY.value = e.clientY;
}

function stopDrag() {
  isDragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
}

function resetPosition() {
  offsetX.value = 0;
  offsetY.value = 0;
}

watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    resetPosition();
  }
});
</script>

<style scoped>
.draggable-modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.draggable-modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.draggable-modal-box {
  position: fixed;
  left: 50%;
  top: 50%;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow: hidden;
}

.draggable-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: move;
  background: #fff;
  flex-shrink: 0;
}

.draggable-modal-title {
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.draggable-modal-close {
  border: none;
  background: none;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.45);
  cursor: pointer;
  padding: 0;
  line-height: 1;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.draggable-modal-close:hover {
  color: rgba(0, 0, 0, 0.75);
}

.draggable-modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.draggable-modal-footer {
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  background: #fff;
  flex-shrink: 0;
}
</style>
