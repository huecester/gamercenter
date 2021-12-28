<script>
	import { fly } from 'svelte/transition';
</script>

<div
	in:fly="{{delay: 500, duration: 500, x: -250, opacity: 0}}"
	out:fly="{{duration: 500, x: 250, opacity: 0}}"
>
	<slot />
</div>
