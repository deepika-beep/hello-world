import React from "react";
import { GiftedChat, InputToolbar, Bubble } from "react-native-gifted-chat";
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView ,Button} from 'react-native';
import PropTypes from 'prop-types';
// local storage for React Native
import AsyncStorage from '@react-native-community/async-storage';
// to see if a user is on or offline
import NetInfo from '@react-native-community/netinfo';
// import firebase from 'firebase';
// import 'firebase/firestore';
const firebase = require('firebase');
require('firebase/firestore');
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC1ksZMncmScjQyqVvQiYBOd8YRy3OwRjg",
  authDomain: "test-f9fd0.firebaseapp.com",
  projectId: "test-f9fd0",
  storageBucket: "test-f9fd0.appspot.com",
  messagingSenderId: "156604957819",  
  appId: "1:156604957819:web:a33f329b7f9d71a61a0ede",

}

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: '',
      connection: false,
      name: this.props.route.params.name,
      bgColor: this.props.route.params.bgColor
    }

    // Initialize the app
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Reference the "messages" collection of the db
    this.referenceChatMessages = firebase.firestore().collection("messages");
    // Define the listeners for authentication and firebase updates
    unsubscribe = function(){};
    authUnsubscribe = function(){};
  }

  // Save messages in AsyncStorage
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error);
    }
  }
  //  function that loads the messages from asyncStorage
  async getMessages() {
    let messages = '';
    let uid = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      // get the uid from Async storage and update the state so the GiftedChat will render the messages in different bubbles
      uid = await AsyncStorage.getItem('uid')
      this.setState({
        uid,
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  }
  // Delete messages from AsyncStorage and from the state
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }
  componentDidMount() {

    // this.getMessages();
    // Set either the name of a user if it's present or "Chat", in the navigation bar
    this.props.navigation.setOptions({ title: !this.state.name ? 'Chat' : this.state.name });
    //  checks the connections tatus
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ connection: true });
        // Authenticate users anonymously using Firebase.
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            try {
              await firebase.auth().signInAnonymously();
            } catch (error) {
              console.log(error);
            }
          };

          // update user state with curently active user data
          this.setState({
            uid: user.uid,
            // messages: [],
          });

          // store the uid in AsyncStorage
          await AsyncStorage.setItem('uid', user.uid);
          // listener for updates in the collection "messages"
          this.unsubscribe = this.referenceChatMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate);
        });

      } else {
        // if no internet connection updated the state accordingly and get the data from AsyncStorage
        this.setState({ connection: false });
        this.getMessages();
      }
    });
  }
  // Stop the listeners 
  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  // get data from database each time the database gets updated
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages,
    }, () => this.saveMessages()); // Update the AsyncStorage with the latest changes in firebase);
  }
  // add a document to Firestore
  addMessage(message) {
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user,
    })
  }
  // function that takes one parameter representing the message a user sends.Whatever the user sends will keep getting appended to the state "messages".
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),()=>{
      // Call the addMessage function with the message in the bubble as parameter
      this.addMessage(messages[0])
 // Save each sent message in AsyncStorage
 this.saveMessages();
})  
  }

  // )}
  //  altered Bubble component is returned from GiftedChat by inheriting props with the ...props keyword
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: 'blue'},
            left: {backgroundColor: '#000'}
          }}
      />
    )
  }

  // Don't display the message input if no internet connection
    renderInputToolbar = props => {
        if (this.state.connection === false) {
            // if no connection return nothing
        } else {
            return <InputToolbar {...props} />
        }
    }
  render() {
    // get the variables by destructuring the state object
    const { bgColor, messages, uid, name } = this.state;
    return (

      <View style={[styles.container, { backgroundColor: bgColor }]}>
        {/* <Text>{this.state.loggedInText}</Text> */}
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
         renderInputToolbar={this.renderInputToolbar}
          messages={messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: uid,
            name: name,
            avatar: 'https://placeimg.com/140/140/any'
          }}
        />
        {/* avoid keyboard hidding the message input on some android devices  */}
        {Platform.OS === 'android' ? (<KeyboardAvoidingView behavior="height" />) : null
        }
        <Button title="delete" onPress={() => this.deleteMessages()} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
Chat.propTypes = {
  name: PropTypes.string,
  bgColor: PropTypes.string
}