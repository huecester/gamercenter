<script>
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';
	import BaseModal from '$lib/components/BaseModal.svelte';
	export let show;

	const dispatch = createEventDispatcher();

	let roomname;
	let password;
	let creating = false;

	const focus = node => {
		node.focus();
	}

	const submit = event => {
		creating = true;
		dispatch('submit', { roomname: roomname, password });
	}
</script>

<BaseModal {show} on:close>
	<h1>Create a room</h1>

	{#if !creating}
		<form
			on:submit|preventDefault={submit}
			on:keyup="{event => event.key === 'Escape' && dispatch('close')}"
			out:fade="{{ duration: 100 }}"
		>
			<p>
				<label for="roomname">Room name</label>
				<input
					type="text"
					id="roomname"
					use:focus
					bind:value={roomname}
					required
					maxlength="32"
					autocomplete="off"
				/>
			</p>

			<p>
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					bind:value={password}
					maxlength="32"
				/>
			</p>

			<div class="row buttons">
				<button type="submit">OK</button>
				<button type="button" on:click="{() => dispatch('close')}">Close</button>
			</div>
		</form>
	{:else}
		<div class="center spinner" in:fade="{{ delay: 100, duration: 100 }}">
			<i class="fas fa-spinner fa-3x fa-spin" />
		</div>
	{/if}
</BaseModal>


<style lang="scss">
	.buttons {
		margin-bottom: 0.75rem;
		button {
			padding: 0.5rem 1rem;
		}
	}

	.spinner {
		margin-bottom: 1.5rem;
	}
</style>
