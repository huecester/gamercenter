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
	methods: {
		send() {
			if (this.message) {
				this.$emit('message', this.message);
				this.message = '';
			};
		},
	},
	watch: {
		messages: {
			handler() {
				setTimeout(() => {
					document.querySelector('#messages > li:last-child')?.scrollIntoView();
				}, 0);
			},
			deep: true,
		},
	},
};
</script>

<template>
	<div class="container">
		<ul id="messages">
			<li
					v-for="message in messages"
					:key="message.id"
					>
					<span v-if="message.type === 'message'">
						<span class="bold">{{ message.author }}</span>: {{ message.message }}
					</span>

					<span v-else-if="message.type === 'join'">
						<span class="italic">{{ message.player }} has joined.</span>
					</span>

					<span v-else-if="message.type === 'leave'">
						<span class="italic">{{ message.player }} has left.</span>
					</span>
			</li>
		</ul>
		<form
				class="row"
				@submit.prevent="send"
				>
				<input type="text" id="message" v-model="message" maxlength="64" autocomplete="off" />
				<button type="submit">Send</button>
		</form>
	</div>
</template>

<style scoped lang="sass">
.container
	border: 2px solid $fg-medium
	display: flex
	flex-direction: column
	width: 100%
	height: 12rem
	overflow: auto

ul
	margin: 0
	padding: 0
	flex: 1
	overflow: auto
	line-height: 1.25rem
li
	list-style-type: none
	font-size: 0.8rem
	padding-left: 0.25rem

form
	display: flex
	height: 1.5rem
	*
		margin: 0
	#message
		flex: 1
		height: 100%
		box-sizing: border-box
		outline: none
	button
		height: 100%
		font-size: 0.75rem
		line-height: 0.5rem

.bold
	font-weight: bold
.italic
	font-style: italic
</style>
