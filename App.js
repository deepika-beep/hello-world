import React ,{Component} from 'react';
import {View} from 'react-native';
import Start from './components/Start';
import Chat from './components/Chat';
import 'react-native-gesture-handler';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


// Create the navigator
const Stack = createStackNavigator();

// Ignore error and warning alerts inside the app (show only in the console).
LogBox.ignoreAllLogs();

export default class helloWorld extends Component{
  constructor(props){
    super(props);
  }
render(){
  return(
    //  Wrapped everything in Navigation Container and implemented the Stack Navigator. 
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Start'>
        <Stack.Screen name='Start' component={Start} />
        <Stack.Screen name='Chat' component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
}