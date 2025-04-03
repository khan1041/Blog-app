


import express from 'express'
import { videopost, allvideos, like, dislike,mypost, followofunfollow, friendpost, singalepost, addcomment, getCommentsOfPost,mycomment } from '../controllers/VideoPost.js'
import upload from '../middlewares/Multer.js'
import { isAuthenticated } from '../middlewares/isAdmin.js'
const postrouter = express.Router()


//Video router
postrouter.get('/mypost',isAuthenticated, mypost)
postrouter.post('/post', isAuthenticated, videopost)
postrouter.get('/getAllpost', allvideos)
postrouter.get('/singalepost/:id', isAuthenticated, singalepost)
postrouter.post('/like/:id', isAuthenticated, like)
postrouter.post('/dislike/:id', isAuthenticated, dislike)
postrouter.post('/follow/:id', isAuthenticated, followofunfollow)
postrouter.post('/commentpost/:id', isAuthenticated, addcomment)
postrouter.get('/comment/:id', isAuthenticated, getCommentsOfPost)
postrouter.get('/comment/:id', isAuthenticated, getCommentsOfPost)
postrouter.get('/mycomment/:id', isAuthenticated, mycomment)


export default postrouter














