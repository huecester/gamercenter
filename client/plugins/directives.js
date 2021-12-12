import Vue from 'vue';

Vue.directive('focus', {
	mounted(el) {
		el.focus()
	},
});
