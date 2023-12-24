"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

 // Attach removeStory function to delete button
//  Sources:
// https://www.w3schools.com/jquery/event_on.asp 
// https://stackoverflow.com/questions/8167409/jquery-find-with-an-id
 $story.find('.remove-story').on('click', function() {
  removeStory($(this).data('storyId'));
});

  $allStoriesList.show();
}
navUserProfile //Why is this here?

// Source:https://stackoverflow.com/questions/43231125/how-to-i-call-a-function-when-form-submit
function submitStory(e) {
  // prevents default form submission behavior where page reloads
  e.preventDefault();
  //Get the data from the form
  const title = $("#story-name").val();
  const content = $("#story-content").val();

  // Create new Story
  //Does content match up to any of the attributes of Story?  
  const newStory = new $story(title, content);

  //Call the .addStory method
  storyList.addStory(User.username, newStory);

  // Put new story on page
  const $story = generateStoryMarkup(newStory);
  $allStoriesList.append($story);
}

/*
## 
**Part 4: Removing Stories**
Allow logged in users to remove a story.
Once a story has been deleted, remove it from the DOM and let the API know 
its been deleted.
##
*/

// Sources:
// https://www.w3schools.com/js/js_jquery_dom.asp
// https://rapidapi.com/guides/delete-requests-axios
// function removeStory(storyId){
  // Remove Story through id
 // Original: $("#story-name").remove();
//   $(`#{storyId}`).remove();
//   /* Use axios to make HTTP DELETE request to the API endpoint that handles story 
   // deletion to inform the API that a story has been deleted.  */
    // axios.delete(`${BASE_URL}/posts/${storyId}`)
//     axios.delete(`${BASE_URL}/api/v3/mappings/${storyId}`)
//     .then(response => {
//       console.log(`Successfully deleted post with ID ${storyId}`);
//     })
//     .catch(error => {
//       console.error('Error: ', error.message);
//     });  
// }

function removeFavoriteStory(username,storyId){
  fetch(`https://hack-or-snooze-v3.herokuapp.com/users/${username}/favorites/${storyId}`, {
    method: "DELETE",
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
    removeFavoriteStory(currentUser.username, story.id);
   });