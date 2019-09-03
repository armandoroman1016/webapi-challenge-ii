const express = require('express')
const postRoutes = require('./posts.js')

const server = express()
const port = 8000

server.use(express.json())

server.use('/api/posts', postRoutes)

server.listen(port, () => console.log(`server is listening on port ${port}`))