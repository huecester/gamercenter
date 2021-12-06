export const state = () => ({
	posts: [],
	bots: [],
});

export const mutations = {
	setPosts(state, newPosts) {
		state.posts = newPosts;
	},
	setBots(state, newBots) {
		state.bots = newBots;
	},
};
