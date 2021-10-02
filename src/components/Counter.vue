<script>
export default {
	data() {
		return {
			count: 0,
		};
	},
	props: {
		title: String,
	},
};
</script>

<template>
	<button @click="count++">
		{{ title }}: You clicked me {{ count }} times.
	</button>
</template>
