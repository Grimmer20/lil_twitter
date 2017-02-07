$(document).ready(function() {
  loadTweets();
  loadHashtags();
  handleTweetSubmission();
});

function renderTweets(response) {
  var all_tweets = "";
  response.forEach(function(tweet) {
    all_tweets += generateOneTweet(tweet);
  });
  $("#tweets-pylon").append(all_tweets);
}

function generateOneTweet(tweet) {
  return `<li class="tweet">
        <img class="avatar" src=${tweet.avatar_url} alt="">
        <div class="tweet-content">
          <p>
            <span class="full-name">${tweet.username}</span>
            <span class="username">${tweet.handle}</span>
            <span class="timestamp">- ${tweet.created_at}</span>
          </p>
          <p>${tweet.content} Hashtags: ${tweet.hashtag_names} </p>
        </div>
      </li>`;
}

function getTweets() {
   var requestPromise = $.ajax({url:"/tweets/recent", method: "GET"});
  return requestPromise;
}

function loadTweets() {
  var promise = getTweets();
  promise.done(renderTweets);
}

function renderHashtags(response) {
  var allHashtags = "";
  response.forEach(function(hashtag) {
    allHashtags += generateOneHashtag(hashtag);
  });
  $("#hashtags-pylon").append(allHashtags);
}

function generateOneHashtag(hashtag) {
  return `<li># ${hashtag.name}</li>`;
}

function getHashtags() {
  return $.ajax({url: "/hashtags/popular"});
}

function loadHashtags() {
  getHashtags().done(renderHashtags);
}

  // $("#tweets-pylon").on("submit", "#tweet-form", function(event) {
function handleTweetSubmission() {
  $("#tweet-form").on("submit", function(event) {
    event.preventDefault();
    var form = $("#tweet-form");
    var data = $("#new-tweet").val();
    var hashtags = $("#new-tweet").val().match(/#[A-z]*/);
    console.log(hashtags);


    $.ajax({
      url: "/tweets",
      method: "POST",
      data: {tweet: {content: data}, hashtags: hashtags}
    }).done(function(response) {
      console.log("success");
      $("#tweets-pylon").prepend(generateOneTweet(response)).fadeIn('5000');
      form.trigger('reset');
    });
  });
}




















