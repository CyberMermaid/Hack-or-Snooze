"use strict";

// global to hold the User instance of the currently-logged-in user
let currentUser;

/******************************************************************************
 * User login/signup/login
 */

/** Handle login form submission. If login ok, sets up the user instance */

async function login(evt) {
  console.debug("login", evt);
  evt.preventDefault();

  // grab the username and password
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // User.login retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset");

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();
}

$loginForm.on("submit", login);

/** Handle signup form submission. */

async function signup(evt) {
  console.debug("signup", evt);
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // User.signup retrieves user info from API and returns User instance
  // which we'll make the globally-available, logged-in user.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

/** Handle click of logout button
 *
 * Remove their credentials from localStorage and refresh page
 */

function logout(evt) {
  console.debug("logout", evt);
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/******************************************************************************
 * Storing/recalling previously-logged-in-user with localStorage
 */

/** If there are user credentials in local storage, use those to log in
 * that user. This is meant to be called on page load, just once.
 */

async function checkForRememberedUser() {
  console.debug("checkForRememberedUser");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Sync current user information to localStorage.
 *
 * We store the username/token in localStorage so when the page is refreshed
 * (or the user revisits the site later), they will still be logged in.
 */

function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage");
  try {
    if (currentUser) {
      localStorage.setItem("token", currentUser.loginToken);
      localStorage.setItem("username", currentUser.username);
    }
  }
  catch { console.log("Current user is", currentUser) }
}

/******************************************************************************
 * General UI stuff about users
 */

/** When a user signs up or registers, we want to set up the UI for them:
 *
 * - show the stories list
 * - update nav bar options for logged-in user
 * - generate the user profile part of the page
 */

function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin");

  $allStoriesList.show();

  updateNavOnLogin();
}

/**  The methods for adding and removing favorite status on a story 
* - should be defined in the User class. 
*/



// function addFavoriteStory(storyId)
// {
//   let story = storyList.find(story => story.id === storyId);
//   story.favorite = !story.favorite;

//   if (story.favorite) {
     // push story into currentUser's array of storyList
//     currentUser.storyList.push(story);
//   } else {
//     let index = currentUser.storyList.indexOf(story);
//     currentUser.storyList.splice(index, 1);
//   }
// }
// https://hackorsnoozev3.docs.apiary.io/#reference/0/user-favorites/add-a-new-favorite?console=1
function addFavoriteStory(username,storyId){
  fetch(`https://hack-or-snooze-v3.herokuapp.com/users/${username}/favorites/${storyId}`, {
  method: "POST",
  headers: {
    "Content-type": "application/json; charset=UTF-8"
  }
})
  .then((response) => response.json())
  .then((json) => console.log(json));
}

$('#all-stories-list').on('click', function() {
  let storyId = $(this).attr('id');
  let story = storyList.find(story => story.id === storyId);
  addFavoriteStory(currentUser.username, story.id);
 });
 
// https://teamtreehouse.com/community/how-to-create-an-upvotedownvote-button-using-javascriptor-anything-for-that-matter 
// https://stackoverflow.com/questions/11075007/working-with-data-in-jquery
// https://forums.phpfreaks.com/topic/163209-onclick-favoriteunfavorite-with-ajax/
// https://stackoverflow.com/questions/61881098/how-to-keep-favorite-unfavorite-button-color-after-page-reload

// add the feature to mark/unmark a story as favorite javascript
// function markFavoriteStory{

// https://codepen.io/bennettfeely/pen/bGEpVv
// https://codereview.stackexchange.com/questions/133669/upvote-downvote-toggle
// }