let express = require('express')
let router = express.Router()

router.get('/', async (req, res) => {
    return res.render('home', {})
})

module.exports = router