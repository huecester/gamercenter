<script>
	import { browser } from '$app/env';
	export let rooms;
</script>

<table>
	<thead>
		<tr>
			<th>Room</th>
			<th>Players</th>
			<th>Password</th>
		</tr>
	</thead>

	<tbody>
		{#each rooms as room (room.id)}
			<tr class="clickable">
				<a class="delink" href="/games/battlesnake/{room.id}">
					<td>
						<p class="big">{room.name}</p>
					</td>

					<td>
						<ul>
							{#each room.players as player (player.id)}
								<li>{player.username}</li>
							{/each}
						</ul>
					</td>

					<td>
						{#if room.hasPassword}
							<i class="fas fa-check fa-3x" />
						{:else}
							<i class="fas fa-times fa-3x" />
						{/if}
					</td>
				</a>
			</tr>
		{/each}
	</tbody>
</table>


<style lang="scss">
	table {
		text-align: center;
		width: 100%;
		border-spacing: 0;
		border: 0.1rem solid $fg-medium;
		margin: 0.5rem 0 2.5rem 0;
		thead {
			background: $fg-medium;
			font-size: 1.5rem;
			tr {
				display: flex;
				th {
					font-weight: normal;
					padding: 0.5rem 0;
					flex: 1;
				}
			}
		}

		tbody tr {
			background-color: $bg-dark;
			&:nth-child(even) {
				background-color: $bg-medium;
			}

			a {
				display: flex;
				align-items: center;

				td {
					flex: 1;

					.big {
						font-size: 1.25rem;
					}

					ul {
						margin: 1rem 0;
						padding: 0;
						li {
							list-style-type: none;
						}
					}
				}
			}
		}
	}
</style>
