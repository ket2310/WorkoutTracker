const express = require("express");
const logger = require("morgan");
const path = require("path");
const PORT = process.env.PORT || 3000;

const app = express();

const mongoose = require('mongoose');
const db = require('./models');

mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/workout', {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const pipeline = [
  {
    '$addFields': {
      'totalDuration': {
        '$sum': '$exercises.duration'
      }
    }
  }
]

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "./public/index.html"));
});


app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/stats.html"));
});

app.post("/api/workouts", (req, res) => {
  //console.log("NEW WORKOUT: " + req.body)
  req.body.day = new Date(new Date().setDate(new Date().getDate())),
    db.Workout.insert(req.body, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        console.log(data)
        res.send(data);
      }
    });
});

app.get("/api/workouts", (req, res) => {
  db.Workout.aggregate(pipeline, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      console.log(data)
      res.json(data);
    }
  });
});

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

app.get("/find/:id", (req, res) => {
  db.Workout.find({"day": id},
    (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.json(data);
      }
    }
  );
});

app.get("/api/workouts/range", (req, res) => {
  db.Workout.aggregate([
    {
      '$addFields': {
        'totalDuration': {
          '$sum': '$exercises.duration'
        }
      }
    }, {$limit: 7}],(error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.json(data);
      }
    }
  )
})
app.put("/api/workouts/:id", (req, res) => {
  db.Workout.updateOne(
    {
      _id: req.params.id
    },
    {
      $push: {
        exercises: {
          type: req.body.type,
          name: req.body.name,
          duration: req.body.duration,
          distance: req.body.distance,
          weight: req.body.weight,
          reps: req.body.reps,
          sets: req.body.sets
        }
      }
    },
    (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    }
  );
});

app.delete("/delete/:id", (req, res) => {
  db.exercises.remove(
    {
      _id: mongojs.ObjectID(req.params.id)
    },
    (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    }
  );
});

app.delete("/clearall", (req, res) => {
  db.exercises.remove({}, (error, response) => {
    if (error) {
      res.send(error);
    } else {
      res.send(response);
    }
  });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
