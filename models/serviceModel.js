const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    title : {
        type: String,
        required: [true, "Please provide a title for your blog"],
        enum: ["Empowerment", "Celebration", "Gratitude", "Impossible Places", "Cell Fellowship"]
    },
    link : {
        type: String,
        required : [true, "Please provide a livestream link for this service"],
        default: "https://live.keynigeria.org"
    },
    image : {
        type : String,
        required : [true, "provide an image for this service"]
    },
    date : {
        type: Date,
        required: true,

    }
});

serviceSchema.pre("save", function(next){
    if(this.title === "Empowerment") {
        this.image = "/images/empowerment.jpg";
    }else if (this.title === "Celebration") {
        this.image = "/images/celebrate.jpg";
    }else if (this.title === "Gratitude") {
        this.image = "/images/gratitude.jpg";
    }else if (this.title === "Impossible Places") {
        this.image = "/images/impossible_places.jpg";
    }else if (this.title === "Cell Fellowship") {
        this.image = "/images/cell_fellowship.jpg";
    }
    next();
});



const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
