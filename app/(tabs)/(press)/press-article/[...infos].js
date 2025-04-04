import { StyleSheet, Text, View } from 'react-native';

import {RPH, RPW} from '../../../../modules/dimensions'

import FullArticle from '../../../../components/FullArticle';

import {useLocalSearchParams} from "expo-router"

export default function PressArticle() {
  const {infos} = useLocalSearchParams()
  const _id = infos[0]
  const index = infos[1]

  const articlesListIndex = index ? index : "none"

  return (
    <View style={styles.container}>
      <FullArticle category="press" categoryName="Articles" categoryNameSingular="Presse" _id={_id} articlesListIndex={articlesListIndex}/>
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