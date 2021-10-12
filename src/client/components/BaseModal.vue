<script>
export default {
	props: {
		show: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['close'],
};
</script>

<template>
	<teleport to="body">
		<transition name="fade" mode="out-in">
			<div
					v-if="show"
					class="modal"
					@click.self="this.$emit('close')"
					>
					<section class="modal-body">
						<slot />
					</section>
			</div>
		</transition>
	</teleport>
</template>

<style scoped lang="sass">
.modal
	position: absolute
	top: 0
	right: 0
	bottom: 0
	left: 0
	background-color: rgba(0, 0, 0, 0.5)
	display: flex
	flex-direction: column
	align-items: center
	justify-content: center

.modal-body
	background-color: $bg-medium
	border: 1px solid $bg-light
	padding: 1.25rem

	& > :first-child
		margin-top: 0
	& > :last-child
		margin-bottom: 0
</style>
