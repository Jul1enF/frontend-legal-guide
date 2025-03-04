import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { RPH, RPW } from '../../modules/dimensions'




export default function Contact() {
  return (
    <>
      {/* <KeyboardAwareScrollView
        style={{ flex: 1, backgroundColor: "#f9fff4" }}
        contentContainerStyle={styles.contentContainer}
        scrollEnabled={scrollable}
        bottomOffset={Platform.OS === 'ios' ? RPH(7) : RPH(2)}
      > */}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.body} keyboardVerticalOffset={RPH(14)}  >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled">

          <Text style={styles.subTitle}>Contact</Text>
          <Text style={styles.title}>Toutes les infos sur le cabinet</Text>

          <View style={styles.line} >
          </View>

          <View style={styles.underlineContainer}>
            <Text style={styles.firmTitle}>
              Alexis Baudelin Avocat :
            </Text>
          </View>

          <View style={styles.row}>
            <MaterialIcons name="location-on" size={RPW(5)} style={styles.icon} />
            <Text style={styles.firmContact}>
              80 rue Réaumur 75002 Paris
            </Text>
          </View>

          <View style={styles.row}>
            <Entypo name="old-phone" size={RPW(5)} style={styles.icon} />
            <Text style={styles.firmContact}>
              01.80.49.11.38
            </Text>
          </View>

          <View style={[styles.row, { marginBottom: RPW(8) }]}>
            <MaterialCommunityIcons name="fax" size={RPW(5)} style={styles.icon} />
            <Text style={styles.firmContact}>
              01.42.74.72.26
            </Text>
          </View>

          <View style={styles.underlineContainer}>
            <Text style={styles.firmTitle}>
              Prendre rendez-vous :
            </Text>
          </View>


          <TouchableOpacity style={styles.appointmentBtn} activeOpacity={0.1} onPress={()=>router.push('https://consultation.avocat.fr/consultation-cabinet/forms.php?hashid=0ae6e87b0f07df83d925')}>
              <FontAwesome name="handshake-o" size={RPW(5)} style={styles.appointmentIcon} />
              <Text style={styles.appointmentText}>
                Consultation en cabinet de 60 min pour 150€
              </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.appointmentBtn} activeOpacity={0.1} onPress={()=>router.push('https://consultation.avocat.fr/consultation-video/forms.php?hashid=1d515dce1e5e08d5f288')}>
              <FontAwesome name="video-camera" size={RPW(5)} style={styles.appointmentIcon} />
              <Text style={styles.appointmentText}>
                Consultation vidéo de 30 min pour 90€
              </Text>
          </TouchableOpacity>


        </ScrollView>
      </KeyboardAvoidingView>

      {/* </KeyboardAwareScrollView> */}

    </>

  );
}


const styles = StyleSheet.create({
  body: {
    backgroundColor: "#fffcfc",
    flex: 1,
  },
  contentContainer: {
    alignItems: "flex-start",
    paddingBottom: RPH(2),
    paddingTop: RPH(2),
    paddingLeft: RPW(2),
    paddingRight: RPW(2),
  },
  subTitle: {
    color: "rgb(185, 0, 0)",
    fontSize: RPW(8),
    lineHeight: RPW(8),
    marginRight: RPW(3),
    fontFamily: "Barlow-Bold",
    letterSpacing: RPW(0.1),
    marginBottom: 20,
  },
  title: {
    color: "#0c0000",
    fontSize: RPW(7.3),
    lineHeight: RPW(7.5),
    marginBottom: 15,
    fontFamily: "Barlow-Bold",
    letterSpacing: RPW(-0.05),
  },
  line: {
    width: "30%",
    height: 3.5,
    marginBottom: RPW(10),
    marginLeft: RPW(1),
    borderRadius: 15,
    backgroundColor: "rgb(185, 0, 0)",
  },
  underlineContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#0c0000",
    paddingBottom: RPW(1.5),
    marginBottom: RPW(5)
  },
  firmTitle: {
    color: "#0c0000",
    fontSize: RPW(6),
    lineHeight: RPW(6),
    fontFamily: "Barlow-SemiBold",
    letterSpacing: RPW(-0.05),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: RPW(2),
  },
  firmContact: {
    color: "#0c0000",
    fontSize: RPW(5),
    lineHeight: RPW(5),
    fontFamily: "Barlow-Regular",
    letterSpacing: RPW(0),
  },
  icon: {
    marginRight: RPW(2),
    color: "rgb(155, 1, 1)",
  },
  appointmentBtn: {
    backgroundColor: "#0c0000",
    width: RPW(96),
    height: RPW(12),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RPW(3),
    marginBottom : RPW(4),
  },
  appointmentIcon : {
    color : "#fffcfc",
    marginRight : RPW(2)
  },
  appointmentText: {
    color: "#fffcfc",
    fontSize: RPW(5),
    lineHeight: RPW(5),
    fontFamily: "Barlow-Regular",
    letterSpacing: RPW(0.1),
  }
});