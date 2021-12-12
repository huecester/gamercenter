<script setup>
import { defineProps, defineEmits } from '@nuxtjs/composition-api'
const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
});
const emit = defineEmits(['close']);
</script>

<template>
	<Transition name="fade" mode="out-in">
		<div
				v-if="show"
				class="modal-background"
				@click.self="emit('close')"
				>
				<div class="modal-body">
					<slot />
				</div>
		</div>
	</Transition>
</template>

<style scoped lang="scss">
.modal-background {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	.modal-body {
		background-color: $bg-medium;
		border: 1px solid $bg-light;
		padding: 1.25rem;

		& > :first-child {
			margin-top: 0;
		}
		& > :last-child {
			margin-bottom: 0;
		}
	}
}
</style>
