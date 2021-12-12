<script setup>
import { ref, watch } from '@nuxtjs/composition-api';

const username = ref(window.localStorage?.getItem('username') || '');

watch(username, newUsername => {
	window.localStorage?.setItem('username', newUsername);
});
</script>

<template>
	<form
			class="row"
			@submit.prevent=""
			>
			<label for="username">Username</label>
			<input
					type="text"
					id="username"
					v-model="username"
					required
					maxlength="20"
					autocomplete="off"
					/>
	</form>
</template>

<style scoped lang="scss">
label {
	margin-right: 0.25rem;
}
</style>
