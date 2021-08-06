
import React from "react";
import { GiftedChat ,Bubble} from "react-native-gifted-chat";
import { View, Text,StyleSheet, Platform, KeyboardAvoidingView   } from 'react-native';
import PropTypes from 'prop-types';

// import AsyncStorage from '@react-native-community/async-storage';
// import NetInfo from '@react-native-community/netinfo';
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
       uid: '',
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
     // Define the listeners for authentication and firebase updates
    unsubscribeUser = function(){};
    authUnsubscribe = function(){};
  //  function that loads the messages from asyncStorage
//  async getMessages() {
//     let messages = '';
//     try{
//       messages = await AsyncStorage.getItem('messages') || [];
//       this.setState({
//         messages:JSON.parse(messages)
//       });
//     }catch(error){
//       console.log(error.message);
//     }
// }


// async saveMessages(){
//   try{
//     await AsyncStorage.setItem('messages',JSON.stringify(this.state.messages));
//   }catch(error){
//     console.log(error);
//   }
// }

// async deleteMessages(){
//   try{
//     await AsyncStorage.removeItem('messages');
//     this.setState({
//       messages:[]
//     })
//   }catch(error){
//     console.log(error.message);
//   }
// }
  componentDidMount() {
    // this.getMessages();
    // Set either the name of a user if it's present or "Chat", in the navigation bar
   this.props.navigation.setOptions({title: !this.state.name ? 'Chat' : this.state.name });
   // Authenticate users anonymously using Firebase.
   this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) =>{
     if(!user){
       await firebase.auth().signInAnonymously();
     }
      // update user state with curently active user data
     this.setState({
         uid:user.uid,
            messages: [],
     });
    
 
    	// listener for updates in the collection "messages"
     this.unsubscribe = this.referenceChatMessages.orderBy("createdAt","desc").onSnapshot(this.onCollectionUpdate);
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
                user: data.user,
               
        });
      });
      this.setState({
			messages,
		});
    }
    // add a document to Firestore
   addMessage(message){
   
     this.referenceChatMessages.add({
       _id:message._id,
       text:message.text,
       createdAt:message.createdAt,
       user:message.user,
     })
   }
   // function that takes one parameter representing the message a user sends.Whatever the user sends will keep getting appended to the state "messages".
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
     this.addMessage(messages[0])

    }
    
    // )}
  //  altered Bubble component is returned from GiftedChat by inheriting props with the ...props keyword
renderBubble(props) {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: 'blue'
        },
  
      }}
    />
  )
}
  render() {
     // get the variables by destructuring the state object
        const {bgColor, messages,uid,name} = this.state;
    return (
     
   <View style={[styles.container, {backgroundColor: bgColor}]}>
      {/* <Text>{this.state.loggedInText}</Text> */}
      <GiftedChat
         renderBubble={this.renderBubble.bind(this)}
        messages={messages}
        onSend={messages => this.onSend(messages)}
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