import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { RPH, RPW } from '../../../../modules/dimensions'

import ArticlesList from '../../../../components/ArticlesList';

export default function Press() {
  const {articleIndex} = useLocalSearchParams()

  const index = articleIndex ? articleIndex : "none"

  return (
    <View style={styles.container}>
      <ArticlesList category="press" index={index} />
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
