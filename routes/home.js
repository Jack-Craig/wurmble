let express = require('express')
let router = express.Router()

router.get('/', async (req, res) => {
    return res.render('home', {
        word:process.env.WORD,
        wurmbleno:process.env.WURMBLE_DAY
    })
})
module.exports = router