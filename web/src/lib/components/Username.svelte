<script>
	import { browser } from '$app/env';

	$: username = browser ? localStorage.getItem('username') : '';
	$: {
		browser && localStorage.setItem('username', username);
	}
</script>

<form class="row" on:submit|preventDefault>
	<label for="username">Username</label>
	<input
		type="text"
		id="username"
		bind:value={username}
		required
		maxlength="20"
		autocomplete="off"
	/>
</form>

<style lang="scss">
	label {
		margin-right: 0.25rem;
	}
</style>
