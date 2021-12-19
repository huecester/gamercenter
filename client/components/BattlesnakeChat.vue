<script setup>
import { useStore, defineEmits, ref, computed } from '@nuxtjs/composition-api';
const store = useStore();
const emit = defineEmits(['send']);

const messages = computed(() => store.state.battlesnake.chat.messages);
const message = ref('');
const send = () => {
	if (!message.value) return;

	emit('send', message.value);
	message.value = '';
}
</script>

<template>
	<div class="container">
		<ul class="messages">
			<li
					v-for="message in messages"
					:key="message.id"
					class="delist"
					>
					<span v-if="message.type === 'message'" v-scroll>
						<span class="bold">{{ message.author }}</span>: {{ message.text }}
					</span>

					<span v-else-if="message.type === 'player'" v-scroll>
						<span class="italic"><span class="bold">{{ message.username }}</span> {{ message.action }}.</span>
					</span>

					<span v-else-if="message.type === 'countdown'" v-scroll>
						<span
								v-if="message.n > 0"
								class="italic"
								v-scroll
								>
								{{ message.n }}...
						</span>
						<span
								v-else
								class="bold"
								v-scroll
								>
								GO!
						</span>
					</span>

					<span v-else-if="message.type === 'winner'" v-scroll>
						<span class="bold">{{ message.username }}</span> wins!
					</span>
			</li>
		</ul>
		<form
				class="row"
				@submit.prevent="send"
				>
				<input
						type="text"
						id="message"
						v-model="message"
						maxlength="64"
						autocomplete="off"
						/>
				<button type="submit">Send</button>
		</form>
	</div>
</template>

<style scoped lang="scss">
.container {
	border: 2px solid $fg-medium;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 12rem;
	overflow: auto;

	.messages {
		margin: 0;
		padding: 0;
		flex: 1;
		overflow: auto;
		line-height: 1.25rem;

		li {
			font-size: 0.8rem;
			padding-left: 0.25rem;
		}
	}

	form {
		display: flex;
		height: 1.5rem;

		* {
			margin: 0;
		}
		input {
			flex: 1;
			box-sizing: border-box;
			height: 100%;
			outline: none;
		}
		button {
			height: 100%;
			font-size: 0.75rem;
			line-height: 0.5rem;
		}
	}
}
</style>
