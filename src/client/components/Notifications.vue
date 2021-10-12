<script>
import NotificationsItem from './NotificationsItem.vue'

export default {
	components: {
		NotificationsItem,
	},
	emits: ['close'],
};
</script>

<template>
	<ul>
		<transition-group name="slide-back">
			<NotificationsItem
					v-for="notification in this.$store.state.notifications"
					:key="notification.id"
					:level="notification.level"
					:id="notification.id"
					:message="notification.message"
					class="notification"
					@click="this.$store.commit('removeNotification', notification.id)"
					>
					{{ notification.data }}
			</NotificationsItem>
		</transition-group>
	</ul>
</template>

<style scoped lang="sass">
ul
	margin: 0
	padding: 0
	display: flex
	flex-direction: column
	position: absolute
	bottom: 1rem
	right: 1rem
</style>
