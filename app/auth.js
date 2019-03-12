import { AsyncStorage, Alert } from "react-native";
import axios from "axios";
import config from "../config";


export const loginWithAuth0 = (username, password) => {
    if (username == '' || password == '') {
        return Promise.reject(new Error('Both fields need to be filled'))
    }
    return axios.request({
        url: `${config.auth0_domain}/oauth/token`,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            grant_type: "http://auth0.com/oauth/grant-type/password-realm",
            client_id: config.auth0_client,
            client_secret: config.auth0_secret,
            username: username,
            password: password,
            realm: config.auth0_realm,
            scope: 'openid profile user_metadata app_metadata'
        })
    })
        .then((response) => response.data)
        .then((loginCredentials) => {
            return getProfile(loginCredentials.access_token)
                .then((profileData) => {
                    return storeLoggedUserData(loginCredentials, profileData)
                        .then(() => {
                            return [loginCredentials, profileData]
                        })
                })
        })
        .catch((error) => {
            if(error.message.includes('status code 403')) {
                return Promise.reject(new Error('Mismatched credentials'))
            } else {
                return Promise.reject(new Error(error.message))
            }
        })
} 

export const getProfile = (accessToken) => {
    if (!accessToken) {
        return Promise.reject(new Error('no access token provided'))
    }
    return axios.request({
        url: `${config.auth0_domain}/userinfo`,
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then((response) => {
            return response.data
        })
}

export const storeLoggedUserData = (loginCredentials, profileData) => { // update code to use .multiSet
    // const idTokenPromise = AsyncStorage.setItem('id_token', idToken)
    // const accessTokenPromise = AsyncStorage.setItem('access_token', accessToken)
    // const expiresInPromise = AsyncStorage.setItem('expires_in', '' + expiresIn)
    // return Promise.all([idTokenPromise, accessTokenPromise, expiresInPromise])
    console.log('profile', loginCredentials, profileData)
    const expires_at = Date.now() + (loginCredentials.expires_in * 1000)
    return AsyncStorage.multiSet([
        ['id_token', loginCredentials.id_token],
        ['access_token', loginCredentials.access_token],
        ['expires_at', '' + expires_at],
        ['nickname', profileData.nickname],
        ['email', profileData.name],
        ['avatar', profileData.picture]
    ]);
}

export const getProfileFromStorage = async () => {
    const email = await AsyncStorage.getItem('email')
    const name = await AsyncStorage.getItem('nickname')
    const picture = await AsyncStorage.getItem('avatar')
    return {picture, name, email}
}

export const isLoggedIn = async () => {
    // dont rely on .multiGet order
    const accessToken = await AsyncStorage.getItem('access_token')
    const expiresAt = await AsyncStorage.getItem('expires_at')
    return ( accessToken && expiresAt >= Date.now() ) ? true : false;
};

export const logout = () => {
    let keys = ['id_token', 'access_token', 'expires_at']
    return AsyncStorage.multiRemove(keys)
}