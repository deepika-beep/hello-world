
import React from "react";
import { GiftedChat ,Bubble} from "react-native-gifted-chat";
import { View, Text,StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import PropTypes from 'prop-types';


import firebase from 'firebase';
import 'firebase/firestore';

// Firebase config
const firebaseConfig = {
     apiKey: "AIzaSyC1ksZMncmScjQyqVvQiYBOd8YRy3OwRjg",
    authDomain: "test-f9fd0.firebaseapp.com",
    projectId: "test-f9fd0",
    storageBucket: "test-f9fd0.appspot.com",
    messagingSenderId: "156604957819"
  }

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       messages: [],
       uid:0,
        user: {
        _id: '',
        name: '',
        avatar: '',
      },
     
       name: this.props.route.params.name,
       bgColor: this.props.route.params.bgColor
    }
    // Initialize the app
    if (!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
  }

    // Reference the "messages" collection of the db
  this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  componentDidMount() {
    
    // Set either the name of a user if it's present or "Chat", in the navigation bar
   this.props.navigation.setOptions({title: !this.state.name ? 'Chat' : this.state.name })
   // Authenticate users anonymously using Firebase.
   this.authUnsubscribe = firebase.auth().onAuthStateChanged(async(user)=>{
     if(!user){
       await firebase.auth().signInAnonymously();
     }
      // update user state with curently active user data
     this.setState({
         uid:user.uid,
        // loggedInText: 'Welcome',
        user:{
           _id: user.uid,
         name: name,
        avatar: 'https://placeimg.com/140/140/any',
     },
      messages: [],
    })
   
    	// listener for updates in the collection "messages"
     this.unsubscribe = this.referenceChatMessages.orderBy("createdAt","desc").onSnapShot(this.onCollectionUpdate);
     });
   }
    // Stop the listeners
   componentWillUnmount(){
     this.authUnsubscribe();
    this.unsubscribe();
   }

    // get data from database each time the database gets updated
    onCollectionUpdate = (querySnapshot)=>{
      const messages =[];
      querySnapshot.forEach((doc)=>{
        // get the QueryDocumentSnapshot's data
        let data =doc.data();
        messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user:{
                  _id: data.user._id,
                name: data.user.name,
                avatar: data.user.avatar,
                }
        })
      })
      this.setState({
			messages,
		});
    }
    // add a document to Firestore
   addMessage(){
     const message = this.state.messages[0];
     this.referenceChatMessages.add({
       _id:message._id,
        uid: this.state.uid,
       text:message.text,
       createdAt:message.createdAt,
       user:message.user,
     })
   }
   // function that takes one parameter representing the message a user sends.Whatever the user sends will keep getting appended to the state "messages".
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
    
()=>{
     // Call the addMessage function with the message in the bubble as parameter
        this.addMessage();
    }
    )}
  //  altered Bubble component is returned from GiftedChat by inheriting props with the ...props keyword
renderBubble(props) {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: 'blue'
        },
        left:{backgroundColor:'#000'}
      }}
    />
  )
}
  render() {
     // get the variables by destructuring the state object
        const {bgColor, messages,uid,name} = this.state;
    return (
     
   <View style={[styles.container, {backgroundColor: bgColor}]}>
      <Text>{this.state.loggedInText}</Text>
      <GiftedChat
         renderBubble={this.renderBubble.bind(this)}
        messages={messages}
        onSend={(messages) => this.onSend(messages)}
        user={{
          _id: uid,
          name:name,
          avatar: 'https://placeimg.com/140/140/any'
        }}
      />
      {/* avoid keyboard hidding the message input on some android devices  */}
      { Platform.OS === 'android' ? (<KeyboardAvoidingView behavior="height" />) : null
 }
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