<script setup>
import { useContext } from '@nuxtjs/composition-api';
const { store } = useContext();
</script>

<template>
	<ul class="delist column">
		<TransitionGroup name="notifications">
			<TheNotificationsItem
					v-for="notification in store.state.notifications.list"
					:key="notification.id"
					:id="notification.id"
					:level="notification.level"
					>
					{{ notification.msg }}
			</TheNotificationsItem>
		</TransitionGroup>
	</ul>
</template>

<style scoped lang="scss">
ul {
	position: absolute;
	bottom: 1rem;
	right: 1rem;
}

.notifications-enter-from,
.notifications-enter,
.notifications-leave-to {
	transform: translateX(4rem);
	opacity: 0;
}
.notifications-enter-active,
.notifications-leave-active, {
	transition: transform 0.25s, opacity 0.25s;
}
.notifications-move {
	transition: transform 0.25s;
}
</style>
