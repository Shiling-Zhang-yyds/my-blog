const express = require('express')
const router = express.Router()
const { db, genid } = require('../database/DbUtils')
router.get('/test', async (req, res) => {
    // db.all('select * from `admin`', [], (err, rows) => {
    //     console.log(rows);
    // })
    let result = await db.async.all('select * from `admin`', [])
    console.log('now u r visiting `/test`')
    res.send({
        id: genid.NextId(),
        result
    })
})

module.exports = router