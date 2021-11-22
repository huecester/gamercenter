<script setup>
import { defineProps, useContext } from '@nuxtjs/composition-api';
const { store } = useContext();

const props = defineProps({
	id: String,
	level: {
		validator(value) {
			return ['info', 'warn', 'error'].includes(value);
		},
	},
	timeout: {
		type: Number,
		default: 5000,
	},
});

const remove = () => store.commit('notifications/remove', props.id);

setTimeout(remove, props.timeout);
</script>

<template>
	<li
		:class="[this.level, 'clickable', 'delist']"
		@click="remove">
		<div :class="[this.level, 'icon']">
			<span class="fas fa-exclamation fa-3x" />
		</div>
		<div class="text">
			<slot />
		</div>
	</li>
</template>

<style scoped lang="scss">
li {
	display: flex;
	margin: 0.5rem;
	width: 20rem;
	height: 6rem;
	overflow: hidden;
	background-color: $bg-medium;
	border-radius: 0.5rem;

	&.info {
		border: 1px solid $info-dk;
	}
	&.warn {
		border: 1px solid $warn-dk;
	}
	&.error {
		border: 1px solid $error-dk;
	}

	.icon {
		width: 6rem;
		height: 6rem;
		display: flex;
		align-items: center;
		justify-content: center;

		&.info {
			background-color: $info-dk;
		}
		&.warn {
			background-color: $warn-dk;
		}
		&.error {
			background-color: $error-dk;
		}
	}

	.text {
		padding: 0.5rem;
		flex: 1;
	}
}
</style>
