export const state = () => ({
	list: [],
});

export const mutations = {
	info(state, msg) {
		state.list.push({
			level: 'info',
			msg,
			id: this.$genID(),
		});
	},
	warn(state, msg) {
		state.list.push({
			level: 'warn',
			msg,
			id: this.$genID(),
		});
	},
	error(state, msg) {
		state.list.push({
			level: 'error',
			msg,
			id: this.$genID(),
		});
	},
	remove(state, id) {
		state.list = state.list.filter(item => item.id !== id);
	},
};
