## Lil' Twitter

## Learning Competencies

- Build a client-side-heavy Rails application.
- Consume a JSON API.
- Build Single Page App.
- write organized JavaScript code

## Summary

Your mission: build a one-page app using  Javascript to render a simple dashboard for a twitter application. The HTML, CSS, and back-end are already written for you -- all you need to do is write the JavaScript.

## Development Setup

requires ruby and rubygems.
```sh
$ bundle install
$ rake db:create && rake db:migrate && rake db:seed
$ rails server
```

## Releases

### Release 0: Architect

We'll be making a single page app, which means we never refresh. All of this will be accomplished using JavaScript. Check the Endpoint Documentation at the bottom of this document to see what data you can request from the server, then look at the Rails app to examine the specific controllers and routes that will allow your Javascript code to send and receive data from the server. You might even hit some of those routes directly in your browser to see what they return.

Your site needs to have the following functionality:

#### Milestone 1

> - On page load, the 50 most recent tweets are displayed in the 'river' running down the middle of the page.
> - On page load, the 10 most popular hashtags are displayed.


#### Milestone 2

> - A user can create a tweet, which will get saved into the database with a fake username, fake handle, and fake avatar (which is all handled server-side).
> - The new tweet should appear atop the 'river', preferrably with some sort of animation.

#### Milestone 3

> - Any hashtags the tweet includes (e.g. #yolo), should also be associated with that tweet.

#### Milestone 4
> - A user can search for a specific hashtag using the search bar. The results of the search will be displayed in the river, replacing whatever was there before.
> - If the user searches for a hashtag that does not exist, the search bar turns red.


#### Milestone 5
> - A user can click on a hashtag in the trends box, which causes the river to display all tweets that are associated with that hashtag, replacing whatever was there before.



### Release 1: Build

For now we're going to _ignore_ making constructors or using the prototype. We want to focus on writing lots of functions! Our functions should be small, single-purpose, and have clear inputs and outputs. We might use some of our functions together to make bigger functions too, we'd call this "function composition".

Each function should be focused on one task. For example, one function might know how to fetch the 50 most recent tweets. Another may know how to take a tweet in and then render some HTML. Yet another function might know how to take an array of tweets and render some HTML.

We're still thinking MVC, but these will be model, view and controller _functions_, not objects. Model functions might fetch and send data. View functions might make HTML. Controller functions might know how to respond to user input, fetching data and displaying it in the process.

You should avoid any changes to the server-side code, although if you feel like changes are necessary, implement them and make sure the tests reflect your alterations. You will need to remove the filler elements in `app/views/index.html`. Structural changes to HTML and CSS should not be necessary.

As an example, here's a diagram that shows how you might think about the functions that control your views and how they might work together.

![views diagram](doc/views.png)

#### Common patterns

When dealing with model style functions that use AJAX, a common pattern is to have the function fetch data from the server and return a _promise_ objects. A `Promise` is what jQuery returns when you call `$.ajax`. It's the thing that we call `.done()` on.

By returning a promise object, your fetching method (a model method) can keep its logic separate from the method that needs to use its data (say a controller method).

Example:

```javascript
   $(document).ready(function() {
      $("#weather-form").on("submit", function() {
         handleWeatherFormSubmit();
      })
   })

   //Model style function
   // Notice that it doesn't do any view work
   function fetchWeather(zip) {
      var requestPromise = $.ajax({url:"/weather", method:"GET", data:{zipcode: zip}});
      return requstPromise;
   }

   //Controller style function
   // Notice that it uses our model function and our view function!
   function handleWeatherFormSubmit() {
      var zip = $("#zip-code").val();
      var promiseFromAjax = fetchWeather(zip);

      //Here the controller function attaches something with .done()
      // so that it can use the view when the data comes back.
      promiseFromAjax.done(function(weatherData) {
         showWeather(weatherData)
      })
   }

   //View style function
   function showWeather(weatherInfo) {
      $("#temperature").html("The temperature will be " + weatherInfo.temp)
   }
```

**If this pattern doesn't make sense, that's ok. Just start coding and check-in with an instructor about this pattern when you're about 30 minutes in.**

### Release 2: Expand

Add an additional feature to your application:

 - add a system for checking if new tweets have been created since page load, using long-polling.
 - have the river of tweets only display 10 tweets, and dynamically load more when the user scrolls to the bottom of the page.
 - give the user the ability to click hashtags inside tweets, which would display tweets associated with that hashtag.

### Endpoint Documentation

`GET /tweets/recent` returns the 50 most recently created tweets in JSON format. The response body looks like this:

  ```json
[
   {
      "avatar_url":"http://robohash.org/marco_schumm",
      "content":"Ut fugit ut labore repellendus.",
      "created_at":"2014-07-20T20:27:42Z",
      "handle":"@marco_schumm",
      "id":500,
      "updated_at":"2014-07-20T20:27:42Z",
      "username":"Adaline Bins",
      "hashtag_names":[
         "est",
         "rerum",
         "distinctio"
      ]
   }
]
  ```

`GET /tweets/search/:hashtag` returns the 50 most recent tweets associated with the given hashtag, with a format similar to the `/recent` endpoint. Will return an empty body with a status code of 404 if the hastag does not exist.

`POST /tweets` creates a new a tweet and associates it with the specified hashtags, if provided. Hashtags that did not previously exist are also created. a request body should take this format:

```json
{
   "tweet":{
      "avatar_url":"http://robohash.org/marco_schumm",
      "content":"Ut fugit ut labore repellendus.",
      "handle":"@marco_schumm",
      "username":"Adaline Bins"
   },
   "hashtags":[
      "foo",
      "bar",
      "baz"
   ]
}
```

If no data is provided for avatar_url, content, handle, or username, fake data is used instead.

The endpoint returns the created tweet as JSON.

  ```json
{
   "avatar_url":"http://robohash.org/Margot Morar II",
   "content":"This is my new tweet",
   "created_at":"2015-07-10T22:18:20Z",
   "handle":"@royal",
   "id":503,
   "updated_at":"2015-07-10T22:18:20Z",
   "username":"Margot Morar II",
   "hashtag_names":[
      "foo",
      "bar",
      "baz"
   ]
}
  ```

`GET /hashtags/popular` returns the names of the 10 most popular hashtags. The output looks like this:

```json
[
   {
      "hashtag_count":"39",
      "name":"labore"
   },
   {
      "hashtag_count":"35",
      "name":"ratione"
   },
   {
      "hashtag_count":"35",
      "name":"architecto"
   },
   {
      "hashtag_count":"33",
      "name":"vero"
   },
   {
      "hashtag_count":"32",
      "name":"ut"
   }
]
```
