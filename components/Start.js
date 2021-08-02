import React, {Component} from 'react';
import { View, Text, Button, StyleSheet, TextInput, ImageBackground, TouchableOpacity } from 'react-native';

export default class Start extends Component {
    constructor(props) {
      super(props);
        this.state = {
            name: '',
            bgColor: ''
        }
    }
    render() {
        return (
            <View style={styles.container1}>
                <ImageBackground source={require('../assets/Background-Image.png')} resizeMode="cover" style={styles.image}>

                    {/* Title of the app */}
                    <Text style={styles.helloWorld}>Hello World</Text>

                    {/* The wrapper of the TextInput, the section with the background color options and button */}
                    <View style={styles.container2}>
                        <TextInput 
                            style={styles.input}
                            onChangeText={(name) => this.setState({name})}
                            value={this.state.name}
                        />

                        {/* Wrapper of the background colors section */}
                        <View>
                            <Text>Choose background color:</Text>
                            
                            <View style={{flexDirection:'row', marginTop: 12}}>
                                {/* the "onPress" method is used to set the "bgColor" state to a string with the hex value of the color each option represents */}
                                <TouchableOpacity 
                                    style={[styles.pickBgColor, {backgroundColor: '#000'}]}
                                    onPress={() => this.setState({bgColor: '#000'})}
                                />
                                <TouchableOpacity 
                                    style={[styles.pickBgColor, {backgroundColor: '#064C75'}]} 
                                    onPress={() => this.setState({bgColor: '#064C75'})}
                                />
                                <TouchableOpacity 
                                    style={[styles.pickBgColor, {backgroundColor: '#0697B1'}]} 
                                    onPress={() => this.setState({bgColor: '#0697B1'})}
                                />
                                <TouchableOpacity 
                                    style={[styles.pickBgColor, {backgroundColor: '#469A6E'}]} 
                                    onPress={() => this.setState({bgColor: '#469A6E'})}
                                />
                            </View>
                        </View>
                        <TouchableOpacity 
                            style={styles.button}
                            title='Go to Chat'
                            // The second argument of the navigate() method is the way the additional props are passed to the Chat component
                            onPress={() => this.props.navigation.navigate('Chat', {name: this.state.name, bgColor: this.state.bgColor})}
                        >
                            <Text style={{color: '#fff', fontSize: 18}}>Start Chatting</Text> 
                        </TouchableOpacity>
                    </View>
                </ImageBackground>       
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container1: {
        flex: 1
    },
    container2: {
        flex: 0,
        height: '44%',
        minHeight: 240,
        width: '88%',
        backgroundColor: '#fff',
        justifyContent: 'space-evenly',
        paddingLeft: '6%',
        paddingRight: '6%'
    },
    image: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    helloWorld: {
        fontSize: 50,
        color: '#fff'
    },
    input: {
        height: 50,
        borderWidth: 2,
        borderColor: '#476380',
        padding: 8
    },
    button: {
       backgroundColor: '#476380',
       height: 52,
       flex: 0,
       justifyContent: 'center',
       alignItems: 'center'
    },
    pickBgColor: {
        width: 50,
        height: 50,
        marginRight: 14,
        borderRadius: 25
    }
});