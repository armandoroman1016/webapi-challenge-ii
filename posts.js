const express = require('express')
const db = require('./data/db.js')

const router = express.Router()
const server = express()



//? create a new post
router.post('/', (req, res) =>{
    const postBody = req.body
    if(postBody.title && postBody.contents){
        db.insert(postBody)
        .then( post => res.status(201).json(post))
        .catch( err => res.status(500).json({error: "There was an error while saving the post to the database"}))
    }else{
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
})

// //? post comments to a single post
router.post('/:id/comments', (req, res) =>{
    const comment = req.body
    comment.post_id = Number(req.params.id)
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
    db.findById(id)
        .then( post => {
            if(post){
                res.status(200).json(post)
            }else{
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch( err => res.status(500).json({ error: "The post information could not be retrieved." }))
})

//? get comments for a single post 

router.get('/:id/comments', ( req, res ) =>{
    const { id } = req.params
    db.findPostComments(id)
        .then( post => {
            if(post){
                res.status(200).json(post)
            }else{
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch( err => res.status(500).json({ error: "The comments information could not be retrieved." }))
})

// ? delete a post 

router.delete('/:id', (req, res) => {
    const { id } = req.params
    db.remove(id)
        .then( deleted => {
            if(deleted){
                res.status(204)
            }else{
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch( err => res.status(500).json({ error: "The post could not be removed" }))
})

// //? update a post

router.put('/:id', (req, res) =>{
    const { id } = req.params
    const updatedPost = req.body
    if(updatedPost.title && updatedPost.contents){
        db.update(id, updatedPost)
        .then( updated => {
            if(updated){
                res.status(200).json(updated)
            }else{
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => res.status(500).json({ error: "The post information could not be modified." }))
    }else{
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
})

module.exports = router