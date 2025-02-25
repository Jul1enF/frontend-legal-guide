import { StyleSheet, Text, View } from 'react-native';

import {RPH, RPW} from '../../modules/dimensions'

export default function Contact() {
  return (
    <View style={styles.body}>
      <Text>Contact !</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffcfc",
  },
});