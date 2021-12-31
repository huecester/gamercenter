import sanityClient from '@sanity/client';

export default sanityClient({
	projectId: process.env.SANITY_API_PROJECT_ID,
	dataset: process.env.SANITY_API_DATASET,
	apiVersion: '2021-03-25',
	useCdn: true,
});
