<script>
import Heading from './components/Heading.vue';
import Counter from './components/Counter.vue';

export default {
	components: {
		Heading,
		Counter,
	},
}
</script>

<template>
	<heading logoPath='/images/logo-black-200px.png'></heading>
	<div id="button-wrapper">
		<counter
				v-for="i in 5"
				:title="i.toString()"
				>
		</counter>
	</div>
</template>

<style lang="sass">
html
	border: 1px solid $test-color-2
</style>
