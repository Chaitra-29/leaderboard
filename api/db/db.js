const mongoose = require("mongoose");
const os = require('os');
const dbURL = os.hostname().indexOf("local") > -1 ? "mongodb://localhost:27017/cyclingmonks" : "mongodb+srv://chaitra:P@ssword1@cluster0.niq3x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" ;
const AthleteModel = require("./Athlete");
class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose.set("useFindAndModify", false);
    mongoose
      .connect(dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Database connection successful");
      })
      .catch((err) => {
        console.error("Database connection error");
      });
  }

  saveAthlete(athleteDetails) {
    return this.getAthlete({ athleteId: athleteDetails.athleteId }).then(
      (response) => {
        if (response.length === 0) {
          return AthleteModel.create(athleteDetails);
        } else if (
          response[0]._doc.accessToken !== athleteDetails.accessToken
        ) {
          return this.updateAthlete(
            { athleteId: athleteDetails.athleteId },
            { accessToken: athleteDetails.accessToken,
              expiresAt: athleteDetails.expiresAt,
              expiresIn: athleteDetails.expiresIn,
              refreshToken: athleteDetails.refreshToken
            }
          ).then(() => {
            return athleteDetails;
          });
        } else {
          return Promise.resolve(response[0]._doc);
        }
      }
    );
  }

  updateAthlete(filter, update) {
    return AthleteModel.findOneAndUpdate(filter, update, {
      new: true,
    });
  }

  getAthletes() {
    return AthleteModel.find();
  }
  getAthlete(query) {
    return AthleteModel.find(query);
  }
}
module.exports = new Database();
