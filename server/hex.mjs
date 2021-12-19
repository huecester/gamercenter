const genHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

export const genID = () => genHex(8);
export const genColor = () => `#${genHex(6)}`
