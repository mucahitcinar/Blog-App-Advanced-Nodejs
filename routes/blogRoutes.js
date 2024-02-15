const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const Blog = mongoose.model('Blog');
const clearHash=require("./../middlewares/clearHash")

module.exports = app => {
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id
    });

    res.send(blog);
  });

  app.get('/api/blogs', requireLogin, async (req, res) => {
    const blogs = await Blog
      .find({ _user: req.user.id })
      .cache(req.user.id)

    res.send(blogs);
  });





  app.post('/api/blogs', requireLogin,clearHash, async (req, res) => {
    const { title, content,imageUrl} = req.body;

    const blog = await Blog.create({
      title,
      content,
      imageUrl,
      _user: req.user.id
    });

    try {
res.send(blog);
    } catch (err) {
      res.status(400).json(
        {
          err
        }
        )
        console.log(err)
    }

    
  });


};
