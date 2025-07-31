import { Tabs } from "expo-router";
import { Platform, AppState } from "react-native";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import { RPH, RPW } from "../../modules/dimensions"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import { checkIfAppIsObsoleteAsync } from '../../modules/checkIfAppIsObsoleteAsync'


export default function TabsLayout() {

  // Check if the app should mandatory update when oppening it
    const [appObsolete, setAppObsolete] = useState(false)
  
    const updateAppVersionStatus = async () => {
      const isAppObsolete = await checkIfAppIsObsoleteAsync()
      setAppObsolete(isAppObsolete)
    }
  
    useEffect(() => {
      updateAppVersionStatus()
       
      const subscription = AppState.addEventListener("change", (state) => {
        if (state === "active") {
            updateAppVersionStatus()
        }
      });
  
      return () => {
        subscription.remove();
      };
    }, []);


  return (
    <Tabs
      screenOptions={({ route }) => ({
        keyboardHidesTabBar: true,

        tabBarIcon: ({ focused }) => {
          let color = ""
          color = focused ? 'white' : "grey"

          if (route.name === '(advices)') {
            // return <MaterialCommunityIcons name='folder-information-outline' size={RPH(3.2)} color={color} />
            return <FontAwesome name='info-circle' size={RPH(3.1)} color={color} />
          } else if (route.name === '(press)') {
            return <FontAwesome name='newspaper-o' size={RPH(2.9)} color={color} style={{paddingTop : RPH(0)}} />
          } else if (route.name === 'calendar') {
            return <AntDesign name='calendar' size={RPH(2.9)} color={color} style={{paddingTop : RPH(0)}} />
          } else if (route.name === 'contact') {
            return <Fontisto name='phone' size={RPH(2.5)} color={color} style={{paddingTop : RPH(0)}} />
          } else if (route.name === '(bookmarks)') {
            return <MaterialCommunityIcons name='heart' size={RPH(2.9)} color={color} style={{paddingTop : RPH(0)}} />
          }
        },

        tabBarIconStyle: { width: "100%", height: RPH(4) },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: { fontSize: RPW(4.3), fontWeight: "500",  fontFamily: "Barlow-Medium", letterSpacing : RPW(0.2)},
        tabBarStyle: { height: RPH(9.5), paddingTop: RPH(0), paddingRight : RPW(2.5), paddingLeft : RPW(2.5), width: RPW(100), backgroundColor : "#0c0000", borderTopWidth : 0},
        // Build / KeyboardAwareScrollView
        tabBarHideOnKeyboard : Platform.OS === 'ios' ? true : false,
        // Expo Go / KeyboardAvoidingView
        // tabBarHideOnKeyboard: Platform.OS === 'android' ? true : false,
        header: (props) => <Header {...props} appObsolete={appObsolete}/>,
      })}
    >
      <Tabs.Screen name="(advices)" options={{
        title: "Conseils"
      }} />
      <Tabs.Screen name="(press)" options={{
        title: "Presse",
      }} />
      <Tabs.Screen name="calendar" options={{
        title: "Agenda",
      }} />
      <Tabs.Screen name="contact" options={{
        title: "Contact",
      }} />
      <Tabs.Screen name="(bookmarks)" options={{
        title: "Favoris",
      }} />
      <Tabs.Screen name="(pages)" options={{
        tabBarItemStyle: { display: "none" },
      }} />
    </Tabs>
  )
}