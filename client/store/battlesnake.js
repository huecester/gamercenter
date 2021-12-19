export const actions =  {
	teardown({ commit }) {
		commit('chat/teardown');
		commit('players/set', []);
		commit('canvas/update', []);
	},
};
