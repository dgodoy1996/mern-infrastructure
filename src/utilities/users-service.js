// Service modules export business/app logic
// such as managing tokens, etc.
// Service modules often depend upon API modules
// for making AJAX requests to the server.

import * as usersAPI from './users-api';

export async function signUp(userData) {
  const token = await usersAPI.signUp(userData);
  //Persist the "token"
  localStorage.setItem('token', token)
  return getUser()
}

export async function login(credentials) {
  const token = await usersAPI.login(credentials)
  localStorage.setItem('token', token)
  return getUser()
}

export async function logOut() {
  localStorage.removeItem('token')
}

export function getToken() {
  const token = localStorage.getItem('token')
  
  //No token exists
  //User state set to null
  if(!token) return null
  
  //Valid token exists
  //Get user from the token
  //Set user state to the user object
  const payload = JSON.parse(atob(token.split('.')[1]))
  
  //Token exists but it's expired
  //Set user state to null
  //Remove the token from storage
  if(payload.expiration < Date.now() / 1000) {
    localStorage.removeItem('token')
    return null
  }
  return token
}

export function getUser() {
  const token = getToken()
  return token ? JSON.parse(atob(token.split('.')[1])).user : null
}

export async function checkToken() {
  return usersAPI.checkToken()
  .then(dateStr => new Date(dateStr))
}