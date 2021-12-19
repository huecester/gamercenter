import Vue from 'vue';

Vue.directive('focus', {
	inserted(el) {
		el.focus();
	},
});

Vue.directive('scroll', {
	inserted(el) {
		el.scrollIntoView();
	},
});
