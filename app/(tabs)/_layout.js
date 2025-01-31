import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../../components/Header";
import { RPH, RPW } from "../../modules/dimensions"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        keyboardHidesTabBar: true,

        tabBarIcon: ({ focused }) => {
          let iconName = '';
          let color = ""
          color = focused ? 'white' : "grey"

          if (route.name === '(tab1)') {
            iconName = 'square-outline';
          } else if (route.name === '(tab2)') {
            iconName = 'triangle-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={RPH(3.8)} color={color} />;
        },

        tabBarIconStyle: { width: "100%", height: RPH(4.8) },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'grey',
        tabBarLabelStyle: { fontSize: RPW(4.2), fontWeight: "500" },
        tabBarBackground: () => (
          <LinearGradient
            colors={["#0c0000", "#0c0000"]}
            locations={[0.15, 1]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ height: 150 }}
          ></LinearGradient>
        ),
        tabBarStyle: { height: RPH(9.5), paddingTop: RPH(0), width: RPW(100) },
        // Build / KeyboardAwareScrollView
        // tabBarHideOnKeyboard : Platform.OS === 'ios' ? true : false,
        // Expo Go / KeyboardAvoidingView
        tabBarHideOnKeyboard: Platform.OS === 'android' ? true : false,
        header: (props) => <Header {...props} />,
      })}
    >
      <Tabs.Screen name="(tab1)" options={{
        title: "Tab 1"
      }} />
      <Tabs.Screen name="(tab2)" options={{
        title: "Tab 2",
      }} />
      <Tabs.Screen name="(pages)" options={{
        tabBarItemStyle: { display: "none" },
      }} />
    </Tabs>
  )
}