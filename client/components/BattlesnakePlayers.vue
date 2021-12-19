<script setup>
import { ref, useStore, computed, watch } from '@nuxtjs/composition-api';
const store = useStore();

const lightOrDark = bgColor => {
	const match = bgColor.match(/^#([a-z0-9]{6})$/i);
	if (!match) return 'white';

	const color = match[1];
	const r = parseInt(color.slice(0, 2), 16);
	const g = parseInt(color.slice(2, 4), 16);
	const b = parseInt(color.slice(4, 6), 16);

	 // http://www.w3.org/TR/AERT#color-contrast
	const brightness = Math.round(((r * 299) + (g * 587) + (b * 114)) / 1000);
	return (brightness > 125) ? 'black' : 'white';
}

const players = computed(() => store.state.battlesnake.players.list);
</script>

<template>
	<table>
		<thead>
			<tr>
				<th>Players</th>
			</tr>
		</thead>
		<tbody>
			<tr
					v-for="player in players"
					:key="player.id"
					>
					<td
							:style="{
									'color': lightOrDark(player.color),
									'background-color': player.color,
							}"
							class="icon-container"
							>
							<div v-if="player.status === 'alive'" key="alive">
								<span class="fas fa-heart" />
							</div>

							<div v-else-if="player.status === 'dead'" key="dead">
								<span class="fas fa-skull" />
							</div>

							<div v-else-if="player.status === 'winner'" key="winner">
								<span class="fas fa-trophy" />
							</div>
					</td>

					<td>
						<span
								v-if="player.isHost"
								class="host-icon fas fa-crown"
								/>
								{{ player.username }}
					</td>
			</tr>
		</tbody>
	</table>
</template>

<style scoped lang="scss">
.icon-container {
	display: flex;
	align-items: center;
	justify-content: center;
}

.host-icon {
	color: #ee0;
}

table {
	$row-height: 1.5rem;
	$font-size: 1rem;

	border-collapse: collapse;
	border: 2px solid $fg-medium;
	width: 16rem;

	thead {
		background-color: $fg-medium;

		tr {
			height: calc($row-height * 1.5);
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;

			th {
				flex: 1;
				font-size: calc($font-size * 1.25);
			}
		}
	}

	tbody {
		overflow: auto;

		tr {
			height: $row-height;
			display: flex;

			td {
				span {
					font-size: $row-height;
				}

				&:first-child {
					width: $row-height;
				}
				&:last-child {
					flex: 1;
					padding-left: 0.25rem;
				}
			}
		}
	}
}
</style>
