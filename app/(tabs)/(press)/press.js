import { StyleSheet, Text, View } from 'react-native';

import {RPH, RPW} from '../../../modules/dimensions'

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Tab 2 !</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
