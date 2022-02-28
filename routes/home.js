let express = require('express')
let router = express.Router()

router.get('/', async (req, res) => {
    return res.render('home', {word:process.env.word})
})
module.exports = router