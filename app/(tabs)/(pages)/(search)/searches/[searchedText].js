import { StyleSheet, Text, View } from 'react-native';

import {RPH, RPW} from '../../../../../modules/dimensions'

import ArticlesList from '../../../../../components/ArticlesList';

import {useLocalSearchParams} from "expo-router"

export default function Searches() {
    const {searchedText} = useLocalSearchParams()

  return (
    <View style={styles.container}>
      <ArticlesList category="searches" searchedText={searchedText}/>
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