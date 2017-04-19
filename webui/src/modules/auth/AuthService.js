import { EventEmitter } from 'events';
import { isTokenExpired } from './jwtHelper';
import Auth0Lock from 'auth0-lock';
import jwtDecode from 'jwt-decode';

export default class AuthService extends EventEmitter {

  constructor(clientId, domain) {
    super();
    // Configure Auth0
    this.lock = new Auth0Lock(clientId, domain, {
      auth: {
        allowedConnections: ['Username-Password-Authentication', 'facebook', 'google'],
        connectionScopes: {
          facebook: ['email', 'public_profile'],
        },
        redirectUrl: `${window.location.origin}/`,
        responseType: 'id_token token',
        params: {
          scope: 'openid profile email name picture',
          audience: 'content.forviz.com',
        },
        oidcConformant: true
      },
    })
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', this._doAuthentication.bind(this))
    // Add callback for lock `authorization_error` event
    this.lock.on('authorization_error', this._authorizationError.bind(this))
    // binds login functions to keep this context
    this.login = this.login.bind(this)
  }

  _doAuthentication(authResult){

    // Saves the user token
    const token = authResult.accessToken;
    // const token = authResult.idToken;

    this.setToken(token);
    console.log('_doAuthentication', authResult);
    debugger;
    const decoded = jwtDecode(token);

    // Async loads the user profile data
    this.lock.getUserInfo(token, (error, profile) => {
      if (error) {
        console.log('Error loading the Profile', error)
        this.emit('login_error', error);
      } else {
        this.setProfile(profile)
        this.emit('login_success', authResult);

      }
    });
  }

  _authorizationError(error){
    // Unexpected authentication error
    console.log('Authentication Error', error);
    this.emit('authorization_error', error);
  }

  login(options) {
    // Call the show method to display the widget.
    this.lock.show(options);
  }

  loggedIn(){
    // Checks if there is a saved token and it's still valid
    const token = this.getToken()
    return !!token && !isTokenExpired(token);
  }

  setProfile(profile){
    // Saves profile data to localStorage
    localStorage.setItem('profile', JSON.stringify(profile))
    // Triggers profile_updated event to update the UI
    this.emit('profile_updated', profile)
  }

  getProfile(){
    // Retrieves the profile data from localStorage
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(localStorage.profile) : {}
  }

  setToken(idToken){
    // Saves user token to localStorage
    localStorage.setItem('access_token', idToken)
  }

  getToken(){
    // Retrieves the user token from localStorage
    return localStorage.getItem('access_token')
  }

  logout(){
    // Clear user token and profile data from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('profile');

    this.emit('logout_success');

  }
}
