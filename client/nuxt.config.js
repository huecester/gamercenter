export default {
	target: 'static',
	ssr: false,

	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: 'gamercenter',
		htmlAttrs: {
			lang: 'en'
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: 'Gaming gamers' },
			{ name: 'format-detection', content: 'telephone=no' },
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
		],
		script: [
			{ src: 'https://kit.fontawesome.com/0479c34a12.js', crossorigin: 'anonymous' }
		],
	},

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	server: {
		host: process.env.HOST || 'localhost',
		port: process.env.PORT || 3000,
	},

	css: [
		'@/assets/scss/main.scss',
	],

	pageTransition: 'slide',


	// Modules
	modules: [
		'@nuxt/http',
	],

	buildModules: [
		'@nuxtjs/composition-api/module',
		'@nuxtjs/style-resources',
		'@nuxtjs/google-fonts',
	],

	plugins: [
		'@/plugins/id.js',
		'@/plugins/directives.js',
	],

	// Module options
	http: {
		proxy: (process.env.API_PROXY === 'true') ? true : false,
	},

	proxy: {
		'/api/': 'http://localhost:3031',
	},

	styleResources: {
		scss: [ '@/assets/scss/_variables.scss' ],
	},

	googleFonts: {
		families: {
			'Titillium+Web': true,
		},
	},
};
