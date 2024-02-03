const { Router } = require('express')
const router = Router()
const path = require('path')
const blogModel = require('../models/blogs')
const commentModel = require('../models/comments')
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads'))
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`
      cb(null, fileName)
    }
  })
  
  const upload = multer({ storage: storage })
  

router.get('/add-new', (req, res)=>{
    res.render('addBlogs', {
        user: req.user
    })
})

router.get('/:id', async (req, res)=>{
  const blog = await blogModel.findById(req.params.id).populate("createdBy")
  const comments = await commentModel.find({blogId: req.params.id}).populate("createdBy")
  console.log(blog)
  console.log("comments", comments)
  res.render('blogs', {
    user: req.user,
    blog,
    comments,
  })
})

router.post('/comments/:blogId', async (req, res)=>{
  await commentModel.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id
  })
  res.redirect(`/blogs/${req.params.blogId}`)
})

router.post('/', upload.single('coverImage') , async (req, res)=>{
    const {title, body} = req.body;
    const blogData = await blogModel.create({
        title,
        body,
        coverImage: `/uploads/${req.file.filename}`,
        createdBy: req.user._id
    })
    console.log(blogData)
    res.redirect(`/blogs/${blogData._id}`)
})
module.exports = router;