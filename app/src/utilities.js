export const utilities = {
    getAccessTokenFromCookie() {
        const token = document.cookie.split('; ').find(row => row.startsWith('accessToken'))
        return  token ? token.split('=')[1] : '';
    },
};
