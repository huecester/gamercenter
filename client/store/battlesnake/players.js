export const state = () => ({
	list: [],
});

export const mutations = {
	set(state, newPlayers) {
		state.list = newPlayers || [];
	},
};
