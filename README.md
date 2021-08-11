Objective:

Build a chat app for mobile devices using React Native. The app provide users with a minimalistic chat interface and the possibility to share images and their location.

User Stories:
As a new user, I want to be able to easily enter a chat room so I can quickly start talking to my friends and family.
As a user, I want to be able to send messages to my friends and family members to exchange the latest news.
As a user, I want to send images to my friends to show them what I’m currently doing.
As a user, I want to share my location with my friends to show them where I am.
As a user, I want to be able to read my messages offline so I can reread conversations at any time.
As a user with a visual impairment, I want to use a chat app that is compatible with a screen reader so that I can engage with a chat interface.

Key Features:
A page where users can enter their name and choose a background color for the chat screen before joining the chat.

A page displaying the conversation, as well as an input field and submit button.

When the user clicks the "Start Chatting" button, the athentication will take place. The App is using an Anonymous Authentication and the user will not be prompted for credentials. Because of the Anonymous Authentication the user can only see the history of his conversations as long as he is using the same device he was authenticated with.

Pressing the "+" button inside the message input,will open a menu where the user can choose whether to select an image from the device's library, take a new picture or send their location.

The chat provide users with two additional communication features: sending images and location data.

Data gets stored online and offline.

Libraries:
Gifted Chat
React Navigation

To run the App:

1)To run the app on your device, you need the last Node.js LTS version and the Expo CLI installed globally.

npm install -g expo-cli
2)Clone the repo and install all the dependencies in package.json.

npm install

3)Start the App with

expo start
This will open a new Tab in your browser.

4)To run the App on a smartphone

Create an expo account than download the Expo Go app from the store on your smartphone.
Connect your Smartphone and your Computer to the same wireless network.
On Android use the Expo Go app to scan the QR Code in the new tab of your web browser, opened after running "expo start".
On iOS, use the built-in QR code scanner of the Camera app.
The "Hello-World" app should be visible now on your smartphone.

5)To run the App an emulator

In your web browser go to the tab opened after running "expo start" and click on "Run on Android device/emulator" or "Run on IOS simulator".
