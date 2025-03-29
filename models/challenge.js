import { Schema, model, models } from "mongoose";

const TimerSchema = new Schema({
  startTime: {
    type: Date,
    default: null
  },
  endTime: {
    type: Date,
    default: null
  },
  duration: {
    type: Number,
    default: 0
  },
  isRunning: {
    type: Boolean,
    default: false
  },
  pausedTime: {
    type: Number,
    default: 0
  },
  lastPauseTime: {
    type: Date,
    default: null
  }
});

const GameSchema = new Schema({
  name: {
    type: String,
    required: [true, "Der Spielname wird benötigt"],
  },
  winCount: {
    type: Number,
    required: [true, "Die Anzahl der Siege wird benötigt"],
    min: [1, "Die Anzahl der Siege muss mindestens 1 sein"]
  },
  currentWins: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  timer: {
    type: TimerSchema,
    default: () => ({})
  }
});

const ChallengeSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Benutzer-ID wird benötigt"]
  },
  name: {
    type: String,
    required: [true, "Der Challenge-Name wird benötigt"]
  },
  type: {
    type: String,
    required: [true, "Der Challenge-Typ wird benötigt"],
    enum: ["Klassisch", "Münzwurf", "FirstTry"]
  },
  games: {
    type: [GameSchema],
    required: [true, "Mindestens ein Spiel wird benötigt"],
    validate: {
      validator: function (games) {
        return games.length > 0;
      },
      message: "Die Challenge muss mindestens ein Spiel enthalten"
    }
  },
  completed: {
    type: Boolean,
    default: false
  },
  paused: {
    type: Boolean,
    default: false
  },
  forfeited: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  timer: {
    type: TimerSchema,
    default: () => ({})
  }
});

const Challenge = models.Challenge || model("Challenge", ChallengeSchema);

export default Challenge;