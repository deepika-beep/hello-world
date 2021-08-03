
import React from "react";
import { GiftedChat ,Bubble} from "react-native-gifted-chat";
import { View, Text,StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import PropTypes from 'prop-types';
export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
       messages: [],
       name: this.props.route.params.name,
            bgColor: this.props.route.params.bgColor
    }
  }

  componentDidMount() {
    // Set either the name of a user if it's present or "Chat", in the navigation bar
   this.props.navigation.setOptions({title: !this.state.name ? 'Chat' : this.state.name })
    this.setState({
      messages: [
           // System message
        {
          _id: 2,
          text:'Welcome to App',
          createdAt: new Date(),
          system: true,
        },
        // Normal message
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        
      ],
    });
  }

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }
  //  altered Bubble component is returned from GiftedChat by inheriting props with the ...props keyword
renderBubble(props) {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: 'blue'
        }
      }}
    />
  )
}
  render() {
     // get the variables by destructuring the state object
        const {bgColor, messages} = this.state;
    return (
     
   <View style={[styles.container, {backgroundColor: bgColor}]}>
      <GiftedChat
         renderBubble={this.renderBubble.bind(this)}
        messages={messages}
        onSend={(messages) => this.onSend(messages)}
        user={{
          _id: 1,
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