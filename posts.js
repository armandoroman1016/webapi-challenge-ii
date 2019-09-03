const express = require('express')
const db = require('./data/db.js')

const router = express.Router()
const server = express()

server.use(express.json())

router.get('/', (req, res) =>{
    res.status(200).json({message: "server is connected"})
})

module.exports = router