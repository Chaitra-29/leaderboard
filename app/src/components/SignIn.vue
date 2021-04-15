
<template>
    <div>
        <!-- <router-link to="/leaderboard"> -->
        <a href="http://www.strava.com/oauth/authorize?client_id= 54287&response_type=code&redirect_uri=http://localhost:3000/exchange_token&approval_prompt=force&scope=activity:read_all">
            <button type="button" class="btn btn-secondary" @click="connectToStrava">Connect with Strava</button>
            <h2>{{msg}}</h2>
        </a>
        <!-- </router-link> -->
    </div>
</template>

<script>
export default {
    props:['msg'],
    methods:{
        connectToStrava(){
        //     fetch("http://www.strava.com/oauth/authorize?client_id= 54287&response_type=code&redirect_uri=http://localhost:3000/exchange_token&approval_prompt=force&scope=read",{
        //         redirect: 'follow',
        //         mode: 'no-cors',
        //         headers:{
        //             'Access-Control-Allow-Origin':'*'
        //         }
        //     }).then(response => {
        // // HTTP 301 response
        // // HOW CAN I FOLLOW THE HTTP REDIRECT RESPONSE?
        //     if (response.redirected) {
        //         window.location.href = response.url;
        //     }
        // });
        }
    }
}
</script>