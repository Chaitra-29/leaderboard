
<template>
    <div>
        <!-- <router-link to="/leaderboard"> -->
        <a href="http://www.strava.com/oauth/authorize?client_id= 54287&response_type=code&redirect_uri=http://localhost:3000/api/exchange_token&approval_prompt=force&scope=activity:read_all;profile:read_all">
            <button type="button" class="btn btn-secondary connect-button">Connect with Strava</button>
            <h2>{{msg}}</h2>
        </a>
        <!-- </router-link> -->
    </div>
</template>
<style>
.connect-button {
    margin-top: 50%;
}
</style>
<script>
export default {
    props:['msg']
}
</script>