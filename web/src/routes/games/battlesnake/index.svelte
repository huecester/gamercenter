<script>
	import Username from '$lib/components/Username.svelte';
	import BattlesnakeCreateModal from '$lib/components/BattlesnakeCreateModal.svelte';
	import BattlesnakeRooms from '$lib/components/BattlesnakeRooms.svelte';

	let showCreate = false;
	let rooms = [{name:'bazinga',id:'deadbeef',players:[{username:'gaminggamer',id:'aabbccdd'},{username:'gagag',id:'asdfasf'}],hasPassword:true},{name:'aids',id:'notgord',players:[{username:'faef',id:'aabbccdd'},{username:'peasant',id:'asdfasf'}],hasPassword:false}];

	const submit = event => {
		const { roomname, password } = event.detail;
	}
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
