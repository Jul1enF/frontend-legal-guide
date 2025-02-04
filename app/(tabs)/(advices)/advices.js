import { StyleSheet, Text, View } from 'react-native';

import {RPH, RPW} from '../../../modules/dimensions'

import ArticlesList from '../../../components/ArticlesList';

export default function App() {
  return (
    <View style={styles.container}>
      <ArticlesList category="advices" />
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
