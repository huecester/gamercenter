<script>
export default {
	props: {
		messages: {
			type: Array,
			required: true,
		},
	},
	emits: ['message'],
	data() {
		return {
			message: '',
		};
	},
};
</script>

<template>
	<ul>
		<li
				v-for="message in messages"
				>
				{{ message }}
		</li>
	</ul>
	<form
			class="row"
			@submit.prevent="this.$emit(this.message)"
			>
			<input type="text" id="message" v-model="message" maxlength="64" autocomplete="off" />
			<button type="submit">Send</button>
	</form>
</template>

<style scoped lang="sass">
ul
	margin: 0
	padding: 0
	flex: 1

li
	list-style-type: none
	font-size: 0.8rem

#message
	flex: 1
</style>
