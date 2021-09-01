const mongoose = require("mongoose");
const { schema } = require("./Workout");

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema ({

    type: {
        type: String,
        unique: true,
        required: true
    },

    name: {
        type: String,
        trim: true,
        required: true
    },

    duration: {
        type: Number,
        required: true
    },

    weight: {
        type: Number,
        required: true
    },
    
    reps: {
        type: Number,
        required: true
    },
    sets: {
        type: Number,
        required: true
    }
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;