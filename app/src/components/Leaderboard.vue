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
import brandImage from '../../public/cyclingmonks.jpg'
export default {
  data() {
    return {
      clubId: '675234',
      headers: {},
      athleteImage: '',
      athleteName: '',
      brandName: 'CyclingMonks',
      brandImage: brandImage,
      activities: [],
      activityType: 'Ride',
    };
  },
  beforeMount: function() {
    this.refreshAccessToken()
      .then(() => {
        this.getAccessTokenFromCookie().then((accessToken) => {
          this.headers = { Authorization: `Bearer ${accessToken}` };
          this.getAthlete().then((response) => {
            console.log('athlete--->', response);
            this.athleteName = response.firstname;
            this.athleteImage = response.profile_medium;
          });
          //     console.log('athActivities--->', this.activities);
          // const athleteActivities = response.filter( activity => activity.type === this.activityType );
          // athlete.rides = athleteActivities.length;

          // athlete.longestDistance = athleteActivities.sort((a, b) => a - b);
          // console.log('athActivities--->', this.athleteActivities);
          // //this.athleteActivities
          // athlete.distance = athleteActivities.reduce((accumulator, currentValue) => {
          //     currentValue = parseFloat((currentValue.distance / 1000).toFixed(2));
          //     accumulator + currentValue;
          // });
        });
        this.formatActivities();
      })
      .catch((err) => {
        console.log(err.message);
      });
    //}
  },
  methods: {
    async refreshAccessToken() {
      const response = await fetch(
        'http://localhost:3000/api/refreshAccessToken',
        {
          headers: {
            accept: 'application/json',
          },
        }
      );
      return await response.json();
    },
    async getAccessTokenFromCookie() {
      return await document.cookie.split(';').find(row => row.trim().startsWith('accessToken')).split('=')[1];
    },
    async getAthlete() {
      const response = await fetch('https://www.strava.com/api/v3/athlete', {
        headers: this.headers,
      });
      return await response.json();
    },
    async saveAthlete(athlete) {
      let response = await fetch('http://localhost:3000/api/athlete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'accept': 'application/json',
        },
        body: JSON.stringify(athlete),
      });
      response = await response.json();
      console.log(response);
    },
    async getActivities() {
      const response = await fetch(`http://localhost:3000/api/activities`, {
        headers: this.headers,
      });
      return await response.json();
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
