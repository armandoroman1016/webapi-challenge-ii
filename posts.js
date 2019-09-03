const express = require('express')
const db = require('./data/db.js')

const router = express.Router()
const server = express()

server.use(express.json())

router.get('/', (req, res) =>{
    res.status(200).json({message: "server is connected"})
})

//? create a new post
router.post('/', (req, res) =>{
    const postBody = req.body
    if(!postBody.title || postBody.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }else{
        db.insert(postBody)
            .then( post => res.status(201).json(post))
            .catch( err => res.status(500).json({error: "There was an error while saving the post to the database"}))
    }
})

//? post comments to a single post
router.post('/posts/:id/comments', (req, res) =>{
    const { id } = req.params
    const comment = req.body
    if(!comment.text){
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }else{
        db.insertComment(comment)
            .then( comment => {
                if(comment){
                    res.status(201).json(comment)
                }else{
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })
            .catch( err => res.status(500).json({ error: "There was an error while saving the comment to the database" }))
    }
})

//? get all posts
router.get('/', (req, res) => {
    db.find()
        .then( posts => res.status(200).json(posts))
        .catch( err => res.status(500).json({ error: "The posts information could not be retrieved." }))
})

//? get post by id
router.get('/:id', (req, res) => {
    const { id } = req.params
    db.find(id)
        .then( post => {
            if(post){
                res.status(200).json(post)
            }else{
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch( err => res.status(500).json({ error: "The post information could not be retrieved." }))
})


module.exports = router