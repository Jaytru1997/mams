const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title : {
        type: String,
        required: [true, "Please provide a title for your book"]
    },
    description: {
        type: String,
        required: [true, "Your book description cannot be empty"]
    },
    status : {
        type: String,
        required: true,
        enum: ["available", "unavailable"],
        default: "available"
    },
    author : {
        type: String,
        required : [true, "Please provide an author name for this book"]
    },
    image : {
        type : String,
        required : [true, "provide an image for this book post"],
    },
    year : {
        type : Number,
        required : [true, "please provide a year of publication for this book"]
    }
});

// bookSchema.pre("save", function(next){
//     this.date = Date.now() - 1000;
//     next();
// });

const Book = mongoose.model("book", bookSchema);

module.exports = Book;
