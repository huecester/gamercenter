<script>
export default {
	props: {
		level: {
			validator(value) {
				return ['info', 'warn', 'error'].includes(value);
			},
		},
		id: {
			type: Number,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		timeout: {
			type: Number,
			default: 5000,
		},
	},
	emits: ['timeout'],
	created() {
		setTimeout(() => this.$store.commit('removeNotification', this.id), this.timeout);
	},
};
</script>

<template>
	<li :class="[this.level, 'clickable']">
		<div :class="[this.level, 'icon']">!</div>
		<div class="text">
			{{ message }}
		</div>
	</li>
</template>

<style scoped lang="sass">
li
	margin: 0.5rem
	display: flex
	list-style-type: none
	width: 20rem
	height: 6rem
	overflow: hidden
	background-color: $bg-medium
	border-radius: 0.5rem
	&.info
		border: 1px solid $info-dk
	&.warn
		border: 1px solid $warn-dk
	&.error
		border: 1px solid $error-dk

.icon
	width: 6rem
	height: 6rem
	display: flex
	align-items: center
	justify-content: center
	font-size: 5rem
	font-style: bold
	&.info
		background-color: $info-dk
	&.warn
		background-color: $warn-dk
	&.error
		background-color: $error-dk

.text
	padding: 0.5rem
	flex: 1
</style>
