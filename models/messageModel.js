const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    title : {
        type: String,
        required: [true, "Please provide a title for your message"]
    },
    description: {
        type: String,
        required: [true, "Your message description cannot be empty"]
    },
    status : {
        type: String,
        required: true,
        enum: ["available", "unavailable"],
        default: "available"
    },
    author : {
        type: String,
        required : [true, "Please provide an author name for this message"]
    },
    image : {
        type : String,
        required : [true, "provide an image for this message post"],
    },
    year : {
        type : Number,
        required : [true, "please provide a year of publication for this message"]
    }
});

// messageSchema.pre("save", function(next){
//     this.date = Date.now() - 1000;
//     next();
// });



const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
