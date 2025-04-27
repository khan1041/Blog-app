

import express from 'express'
import { ragister, Login, updateProfile,  alluser, adminlist, Myprofile, BookMark, bookmarkList, myfollowing, singaleuser, updateimage,getSuggestedUsers } from '../controllers/Usercontrol.js'
import upload from '../middlewares/Multer.js'
import { isAuthenticated } from '../middlewares/isAdmin.js'
const router = express.Router()

router.post('/register', ragister)
router.post('/login', Login)
router.post("/update", isAuthenticated, updateProfile)
router.post("/updatephoto", isAuthenticated, updateimage)
router.get('/users', alluser)
router.get('/admin', adminlist)
router.get('/profile', isAuthenticated, Myprofile)
router.get('/Book/:id', isAuthenticated, BookMark)
router.get('/getsavepost', isAuthenticated, bookmarkList)
router.get('/myfollowing', isAuthenticated, myfollowing)
router.get('/singaleid/:id', isAuthenticated, singaleuser)
router.get('/suggested', isAuthenticated,getSuggestedUsers)

export default router

