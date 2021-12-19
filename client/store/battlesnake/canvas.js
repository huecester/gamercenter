export const state = () => ({
	state: [],
});

export const mutations = {
	update(state, newState) {
		state.state = newState;
	},
};
