<script setup>
import { useRoute, ref } from '@nuxtjs/composition-api';
const route = useRoute();

const id = ref(route.value.params.id);
</script>

<template>
	<h1>{{ id }}</h1>
</template>
