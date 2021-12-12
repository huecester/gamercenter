<script setup>
import { defineProps, defineEmits, ref, useContext, useRouter } from '@nuxtjs/composition-api';
const { store, $http } = useContext();
const router = useRouter();
const props = defineProps({
	show: {
		type: Boolean,
		default: false,
	},
});
const emit = defineEmits(['close']);

const roomname = ref('');
const password = ref('');
const creating = ref(false);

const submit = async () => {
	creating.value = true;

	try {
		const res = await $http.post('/api/battlesnake/rooms', { name: roomname.value, password: password.value });

		if (res.status === 201) {
			const id = await res.text();
			router.push({ path: `/games/battlesnake/${id}` })
		} else {
			store.commit('notifications/error', 'Failed to create room.');
		}
	} catch (err) {
		console.error(err)
		store.commit('notifications/error', 'Failed to create room.');
	} finally {
		roomname.value = '';
		password.value = '';
		creating.value = false;

		emit('close')
	}
}
</script>

<template>
	<BaseModal
			:show="show"
			@close="emit('close')"
			>
			<h1>Create a room</h1>

			<Loading :condition="!creating">
				<form
						@submit.prevent="submit"
						@keyup.esc="emit('close')"
						>
						<p>
							<label for="roomname">Room name</label>
							<input
									v-focus
									type="text"
									id="roomname"
									v-model="roomname"
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
									v-model="password"
									maxlength="32"
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
			</Loading>
	</BaseModal>
</template>

<style scoped lang="scss">
.buttons > button {
	padding: 0.5rem 1rem;
}
</style>
