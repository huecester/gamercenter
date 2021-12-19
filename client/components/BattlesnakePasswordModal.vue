<script setup>
import { defineProps, defineEmits, ref } from '@nuxtjs/composition-api';
const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
});
const emit = defineEmits(['close', 'submit'])

const password = ref('');

const submit = () => {
	emit('submit', password.value)
}
</script>

<template>
	<BaseModal
			:show="show"
			@close="emit('close')"
			>
			<h1>Enter password</h1>
			<form
					@submit.prevent="submit"
					@keyup.esc="emit('close')"
					>
					<p>
						<label for="password">Password</label>
						<input
								v-focus
								type="password"
								id="password"
								v-model="password"
								required
								maxlength="32"
								autocomplete="off"
								/>
					</p>

					<div class="row buttons">
						<button type="submit">OK</button>
						<button
								type="button"
								@click="emit('close')"
								>
								Cancel
						</button>
					</div>
			</form>
	</BaseModal>
</template>

<style scoped lang="scss">
.buttons > button {
	padding: 0.5rem 1rem;
}
</style>
