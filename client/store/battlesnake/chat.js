export const state = () => ({
	messages: [],
});

export const mutations = {
	msg(state, { text, author }) {
		state.messages.push({
			type: 'message',
			id: this.$genID(),
			text,
			author,
		});
	},

	join(state, username) {
		state.messages.push({
			type: 'player',
			id: this.$genID(),
			action: 'joined',
			username,
		});
	},

	leave(state, username) {
		state.messages.push({
			type: 'player',
			id: this.$genID(),
			action: 'left',
			username,
		});
	},

	countdown(state, n) {
		state.messages.push({
			type: 'countdown',
			n,
		});
	},

	winner(state, username) {
		state.messages.push({
			type: 'winner',
			username,
		});
	},

	teardown(state) {
		state.messages = [];
	},
};
