const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({

   day: {
       type: Date,
       required: true
   },
   totalDuration: {
       type: Number,
       required: true
   },
   exercises:  [
    {
      type: Schema.Types.ObjectId,
      ref: "Exercise"
    }
  ]
});

WorkoutSchema.methods.addTime = function() {

    this.totalDuration += this.exercises.duration;
}

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;