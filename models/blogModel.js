const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title : {
        type: String,
        required: [true, "Please provide a title for your blog"]
    },
    caption : {
        type: String,
    },
    content: {
        type: String,
        required: [true, "Your blog content cannot be empty"]
    },
    status : {
        type: String,
        required: true,
        enum: ["publish", "unpublish"],
        default: "unpublish"
    },
    author : {
        type: String,
        required : [true, "Please provide an author name for this blog"]
    },
    image : {
        type : String,
        required : [true, "provide an image for your blog post"],
        default : "/images/blogs/scribe.jpg"
    },
    date : Date
});

blogSchema.pre("save", function(next){
    this.date = Date.now() - 1000;
    next();
});



const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
