const router = require('express').Router();

router.get('/', (req, res) => {
	res.json({
		text: 'Hello, battlesnake!',
	});
});

module.exports = router;
