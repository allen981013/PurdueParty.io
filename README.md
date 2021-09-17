# Code Architecture ReadME

Initial connections with Firebase have been made and full development on top of this code should now be possible. Below is a quick overview of what you need to know. For additional information and examples, see the "Events" component and related files. To navigate to it in the browser, add "/events" after your localhost URL.

Each page has its own folder under the "components" folder located in src. This is where primary UI development occurs under render() in the class. However, due to nature of redux + Firebase connection, there are some important considerations to keep in mind:
- Each component needs mapStateToProps and mapDispatchToProps. mapStateToProps is how we "listen" to the database for continous changes via the reducers (see below) and mapDispatchToProps is how we communicate to the component what functions (defined in "actions" folder under "store", again see below) it has access too
- Try to follow the syntax of Events.tsx if at all possible
- We are using typescript so be cognizant of your typing. Similar to Events, each component should have its own State and Props defined (via "interface" keyword) and each state needs a constructor as well. Otherwise we will experience a NullPointerError on the state.

In addition to the UI in the "components" section, each feature needs a reducer. These are found within the store folder (located in src) in the "reducers" folder. These are pretty simple, but try and follow the syntax of the eventReducer. The initState should mimic the fields of that particular doc in the database -> i.e if our "events" collection in Firestore contains an id, title, and date, the initState should contain all those fields with dummy data.
The "actions" within the reducer switch refer to database functions. So, if you add a function in which we delete/add/modify something in Firestore, there needs to be cases for the Success/Error flags here. Pretty much in every circumstance a console.log() and "return state" will do.
!IMPORTANT! Don't forget to append your new reducers to the list of reducers in the rootReducer. It will not work if you do not add it to the root reducer.

Finally, each feature will probably have some database functions. These are located within the "actions" folder (next to the "reducers" folder). It is extremely important that the exact syntax of the example "addEvent" function is followed -> it ensures we have access to the database via Redux within these functions. Other than that, pretty straightforward: Grab an instance of the database and then use Firebase's functions to query, edit, modify, whatever is needed. Be sure to add a ".then()" and ".catch()" at the end of each DB transaction. This is where you "dispatch" (i.e. throw) those flags to the reducer. These codes/flags should line up with what the reducer is expecting. Again, if there's no dispatch, things are likely to break.

One last thing - if you're developing a new feature/page/component, be sure to add it to the Switch in App.tsx as well. You'll need to supply a path that will be used in the URL to the page (e.x. if the path is "/forum", the URL would be something like "localhost:3000/forum" or "purdueparty.io/forum"). Be sure to add it to the end of the list, not the beginning. Otherwise, since "/" is a part of all the other paths, our site will route to the wrong home/opening pages.

That should be enough info to get started. As of me writing this (09/16), the intro code runs on my machine. If it doesn't for you (i.e. "npm start" results in a crash), it's probably a case of missing libraries. Try "npm install --missing" or you can do them manually. As always, if you guys need any help or clarifications reach out on discord! Good luck!

-------------------------------------------------------------------------------------------------------------------------------------------

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
