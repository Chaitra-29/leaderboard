<template>
  <div>
    <nav class='navbar sticky-top navbar-light bg-light'>
      <a class='navbar-brand' href='#'>
        <img :src='brandImage' class='avatar' alt='' />
        {{ brandName }}
      </a>
      <span class='navbar-text'>
        <img :src='athleteImage' class='avatar' alt='' />
      </span>
    </nav>
    <table class='table table-striped'>
      <thead>
        <tr>
          <th scope='col'>Rank</th>
          <th scope='col'>Athlete</th>
          <th scope='col'>Distance</th>
          <th scope='col'>Rides</th>
          <th scope='col'>Longest</th>
          <th scope='col'>Avg Speed</th>
          <th scope='col'>Elevation Gain</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='(activity, index) in activities' :key='index'>
          <th scope='row'>{{ index + 1 }}</th>
          <td>{{ activity.athlete }}</td>
          <td>{{ activity.distance }} km</td>
          <td>{{ activity.rides }}</td>
          <td>{{ activity.longestRide }} km</td>
          <td>{{ activity.totalAvgSpeed }} km/h</td>
          <td>{{ activity.totalElevationGain }} m</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style>
.avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
</style>
<script>
import moment from 'moment';
import { utilities } from './../common/utilities';
import brandImage from '../assets/cyclingmonks.jpg';
import userIcon from '../assets/userIcon.png';
export default {
  data() {
    return {
      clubId: '675234',
      headers: {},
      athleteImage: userIcon,
      athleteName: '',
      brandName: 'CyclingMonks',
      brandImage: brandImage,
      activities: [],
      activityType: 'Ride',
      domain: utilities.getDomain()
    };
  },
  beforeMount: function() {
    let accessToken = utilities.getAccessTokenFromCookie();
    // if (accessToken === '') {
    //   this.$router.replace('/');
    // } else {
      this.headers = { Authorization: `Bearer ${accessToken}` };
      this.getAthlete().then((response) => {
        if (response.errors) {
          this.refreshAccessToken(accessToken).then((athlete) => {
            this.setAthleteDetails(athlete);
          });
        } else {
          this.setAthleteDetails(response.data);
        }
        this.refreshAccessTokens().then(() => {
          this.formatActivities();
        });
      });
    //}
  },
  methods: {
    async refreshAccessTokens() {
      const response = await fetch(
        `${this.domain}/api/refreshAccessTokens`,
        {
          headers: {
            accept: 'application/json',
          },
        }
      );
      return await response.json();
    },

    async getAthlete() {
      const response = await fetch(`${this.domain}/api/getAthleteStrava`, {
      //const response = await fetch('https://www.strava.com/api/v3/athlete', {
        headers: this.headers,
        credentials: 'include'
      });
      return await response.json();
    },
    async saveAthlete(athlete) {
      let response = await fetch(`${this.domain}/api/athlete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          accept: 'application/json',
        },
        body: JSON.stringify(athlete),
      });
      response = await response.json();
      console.log(response);
    },
    async getActivities() {
      const response = await fetch(`${this.domain}/api/activities`, {
        headers: this.headers,
      });
      return await response.json();
    },

    async refreshAccessToken(accessToken) {
      let response = await fetch(
        `${this.domain}/api/refreshAccessToken`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
            accept: 'application/json',
          },
          body: JSON.stringify({ accessToken }),
        }
      );
      return await response.json();
    },

    setAthleteDetails(athlete) {
      console.log('athlete--->', athlete);
      this.athleteName = athlete.firstname;
      this.athleteImage = athlete.profile_medium;
    },

    formatActivities() {
      this.getActivities().then((response) => {
        const responseArray = response.data;
        responseArray.forEach((data) => {
          response = data.value;
          console.log('athActivities--->', response);
          let athlete = {};
          let totalDistance = 0;
          let totalElevationGain = 0;
          let totalAvgSpeed = 0;
          let rides = 0;
          let longestRide = parseFloat(
            (response[0].distance / 1000).toFixed(2)
          );
          athlete.athlete = data.athleteName;
          const weekStartDay = moment()
            .day('Monday')
            .toDate();
          response.forEach((activity) => {
            let isValidDate =
              moment(activity.start_date).isSameOrBefore(weekStartDay) &&
              moment(activity.start_date).isAfter(moment('2021-4-01'));
            if (activity.type === this.activityType && isValidDate) {
              rides++;
              let activityDistance = this.convertToTwoDecimal(
                activity.distance
              );
              totalDistance = totalDistance + activityDistance;
              longestRide =
                longestRide < activityDistance ? activityDistance : longestRide;
              totalElevationGain =
                totalElevationGain + activity.total_elevation_gain;
              totalAvgSpeed = totalAvgSpeed + activity.average_speed;
            }
          });
          athlete.rides = rides;
          athlete.distance = totalDistance;
          athlete.longestRide = longestRide;
          athlete.totalElevationGain = totalElevationGain;
          athlete.totalAvgSpeed = (((totalAvgSpeed / rides) * 18) / 5).toFixed(
            2
          );

          this.activities.push(athlete);
        });
      });
    },

    // async getClubMembers(){
    //     const response = await fetch(`https://www.strava.com/api/v3/clubs/${this.clubId}/members`, {
    //     headers: this.headers
    //   });
    //   return await response.json();
    // }
    convertToTwoDecimal(data) {
      return parseFloat((data / 1000).toFixed(2));
    },
  },
};
</script>
