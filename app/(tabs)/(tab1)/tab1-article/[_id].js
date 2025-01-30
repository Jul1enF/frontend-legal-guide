import { StyleSheet, Text, View } from 'react-native';

import {RPH, RPW} from '../../../../modules/dimensions'

import FullArticle from '../../../../components/FullArticle';

import {useLocalSearchParams} from "expo-router"

export default function App() {
    const {_id} = useLocalSearchParams()

  return (
    <View style={styles.container}>
      <FullArticle category="tab1" categoryName="Tab 1" categoryNameSingular="Tab 1" _id={_id}/>
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