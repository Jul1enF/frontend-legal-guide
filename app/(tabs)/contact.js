import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, TouchableOpacity, Platform, TextInput, Modal, Keyboard } from 'react-native';
import { router, Link } from 'expo-router';
import { useState, useRef, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

import { AppleMaps, GoogleMaps } from 'expo-maps';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';

import { RPH, RPW } from '../../modules/dimensions'
import { KeyboardAwareScrollView, KeyboardToolbar } from "react-native-keyboard-controller";



export default function Contact() {

  const [names, setNames] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const [error, setError] = useState("")

  const [modalVisible, setModalVisible] = useState(false)

  const url = process.env.EXPO_PUBLIC_BACK_ADDRESS


  // Fonction déclenchée au premier click sur envoyer la requête

  const firstSendPress = () => {
    Keyboard.dismiss()

    const regexMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    const regexSpace = / /

    if (!names || !email || !subject || !message) {
      setError("Merci de remplir tous les champs obligatoires ci dessus !")
    }
    else if (!regexMail.test(email)) {
      setError("Adresse mail non valide !")
    } else if (!regexSpace.test(names)) {
      setError("Merci de renseigner votre nom et prénom !")
    } else {
      setModalVisible(true)
    }
  }





  // Fonction déclenchée en cliquant définitivement sur envoyer la requête

  const sendRef = useRef(true)

  const finalSendPress = async () => {
    // Désactivation du bouton en cas de temps d'attente pour éviter double click
    if (!sendRef.current) { return }
    sendRef.current = false

    let data
    try {
      const response = await fetch(`${url}/contact/sendMessage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          names,
          email,
          phone,
          subject,
          message,
        })
      })
      data = await response.json()
    } catch (err) {
      setModalVisible(false)
      setError("Erreur : Problème de connexion")
      setTimeout(() => setError(""), 4000)
      sendRef.current = true
      return
    }

    console.log("DATA", data)

    if (!data.result) {
      setModalVisible(false)
      setError("Erreur : Merci de réessayer plus tard ou après avoir quitté l'app")
      setTimeout(() => setError(""), 4000)
      sendRef.current = true
    } else {
      setModalVisible(false)
      setError("Message envoyé !")
      setTimeout(() => setError(""), 4000)
      setNames("")
      setEmail("")
      setPhone("")
      setSubject("")
      setMessage("")
      sendRef.current = true
    }
  }




  // Affichage conditionnel de la map en fonction de ios ou android

  const marker = { coordinates: { latitude: 48.866550, longitude: 2.351357 }, title: "Alexis Baudelin Avocat\n80 rue Réaumur\n75002 Paris", tintColor: "black" }

  let map = ""

  const setExpoMap = () => {
    if (Platform.OS === 'ios') {
      map = <AppleMaps.View style={styles.map} cameraPosition={{ coordinates: { latitude: 48.866550, longitude: 2.351357 }, zoom: 15.5 }} markers={[marker]} uiSettings={{ myLocationButtonEnabled: false }} />;
    } else if (Platform.OS === 'android') {
      map = <GoogleMaps.View style={styles.map} cameraPosition={{ coordinates: { latitude: 48.866550, longitude: 2.351357 }, zoom: 15.5 }} markers={[marker]} uiSettings={{ myLocationButtonEnabled: false }} />;
    }
  }


  useFocusEffect(useCallback(() => {
    setExpoMap()
}, []))




  if (Platform.OS === "ios") {
    return (
      <>
        <KeyboardAwareScrollView
          style={{ flex: 1, backgroundColor: "#fffcfc", }}
          contentContainerStyle={styles.contentContainer}
          bottomOffset={Platform.OS === 'ios' ? RPW(16) : RPW(8)}
        >

          {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.body} keyboardVerticalOffset={RPH(14)}  >
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"> */}

          <Text style={styles.subTitle}>Contact</Text>
          <Text style={styles.title}>Infomations, rendez-vous et formulaire de contact</Text>

          <View style={styles.line} >
          </View>



          <View style={styles.underlineContainer}>
            <Text style={styles.sectionTitle}>
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

          <View style={[styles.row, map ? { marginBottom: RPW(4) } : { marginBottom: RPW(10) }]}>
            <MaterialCommunityIcons name="fax" size={RPW(5)} style={styles.icon} />
            <Text style={styles.firmContact}>
              01.42.74.72.26
            </Text>
          </View>

          {map}



          <View style={[styles.underlineContainer]}>
            <Text style={styles.sectionTitle}>
              Prendre rendez-vous :
            </Text>
          </View>


          <TouchableOpacity style={styles.appointmentBtn} activeOpacity={0.1} onPress={() => router.push('https://consultation.avocat.fr/consultation-cabinet/forms.php?source=profile&targetid=47510')}>
            <FontAwesome name="handshake-o" size={RPW(5)} style={styles.appointmentIcon} />
            <Text style={styles.appointmentText}>
              Consultation en cabinet de 60 min pour 150€
            </Text>
            <Entypo name="arrow-with-circle-right" size={RPW(5)} style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.appointmentBtn} activeOpacity={0.1} onPress={() => router.push('https://consultation.avocat.fr/consultation-video/forms.php?source=profile&targetid=47510')}>
            <FontAwesome name="video-camera" size={RPW(5)} style={styles.appointmentIcon} />
            <Text style={styles.appointmentText}>
              Consultation vidéo de 30 min pour 90€
            </Text>
            <Entypo name="arrow-with-circle-right" size={RPW(5)} style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.appointmentBtn} activeOpacity={0.1} onPress={() => router.push('https://consultation.avocat.fr/consultation-telephonique/forms.php?source=profile&targetid=47510')}>
            <MaterialIcons name="phone-iphone" size={RPW(6)} style={styles.appointmentIcon} />
            <Text style={styles.appointmentText}>
              Consultation téléphonique de 30 min pour 70€
            </Text>
            <Entypo name="arrow-with-circle-right" size={RPW(5)} style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.appointmentBtn} activeOpacity={0.1} onPress={() => router.push('https://consultation.avocat.fr/question-simple/forms.php?source=profile&targetid=47510')}>
            <MaterialCommunityIcons name="chat" size={RPW(5)} style={styles.appointmentIcon} />
            <Text style={styles.appointmentText}>
              Réponse à une question simple pour 50€
            </Text>
            <Entypo name="arrow-with-circle-right" size={RPW(5)} style={styles.arrowIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.appointmentBtn, { marginBottom: RPW(10) }]} activeOpacity={0.1} onPress={() => router.push('https://consultation.avocat.fr/consultation-juridique/forms.php?source=profile&targetid=47510')}>
            <AntDesign name="form" size={RPW(5)} style={styles.appointmentIcon} />
            <Text style={styles.appointmentText}>
              Consultation écrite détaillée pour 250€
            </Text>
            <Entypo name="arrow-with-circle-right" size={RPW(5)} style={styles.arrowIcon} />
          </TouchableOpacity>



          <View style={styles.underlineContainer}>
            <Text style={styles.sectionTitle}>
              Formulaire de contact :
            </Text>
          </View>

          <Text style={styles.inputTitle}>
            Votre nom et prénom
          </Text>
          <TextInput style={styles.input}
            onChangeText={(e) => {
              setNames(e)
              setError('')
            }}
            value={names}
            placeholder='Nom et prénom...'
            placeholderTextColor="#fbfff790">
          </TextInput>

          <Text style={styles.inputTitle}>
            Votre email
          </Text>
          <TextInput style={styles.input}
            onChangeText={(e) => {
              setEmail(e)
              setError('')
            }}
            value={email}
            placeholder='Email...'
            placeholderTextColor="#fbfff790"
            keyboardType='email-address'
            autoCapitalize='none'>
          </TextInput>

          <Text style={styles.inputTitle}>
            Votre numéro de téléphone
          </Text>
          <TextInput style={styles.input}
            onChangeText={(e) => {
              setPhone(e)
              setError('')
            }}
            value={phone}
            placeholder='Téléphone... (Facultatif)'
            placeholderTextColor="#fbfff790"
            autoCapitalize='none'>
          </TextInput>

          <Text style={styles.inputTitle}>
            Sujet
          </Text>
          <TextInput style={styles.input}
            onChangeText={(e) => {
              setSubject(e)
              setError('')
            }}
            value={subject}
            placeholder='Sujet...'
            placeholderTextColor="#fbfff790">
          </TextInput>

          <Text style={styles.inputTitle}>
            Votre message
          </Text>
          <TextInput multiline={true}
            textAlignVertical="top"
            style={styles.largeInput}
            placeholder="Message..."
            onChangeText={(e) => {
              setError('')
              setMessage(e)
            }}
            value={message}
            placeholderTextColor="#fbfff792"
            returnKeyType='next'>
          </TextInput>

          <TouchableOpacity style={styles.sendBtn} onPress={() => firstSendPress()}>
            <Text style={[styles.error, error === "Message envoyé !" && { color: "green" }]}>
              {error}
            </Text>
            <Text style={styles.btnText}>
              Envoyer
            </Text>
          </TouchableOpacity>



          <Link href="/legal" style={styles.cgu}>C.G.U</Link>



          <Modal
            visible={modalVisible}
            animationType="slide"
            style={styles.modal}
            transparent={true}
            onRequestClose={() => setModalVisible(!modalVisible)}
          >
            <View style={styles.modalBody}>
              <Text style={styles.modalText}>Êtes vous sûr de vouloir envoyer votre demande ?</Text>
              <View style={styles.line2}>
              </View>
              <View style={styles.btnContainer4}>
                <TouchableOpacity style={styles.modalBtn} activeOpacity={0.8} onPress={() => setModalVisible(false)}>
                  <Text style={styles.btnText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalBtn} activeOpacity={0.8} onPress={() => finalSendPress()}>
                  <Text style={styles.btnText}>Envoyer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>


          {/* </ScrollView>
      </KeyboardAvoidingView> */}

        </KeyboardAwareScrollView>
        {Platform.OS === "ios" && <KeyboardToolbar doneText="Fermer" />}

      </>

    );
  }else {
    return (
      <>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.body} keyboardVerticalOffset={RPH(14)}  >
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled">
  
            <Text style={styles.subTitle}>Contact</Text>
            <Text style={styles.title}>Infomations, rendez-vous et formulaire de contact</Text>
  
            <View style={styles.line} >
            </View>
  
  
  
            <View style={styles.underlineContainer}>
              <Text style={styles.sectionTitle}>
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
  
            <View style={[styles.row, map ? { marginBottom: RPW(4) } : {marginBottom : RPW(10)}]}>
              <MaterialCommunityIcons name="fax" size={RPW(5)} style={styles.icon} />
              <Text style={styles.firmContact}>
                01.42.74.72.26
              </Text>
            </View>
            
            {map}
  
  
  
            <View style={[styles.underlineContainer]}>
              <Text style={styles.sectionTitle}>
                Prendre rendez-vous :
              </Text>
            </View>
  
  
            <TouchableOpacity style={styles.appointmentBtn} activeOpacity={0.1} onPress={() => router.push('https://consultation.avocat.fr/consultation-cabinet/forms.php?source=profile&targetid=47510')}>
              <FontAwesome name="handshake-o" size={RPW(5)} style={styles.appointmentIcon} />
              <Text style={styles.appointmentText}>
                Consultation en cabinet de 60 min pour 150€
              </Text>
              <Entypo name="arrow-with-circle-right" size={RPW(5)} style={styles.arrowIcon} />
            </TouchableOpacity>
  
            <TouchableOpacity style={styles.appointmentBtn} activeOpacity={0.1} onPress={() => router.push('https://consultation.avocat.fr/consultation-video/forms.php?source=profile&targetid=47510')}>
              <FontAwesome name="video-camera" size={RPW(5)} style={styles.appointmentIcon} />
              <Text style={styles.appointmentText}>
                Consultation vidéo de 30 min pour 90€
              </Text>
              <Entypo name="arrow-with-circle-right" size={RPW(5)} style={styles.arrowIcon} />
            </TouchableOpacity>
  
            <TouchableOpacity style={styles.appointmentBtn} activeOpacity={0.1} onPress={() => router.push('https://consultation.avocat.fr/consultation-telephonique/forms.php?source=profile&targetid=47510')}>
              <MaterialIcons name="phone-iphone" size={RPW(6)} style={styles.appointmentIcon} />
              <Text style={styles.appointmentText}>
                Consultation téléphonique de 30 min pour 70€
              </Text>
              <Entypo name="arrow-with-circle-right" size={RPW(5)} style={styles.arrowIcon} />
            </TouchableOpacity>
  
            <TouchableOpacity style={styles.appointmentBtn} activeOpacity={0.1} onPress={() => router.push('https://consultation.avocat.fr/question-simple/forms.php?source=profile&targetid=47510')}>
              <MaterialCommunityIcons name="chat" size={RPW(5)} style={styles.appointmentIcon} />
              <Text style={styles.appointmentText}>
                Réponse à une question simple pour 50€
              </Text>
              <Entypo name="arrow-with-circle-right" size={RPW(5)} style={styles.arrowIcon} />
            </TouchableOpacity>
  
            <TouchableOpacity style={[styles.appointmentBtn, { marginBottom: RPW(10) }]} activeOpacity={0.1} onPress={() => router.push('https://consultation.avocat.fr/consultation-juridique/forms.php?source=profile&targetid=47510')}>
              <AntDesign name="form" size={RPW(5)} style={styles.appointmentIcon} />
              <Text style={styles.appointmentText}>
                Consultation écrite détaillée pour 250€
              </Text>
              <Entypo name="arrow-with-circle-right" size={RPW(5)} style={styles.arrowIcon} />
            </TouchableOpacity>
  
  
  
            <View style={styles.underlineContainer}>
              <Text style={styles.sectionTitle}>
                Formulaire de contact :
              </Text>
            </View>
  
            <Text style={styles.inputTitle}>
              Votre nom et prénom
            </Text>
            <TextInput style={styles.input}
              onChangeText={(e) => {
                setNames(e)
                setError('')
              }}
              value={names}
              placeholder='Nom et prénom...'
              placeholderTextColor="#fbfff790">
            </TextInput>
  
            <Text style={styles.inputTitle}>
              Votre email
            </Text>
            <TextInput style={styles.input}
              onChangeText={(e) => {
                setEmail(e)
                setError('')
              }}
              value={email}
              placeholder='Email...'
              placeholderTextColor="#fbfff790"
              keyboardType='email-address'
              autoCapitalize='none'>
            </TextInput>
  
            <Text style={styles.inputTitle}>
              Votre numéro de téléphone
            </Text>
            <TextInput style={styles.input}
              onChangeText={(e) => {
                setPhone(e)
                setError('')
              }}
              value={phone}
              placeholder='Téléphone... (Facultatif)'
              placeholderTextColor="#fbfff790"
              autoCapitalize='none'>
            </TextInput>
  
            <Text style={styles.inputTitle}>
              Sujet
            </Text>
            <TextInput style={styles.input}
              onChangeText={(e) => {
                setSubject(e)
                setError('')
              }}
              value={subject}
              placeholder='Sujet...'
              placeholderTextColor="#fbfff790">
            </TextInput>
  
            <Text style={styles.inputTitle}>
              Votre message
            </Text>
            <TextInput multiline={true}
              textAlignVertical="top"
              style={styles.largeInput}
              placeholder="Message..."
              onChangeText={(e) => {
                setError('')
                setMessage(e)
              }}
              value={message}
              placeholderTextColor="#fbfff792"
              returnKeyType='next'>
            </TextInput>
  
            <TouchableOpacity style={styles.sendBtn} onPress={() => firstSendPress()}>
              <Text style={[styles.error, error === "Message envoyé !" && { color: "green" }]}>
                {error}
              </Text>
              <Text style={styles.btnText}>
                Envoyer
              </Text>
            </TouchableOpacity>
  
  
  
            <Link href="/legal" style={styles.cgu}>C.G.U</Link>
  
  
  
            <Modal
              visible={modalVisible}
              animationType="slide"
              style={styles.modal}
              transparent={true}
              onRequestClose={() => setModalVisible(!modalVisible)}
            >
              <View style={styles.modalBody}>
                <Text style={styles.modalText}>Êtes vous sûr de vouloir envoyer votre demande ?</Text>
                <View style={styles.line2}>
                </View>
                <View style={styles.btnContainer4}>
                  <TouchableOpacity style={styles.modalBtn} activeOpacity={0.8} onPress={() => setModalVisible(false)}>
                    <Text style={styles.btnText}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalBtn} activeOpacity={0.8} onPress={() => finalSendPress()}>
                    <Text style={styles.btnText}>Envoyer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
  
  
          </ScrollView>
        </KeyboardAvoidingView>

  
      </>
  
    )
  }
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
    borderBottomWidth: 2,
    borderBottomColor: "#0c0000",
    paddingBottom: RPW(1),
    marginBottom: RPW(8)
  },
  sectionTitle: {
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
    fontFamily: "Barlow-Medium",
    letterSpacing: RPW(0),
  },
  icon: {
    marginRight: RPW(2.5),
    color: "rgb(155, 1, 1)",
  },
  map: {
    width: RPW(60),
    height: RPW(55),
    marginBottom: RPW(8)
  },
  appointmentBtn: {
    backgroundColor: "#0c0000",
    width: RPW(96),
    height: RPW(12),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: RPW(2),
    paddingRight: RPW(2),
    borderRadius: RPW(3),
    marginBottom: RPW(5),
  },
  appointmentIcon: {
    color: "#fffcfc",
  },
  appointmentText: {
    color: "#fffcfc",
    fontSize: RPW(4.5),
    lineHeight: RPW(5),
    fontFamily: "Barlow-SemiBold",
    letterSpacing: 0.3,
  },
  arrowIcon: {
    color: "#fffcfc",
  },
  inputTitle: {
    fontFamily: "Barlow-SemiBold",
    color: "#0c0000",
    fontSize: RPW(5.5),
    marginBottom: RPW(2),
  },
  input: {
    width: RPW(96),
    height: RPW(10),
    color: "#fffcfc",
    fontSize: RPW(4.5),
    backgroundColor: "rgb(157, 0, 0)",
    borderRadius: RPW(3),
    paddingLeft: RPW(2),
    marginBottom: RPW(4)
  },
  largeInput: {
    width: RPW(96),
    height: RPW(30),
    color: "#fffcfc",
    fontSize: RPW(4.5),
    backgroundColor: "rgb(157, 0, 0)",
    borderRadius: RPW(3),
    paddingLeft: RPW(2),
    marginBottom: RPW(12)
  },
  error: {
    fontSize: RPW(4.2),
    fontWeight: "700",
    color: "red",
    position: "absolute",
    left: 0,
    top: -RPW(11)
  },
  sendBtn: {
    backgroundColor: "#0c0000",
    height: RPW(10),
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: RPW(8),
    paddingRight: RPW(8),
    borderRadius: RPW(2),
    marginBottom: RPW(5),
  },
  btnText: {
    color: "#fffcfc",
    fontWeight: "600",
    fontSize: RPW(4.5),
    lineHeight: RPW(5),
  },
  cgu: {
    fontSize: RPW(4),
    fontWeight: "500",
    textDecorationLine: "underline"
  },
  modal: {
    alignItems: "center"
  },
  modalBody: {
    height: RPW(65),
    width: RPW(96),
    borderRadius: RPW(3),
    paddingTop: RPW(10),
    paddingBottom: RPW(10),
    paddingLeft: RPW(2),
    paddingRight: RPW(2),
    backgroundColor: "#dfdfdf",
    position: "absolute",
    bottom: RPH(13),
    left: RPW(2),
    justifyContent: "space-between",
    alignItems: "center"
  },
  modalText: {
    color: "#0c0000",
    fontSize: RPW(5.5),
    lineHeight: RPW(9),
    fontWeight: "600",
    textAlign: "center",
    paddingLeft: RPW(5),
    paddingRight: RPW(5),
  },
  line2: {
    width: "90%",
    height: 4,
    backgroundColor: "rgb(157, 0, 0)",
  },
  btnContainer4: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%"
  },
  modalBtn: {
    backgroundColor: "#0c0000",
    height: RPW(10),
    width: RPW(30),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RPW(2),
  },
});