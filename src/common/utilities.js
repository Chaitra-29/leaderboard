export const utilities = {
    getAccessTokenFromCookie() {
        const token = document.cookie.split('; ').find(row => row.startsWith('accessToken'))
        return  token ? token.split('=')[1] : '';
    },
    getDomain(){
        return window.location.hostname === "localhost" ? "http://localhost:3000" : "https://hidden-island-62961.herokuapp.com";
    }
};
