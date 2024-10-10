# Creating new components

Command for creating new component:
npx generate-react-cli component SampleComponent

Config for this one can be found in root/generate-react-cli.json. Status of different params can be found there

# Technologies used

## PostCSS

Need to confirm

## Unit testing

Jest and enzyme are used for unit testing

## E2E and integration testing

cypress is used

## Code formatting

For code formatting, ESlint, prettier and AirBnB style guide is used

Refer [this](https://blog.bitsrc.io/how-to-set-up-airbnb-style-guide-for-react-projects-fc7dfb1f3d68) for more info
[Airbnb JS Style guide](https://github.com/airbnb/javascript)
[Airbnb React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)

# Folder Structure

## assets

Contains the assets like images, css & fonts

## Components

They will hold the UI for the application

## constants

It contain the constant file like Regex & other application generic constant

## layout

It contains the layout components. layout is the common top wrapper component usually will contain navbar , sidebar and children components

## pages

A centralized location for routes

## routes

It contain the page routes. Dynamic configuration is best with working with routes. Usually it have an nested array to render the routes

## schema

schema files which can be used for validation, type checks etc

## services

Connectors of your application with the outside world. Any form of API call or websocket interaction which needs to happen, to share data with an external service or client, should happen within this folder.

## styles

Although the go-to way is to just embed styles inside of the UI by using a CSS-in-JS solution like Styled-Components or coupled in the component folder itself, it’s sometimes helpful to have a global set of styles in a CSS file.

## utils

It contains the reusable helper functions

# Installation details

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
