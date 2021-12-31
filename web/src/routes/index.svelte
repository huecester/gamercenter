<script>
	import BlockImage from '$lib/components/BlockImage.svelte';
	import BlockLink from '$lib/components/BlockLink.svelte';
	import PortableText from '@portabletext/svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let posts = [];

	const serializers = {
		types: {
			image: BlockImage,
		},
		marks: {
			link: BlockLink,
		},
	}

	function formatDate(dateString) {
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		const date = new Date(dateString);
		return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
	}

	onMount(() => posts = new Promise((resolve, reject) => {
		fetch('/api/posts')
			.then(res => resolve(res.json()))
			.catch(err => reject(err));
	}));
</script>

<main>
	<h1>gamercenter</h1>
	{#await posts}
		<div class="center" out:fade="{{ duration: 100 }}">
			<i class="fas fa-spinner fa-3x fa-spin" />
		</div>
	{:then list}
		{#each list as post}
			<article in:fade="{{ delay: 100, duration: 100 }}">
				<h2>
					{post.title}
					<time datetime={post.creation}>{formatDate(post._createdAt)}</time>
				</h2>
				<PortableText
					blocks={post.body}
					{serializers}
				/>
			</article>
		{/each}
	{:catch err}
		<div class="center" in:fade="{{ delay: 100, duration: 100 }}">
			<i class="fas fa-exclamation-triangle fa-3x" />
		</div>
	{/await}
</main>


<style lang="scss">
	time {
		font-size: 0.75rem;
		font-weight: initial;
		font-style: italic;
	}
</style>
