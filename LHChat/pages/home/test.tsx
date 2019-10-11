import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

interface Props {
  name: string;
  count?: number;
  onInc?: () => void;
  onDec?: () => void;
}

export default class test extends Comment{
    name = '';
    count = 0;

    constructor(){
        super();
    }

    onInc =  ()=>{

    };

    onDec = ()=>{

    }

    render(){
        return (
          <View style={styles.root}>
            <Text>
              Counter {this.name}: {this.count}
            </Text>
            <View>
              <Button title="+" onPress={this.onInc || (() => {})} />
              <Button title="-" onPress={this.onDec || (() => {})} />
            </View>
          </View>
        );
    }
}

// styles
const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttons: {
    flexDirection: 'row',
    minHeight: 70,
    alignItems: 'stretch',
    alignSelf: 'center',
    borderWidth: 5,
  },
  button: {
    flex: 1,
    paddingVertical: 0,
  },
  greeting: {
    color: '#999',
    fontWeight: 'bold',
  },
});