import mongoose from "mongoose";

const NovelSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    description: {
        type: String,
        required: true,
    },

    text: {
        type: String,
        required: true
    }
})

const Novel = mongoose.model("Novel", NovelSchema);

export default Novel;