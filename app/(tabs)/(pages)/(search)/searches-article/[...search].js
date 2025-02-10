import { StyleSheet, Text, View } from 'react-native';

import {RPH, RPW} from '../../../../../modules/dimensions'
import { useSelector } from 'react-redux';

import FullArticle from '../../../../../components/FullArticle';

import {useLocalSearchParams} from "expo-router"

export default function SearchesArticle() {
  const { search } = useLocalSearchParams()
  const _id = search[0]
  const searchedText = search[1]

    const articles = useSelector((state)=>state.articles.value)

    let thisCategoryNameSingular

    articles.map(e=>{
        if (e._id === _id){
            e.category === "press" ? thisCategoryNameSingular = "Presse" : thisCategoryNameSingular = "Conseil"
        }
    })

  return (
    <View style={styles.container}>
      <FullArticle category="searches" categoryName="Recherches" categoryNameSingular={thisCategoryNameSingular} _id={_id} searchedText={searchedText}/>
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