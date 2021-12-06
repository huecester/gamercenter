export const state = () => ({
	list: [],
});

export const mutations = {
	add(state, data) {
		state.list.push({
			level: data.level,
			msg: data.msg,
			id: this.$genID(),
		});
	},
	remove(state, id) {
		state.list = state.list.filter(item => item.id !== id);
	},
};
