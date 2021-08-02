import React, {Component} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export default class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.route.params.name,
            bgColor: this.props.route.params.bgColor
        }
    }

    componentDidMount() {
        // Set either the name of a user if it's present or "Chat", in the navigation bar
        this.props.navigation.setOptions({title: !this.state.name ? 'Chat' : this.state.name })
    }

    render() {
        const {bgColor} = this.state;

        return (
           
            <View style={[styles.container, {backgroundColor: bgColor}]}>
                <Text>Chat Component</Text>
            </View>
        )
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
