<script>
	import Username from '$lib/components/Username.svelte';
	import BattlesnakeCreateModal from '$lib/components/BattlesnakeCreateModal.svelte';
	import BattlesnakeRooms from '$lib/components/BattlesnakeRooms.svelte';
	import { onMount } from 'svelte';

	let showCreate = false;
	let rooms = [];

	const submit = event => {
		const { roomname, password } = event.detail;
	}

	const refresh = async () => {
		try {
			const res = await fetch('/api/battlesnake/rooms');
			rooms = await res.json();
		} catch (err) {
			// TODO error
		}
	}

	onMount(refresh);
</script>

<main>
	<h1>Battlesnake</h1>

	<div class="row">
		<button type="button" on:click="{() => showCreate = true}">
			Create room
		</button>
		<button type="button" on:click={console.log}>
			Refresh
		</button>
	</div>

	<Username />

	<BattlesnakeRooms {rooms} />

	<BattlesnakeCreateModal
		show={showCreate}
		on:close={() => showCreate = false}
		on:submit={submit}
	/>
</main>
