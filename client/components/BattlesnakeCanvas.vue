<script setup>
import { defineProps, defineEmits, ref, onMounted, computed, watch, useStore, onUnmounted } from '@nuxtjs/composition-api';
const store = useStore();
const props = defineProps({
	gridSize: {
		type: Number,
		default: 6,
	},
});
const emit = defineEmits(['dir'])

// refs
const canvas = ref(null);
const ctx = ref(null);
const state = computed(() => store.state.battlesnake.canvas.state);
// variables
const canvasSize = ref(500);
const segmentSize = canvasSize.value / props.gridSize;

// methods
const drawGrid = (x, y, color) => {
	ctx.value.fillStyle = color;
	ctx.value.fillRect(x * segmentSize, y * segmentSize, segmentSize, segmentSize);
}

const dir = e => {
	let direction;
	switch (e.key) {
		case 'ArrowUp':
		case 'w':
			direction = 'up';
			break;
		case 'ArrowDown':
		case 's':
			direction = 'down';
			break;
		case 'ArrowLeft':
		case 'a':
			direction = 'left';
			break;
		case 'ArrowRight':
		case 'd':
			direction = 'right';
			break;
	}
	if (direction) {
		emit('dir', direction);
	}
}

// lifecycle hooks
onMounted(() => {
	ctx.value = canvas.value.getContext('2d');
	window.addEventListener('keydown', dir, true);
});

onUnmounted(() => {
	window.removeEventListener('keydown', dir, true);
});

watch(state, newState => {
	ctx.value.clearRect(0, 0, canvasSize.value, canvasSize.value);
	for (const obj of newState) {
		for (const seg of obj.pos) {
			drawGrid(seg[0], seg[1], obj.color);
		}
	}
});
</script>

<template>
	<canvas
			ref="canvas"
			:width="canvasSize"
			:height="canvasSize"
			/>
</template>

<style scoped lang="scss">
canvas {
	background-color: black;
	border: 2px solid $fg-medium;
}
</style>
