<template>
  <div class="connect-button">
    <!-- <router-link to='/route/leaderboard'> -->
    <button type="button" class="btn btn-secondary" @click="signIn()">
      Connect with Strava
    </button>
    <!-- <h2>{{ msg }}</h2> -->
    <!-- </router-link> -->
  </div>
</template>
<style>
.connect-button {
  position: absolute;
  top: 50%;
  left: 50%;
}
</style>
<script>
import { utilities } from "./../common/utilities";
export default {
  methods: {
    signIn() {
      const accessToken = utilities.getAccessTokenFromCookie();
      if (accessToken === "") {
        window.open(
          `http://www.strava.com/oauth/authorize?client_id= 54287&response_type=code&redirect_uri=${utilities.getDomain()}/api/exchange_token&approval_prompt=force&scope=activity:read_all;profile:read_all`,
          "_self"
        );
      } else {
        this.$router.replace("/route/leaderboard");
      }
      //this.$router.replace("/leaderboard");
    },
  },
};
</script>
