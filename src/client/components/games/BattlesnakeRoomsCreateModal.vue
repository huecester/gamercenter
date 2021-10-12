<script>
import BaseModal from '../BaseModal.vue'

export default {
	components: {
		BaseModal,
	},
	props: {
		show: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['close'],
	data() {
		return {
			roomname: '',
			password: '',
		};
	},
	methods: {
		submit() {
			this.$emit('close', { roomname: this.roomname, password: this.password });
			this.roomname = '';
			this.password = '';
		},
	},
};
</script>

<template>
	<BaseModal
			:show="show"
			@close="this.$emit('close')"
			>
			<h1>Create a room</h1>
			<form
					@submit.prevent="submit"
					@keyup.esc="this.$emit('close')"
					>
					<p>
						<label for="roomname">Room name</label>
						<input v-focus type="text" name="roomname" id="roomname" v-model="roomname" required maxlength="32" autocomplete="off" />
					</p>

					<p>
						<label for="password">Password</label>
						<input type="password" name="password" id="password" v-model="password" maxlength="32" />
					</p>

					<div class="row">
						<button type="submit">OK</button>
						<button type="button" @click="this.$emit('close')">Cancel</button>
					</div>
			</form>
	</BaseModal>
</template>

<style scoped lang="sass">
p
	display: flex
	align-items: center

	label
		margin-right: 1rem
	input
		flex: 1
</style>
