export default ({ app }, inject) => {
	inject('genID', () => [...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join(''));
}
