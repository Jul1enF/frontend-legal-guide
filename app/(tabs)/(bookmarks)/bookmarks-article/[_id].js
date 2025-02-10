import { StyleSheet, Text, View } from 'react-native';

import {RPH, RPW} from '../../../../modules/dimensions'
import { useSelector } from 'react-redux';

import FullArticle from '../../../../components/FullArticle';

import {useLocalSearchParams} from "expo-router"

export default function BookmarksArticle() {
    const {_id} = useLocalSearchParams()

    const articles = useSelector((state)=>state.articles.value)

    let thisCategoryNameSingular

    articles.map(e=>{
        if (e._id === _id){
            e.category === "press" ? thisCategoryNameSingular = "Presse" : thisCategoryNameSingular = "Conseil"
        }
    })

  return (
    <View style={styles.container}>
      <FullArticle category="bookmarks" categoryName="Favoris" categoryNameSingular={thisCategoryNameSingular} _id={_id}/>
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