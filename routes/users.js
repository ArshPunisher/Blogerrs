const { Router } = require('express')
const router = Router()
const userModel = require('../models/users')
const {createToken} = require('../service/authentication')

router.get('/signup', (req, res)=>{
    res.render('signup')
})

router.get('/login', (req, res)=>{
    res.render('login')
})

router.get('/logout', (req, res)=>{
    res.clearCookie('token').redirect('/')
})

router.post('/signup', async (req, res)=>{
    const {fullName, email, password} = req.body;
    console.log(fullName, email, password)
    const user = await userModel.create({
        fullName,
        email,
        password
    })
    const token = createToken(user)
    res.cookie('token', token)
    res.redirect('/')
})

router.post('/login', async (req, res)=>{
    const {email, password} = req.body
    try {
        const token = await userModel.matchPassword(email, password)
        res.cookie("token", token)
        res.redirect('/')
    } catch (error) {
        return res.status(400).render('login', {
            error: error.message
        })
    }
})

module.exports = router