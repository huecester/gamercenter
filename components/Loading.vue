<script setup>
import { defineProps } from '@nuxtjs/composition-api';

const props = defineProps({
	condition: Boolean,
	error: {
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<transition
			name="fade"
			mode="out-in"
			>
			<div v-if="condition" key="show">
				<slot />
			</div>

			<div v-else-if="error" class="center" key="error">
				<span class="fas fa-exclamation-triangle fa-3x" />
			</div>

			<div v-else class="center" key="loading">
				<span class="fas fa-spinner fa-3x fa-spin" />
			</div>
	</transition>
</template>

<style scoped lang="scss">
.center {
	display: flex;
	justify-content: center;
}
</style>
