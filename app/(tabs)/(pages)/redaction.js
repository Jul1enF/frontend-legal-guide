import { View, Text, StyleSheet, Dimensions, TextInput, KeyboardAvoidingView, TouchableOpacity, Image, Platform, ScrollView, PanResponder, Modal } from "react-native";
import { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { addTestArticle, deleteTestArticle } from "../../../reducers/testArticle";
import { addOneArticle, modifyArticle, deleteHomeContent } from "../../../reducers/articles";
import { router, useFocusEffect } from 'expo-router'
import { RPH, RPW } from "../../../modules/dimensions"
import Slider from '@react-native-community/slider'

import requires from "../../../modules/imageRequires";

import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'

import JWT, { SupportedAlgorithms } from 'expo-jwt';
const jwtKey = process.env.EXPO_PUBLIC_JWT_KEY


import { KeyboardAwareScrollView, KeyboardToolbar } from "react-native-keyboard-controller";




export default function Redaction() {

    const dispatch = useDispatch()
    const testArticle = useSelector((state) => state.testArticle.value)
    const user = useSelector((state) => state.user.value)

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS

    const [modalVisible, setModalVisible] = useState(false)
    const [modal2Visible, setModal2Visible] = useState(false)
    const [uploading, setUploading] = useState('')


    // États pour les inputs des attributs de l'article

    const [title, setTitle] = useState('')
    const [subCategory, setSubCategory] = useState('')
    const [text1, setText1] = useState('')
    const [text2, setText2] = useState('')
    const [author, setAuthor] = useState('')
    const [videoLink, setVideoLink] = useState('')
    const [category, setCategory] = useState('')

    // Lien image herbergée sur internet
    const [pictureUri, setPictureUri] = useState("")

    // Lien d'une image sur le portable de l'utilisateur et infos pour enregistrement firebase
    const [pictureUri2, setPictureUri2] = useState("")
    const [pictureMimeType, setPictureMimeType] = useState('')
    const [pictureExtension, setPictureExtension] = useState('')


    const [tags, setTags] = useState("")
    const [mediaLink, setMediaLink] = useState("")

    // États pour le racadrage de l'image
    const [imgMarginTop, setImgMarginTop] = useState(0)
    const [imgMarginLeft, setImgMarginLeft] = useState(0)
    const [imgZoom, setImgZoom] = useState(1)
    const [imgRatio, setImgRatio] = useState(1)



    // useRef pour valeurs de départs de la marge de l'image et de son agrandissement

    const imgMarginTopRef = useRef(0)
    const imgMarginLeftRef = useRef(0)
    const fingerDistanceRef = useRef(0)
    const imgZoomRef = useRef(1)
    const finalImgZoomRef = useRef(1)


    // États / ref pour l'erreur, pouvoir recadrer, et arrêter défilement scrollview en cliquant sur la view de l'image pour la régler

    const [error, setError] = useState('')
    const resizingRef = useRef(false)
    const [resizing, setResizing] = useState(false)
    const [scrollable, setScrollable] = useState(true)






    // useFocusEffect pour ne pas avoir resizing true en revenant sur la page

    useFocusEffect(useCallback(() => {
        resizingRef.current = false
        setResizing(false)
    }, []))





    // useEffect pour charger dans les états un article test

    useEffect(() => {
        if (testArticle.length > 0) {
            setTitle(testArticle[0].title)
            testArticle[0].sub_category && setSubCategory(testArticle[0].sub_category)
            testArticle[0].text1 && setText1(testArticle[0].text1)
            testArticle[0].text2 && setText2(testArticle[0].text2)
            testArticle[0].tags && setTags(testArticle[0].tags.join(', '))
            testArticle[0].media_link && setMediaLink(testArticle[0].media_link)
            testArticle[0].video_id && setVideoLink(`https://youtu.be/${testArticle[0].video_id}`)
            setCategory(testArticle[0].category)

            // Si c'est une image du portable (pas dans l'app et pas avec une url internet) => pictureUri2
            if (requires[testArticle[0].img_link] === undefined && !testArticle[0].img_link.includes('https')) {
                setPictureUri2(testArticle[0].img_link)
            } else {
                setPictureUri(testArticle[0].img_link)
            }

            testArticle[0].pictureExtension && setPictureExtension(testArticle[0].pictureExtension)
            testArticle[0].pictureMimeType && setPictureMimeType(testArticle[0].pictureMimeType)

            testArticle[0].author && setAuthor(testArticle[0].author)
            setImgMarginTop(testArticle[0].img_margin_top)
            setImgMarginLeft(testArticle[0].img_margin_left)
            setImgZoom(testArticle[0].img_zoom)
            setImgRatio(testArticle[0].img_ratio)
        }
    }, [testArticle])




    // Fonction appelée en cliquant sur Annuler recadrage pour reseter les états et refs

    const cancelResizingPress = () => {
        resizingRef.current = false
        setResizing(false)
        imgMarginTopRef.current = 0
        imgMarginLeftRef.current = 0
        fingerDistanceRef.current = 0
        imgZoomRef.current = 1
        finalImgZoomRef.current = 1
        setImgMarginTop(0)
        setImgMarginLeft(0)
        setImgZoom(1)
    }







    // PanResponder pour ajuster l'image

    const panResponder = useRef(
        PanResponder.create({
            // Engreistrement des pans que si resizing == true
            onMoveShouldSetPanResponder: () => resizingRef.current,
            onPanResponderGrant: (event, gesture) => {
                // Arrêt du scroll de ScrollView
                setScrollable(false)

                // Deux doigts sont utilisés
                if (event.nativeEvent.touches.length > 1) {
                    // Référence écartement des doigts pour le zoom
                    const [touch1, touch2] = event.nativeEvent.touches
                    fingerDistanceRef.current = Math.sqrt(
                        Math.pow(touch2.pageX - touch1.pageX, 2) +
                        Math.pow(touch2.pageY - touch1.pageY, 2)
                    )
                    // Nouvelle référence pour calcul du zoom (Pas possible de faire autrement qu'en utilisant une 2ème ref : Impossible d'accéder ici à la valeur d'un état et impossible d'accéder aux valeurs de calcul dans onRelease)
                    imgZoomRef.current = finalImgZoomRef.current
                }
            },
            onPanResponderMove: (event, gesture) => {
                // Deux doigts sont utilisés (zoom)
                if (event.nativeEvent.touches.length > 1) {
                    const [touch1, touch2] = event.nativeEvent.touches
                    const distance = Math.sqrt(
                        Math.pow(touch2.pageX - touch1.pageX, 2) +
                        Math.pow(touch2.pageY - touch1.pageY, 2)
                    )

                    setImgZoom(imgZoomRef.current - (1 - (distance / fingerDistanceRef.current)))

                    finalImgZoomRef.current = imgZoomRef.current - (1 - (distance / fingerDistanceRef.current))
                    return
                }
                // Un seul doigt est utilisé (recadrage)
                setImgMarginTop(imgMarginTopRef.current + gesture.dy)
                setImgMarginLeft(imgMarginLeftRef.current + gesture.dx / 2)
            },
            onPanResponderRelease: (event, gesture) => {
                // Reprise du scroll de ScrollView
                setScrollable(true)

                // Actualisation des refs de marge grâce aux données
                imgMarginTopRef.current += gesture.dy
                imgMarginLeftRef.current += gesture.dx / 2
            },
        }),
    ).current;



    // Récupération de l'id de la vidéo Youtube grâce au lien

    let video_id = ""

    if (videoLink) {
        if (videoLink.includes("youtu.be/")) {
            video_id = videoLink.slice(17, 28)
        } else if (videoLink !== "") {
            video_id = videoLink.slice(30, 41)
        }
    }




    // Fonction appelée en cliquant sur Choisir une image du portable

    const getPhonePicture = async (compressed) => {
        setPictureUri("")

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: false,
            allowsMultipleSelection: false,
            quality: 1,
        });

        if (!result.canceled) {
            const { uri } = result.assets[0]

            setPictureMimeType(result.assets[0].mimeType)

            const name = result.assets[0].fileName
            const nameDisassembled = name.split(".")
            const extension = nameDisassembled[nameDisassembled.length - 1]

            setPictureExtension(extension)

            const image = ImageManipulator.ImageManipulator.manipulate(uri)

            const transformedImage = compressed ? image.resize({
                width: result.assets[0].width / 3.5,
                height: result.assets[0].height / 3.5
            }) : image

            const imageRef = await transformedImage.renderAsync();
            const imageSaved = compressed ? await imageRef.saveAsync({ base64: false, compress: 0.5, format: extension }) : await imageRef.saveAsync({ base64: false, compress: 0.8, format: "jpeg" })

            // Quand on ne change pas la taille mais seulement la qualité, on le fait en passant en jpg car le png ne peut pas. Réglage des états.

            if (!compressed) {
                setPictureMimeType("image/jpeg")
                setPictureExtension("jpg")
            }

            setPictureUri2(imageSaved.uri);
            setModalVisible(false)
        } else {
            setModalVisible(false)
        }
    }




    // Fonction appelée en cliquant sur Tester

    const testPress = () => {
        if (!title || !category) {
            setError('Erreur : titre et catégorie obligatoires.')
            setTimeout(() => setError(''), 4000)
            return
        }

        if (!pictureUri && !pictureUri2) {
            setError('Erreur : image obligatoire.')
            setTimeout(() => setError(''), 4000)
            setModal2Visible(false)
            return
        }

        const date = testArticle.length > 0 ? testArticle[0].createdAt : new Date()
        const _id = testArticle.length > 0 ? testArticle[0]._id : "testArticleId"

        const tagsArray = tags.split(', ')

        let index = ""

        if (testArticle.length > 0 && testArticle[0].index) {
            index = testArticle[0].index
        }

        dispatch(addTestArticle({
            title,
            sub_category: subCategory,
            text1,
            text2,
            video_id,
            category,
            img_link: pictureUri ? pictureUri : pictureUri2,
            pictureMimeType,
            pictureExtension,
            img_margin_top: imgMarginTop,
            img_margin_left: imgMarginLeft,
            img_zoom: imgZoom,
            img_ratio: imgRatio,
            createdAt: date,
            _id,
            author,
            tags: tagsArray,
            media_link: mediaLink,
            index,
            // test : true => Un article déjà posté n'a pas un _id "testArticleId" mais peut être mis en test. C'est donc cet indicateur qui sert à savoir ensuite si l'on affiche la page détaillée d'un article en test ou en BDD
            test: true,
        }))

        setResizing(false)
        if (category !== "home") {
            router.push(`/${category}/none`)
        } else {
            router.push('/')
        }
    }




    // Fonction appelée en cliquant sur Annuler (ou juste pour annuler)

    const cancelPress = () => {
        setTitle('')
        setSubCategory('')
        setText1('')
        setText2('')
        setCategory('')
        setPictureUri('')
        setPictureUri2('')
        setPictureExtension('')
        setPictureMimeType('')
        setVideoLink('')
        setAuthor('')
        setTags('')
        setMediaLink('')
        imgMarginTopRef.current = 0
        imgMarginLeftRef.current = 0
        fingerDistanceRef.current = 0
        imgZoomRef.current = 1
        finalImgZoomRef.current = 1
        setImgMarginTop(0)
        setImgMarginLeft(0)
        setImgZoom(1)
        setImgRatio(0.55)
        dispatch(deleteTestArticle())
        setResizing(false)
    }





    // Fonction appelée en cliquant sur Publier

    const publishRef = useRef(true)

    const publishPress = async () => {

        if (!title || !category) {
            setError('Erreur : titre et catégorie obligatoires.')
            setTimeout(() => setError(''), 4000)
            setModal2Visible(false)
            return
        }

        if (!pictureUri && !pictureUri2) {
            setError('Erreur : image obligatoire.')
            setTimeout(() => setError(''), 4000)
            setModal2Visible(false)
            return
        }


        if (!publishRef.current) { return }
        publishRef.current = false


        // Si présence d'une image du portable de l'utilisateur, envoie de celle ci en formdata
        const formData = new FormData()

        pictureUri2 ? formData.append('articlePicture', {
            uri: pictureUri2,
            name: `picture.${pictureExtension}`,
            type: pictureMimeType,
        }) : formData.append('articlePicture', 'none')



        // Mise en forme des inputs pour leur envoi
        const _id = testArticle.length > 0 ? testArticle[0]._id : "testArticleId"

        const date = testArticle.length > 0 ? testArticle[0].createdAt : new Date()
        const tagsArray = tags.split(', ')

        const articleData = {
            title,
            sub_category: subCategory,
            text1,
            text2,
            author,
            tags: tagsArray,
            video_id,
            category,
            jwtToken: user.jwtToken,
            img_link: pictureUri,
            img_margin_top: imgMarginTop,
            img_margin_left: imgMarginLeft,
            img_zoom: imgZoom,
            img_ratio: imgRatio,
            media_link: mediaLink,
        }

        const postData = JWT.encode({
            _id,
            jwtToken: user.jwtToken,
            createdAt: date,
            pictureExtension,
            pictureMimeType,
            articleData,
        }, jwtKey)

        setUploading("Enregistrement, veuillez patienter...")
        let data
        try {
            const response = await fetch(`${url}/articles/save-article/${postData}`, {
                method: 'POST',
                body: formData,
            })

            data = await response.json()
        } catch (err) {
            console.log("ERR", err)
            setUploading("")
            setModal2Visible(false)
            setError("Erreur : Problème de connexion")
            publishRef.current = true
            setTimeout(() => setError(''), 4000)
            return
        }

        if (data.result) {
            if (data.articleSaved) {
                category == "home" && dispatch(deleteHomeContent())
                dispatch(addOneArticle(data.articleSaved))
            }
            if (data.articleModified) {
                dispatch(modifyArticle(data.articleModified))
            }

            setUploading("")
            setModal2Visible(false)

            let index = "none"
            if (testArticle.length > 0 && testArticle[0].index) {
                index = testArticle[0].index
            }

            cancelPress()
            publishRef.current = true

            if (category !== "home") {
                router.push(`/${category}/${index}`)
            } else {
                router.push('/')
            }
        }
        else if (data.error) {
            setUploading("")
            setModal2Visible(false)
            setError(data.error)
            publishRef.current = true
            setTimeout(() => setError(''), 4000)
        }
        else {
            setUploading("")
            setModal2Visible(false)
            setError("Problème de connexion, merci de voir avec le webmaster ou d'essayer après avoir quitté l'app et vous être reconnecté")
            publishRef.current = true
            setTimeout(() => setError(''), 4000)
        }
    }




    // Source de l'image à réquérir différement si elle est en ligne, sur l'appareil ou dans l'app


    let image
    if (pictureUri.includes('https') || pictureUri2) {
        image = <Image
            style={[styles.image, {
                width: RPW(95 * imgZoom),
                marginTop: RPW(imgMarginTop * 0.95),
                marginLeft: RPW(imgMarginLeft * 0.95)
            }]}
            source={{ uri: pictureUri ? pictureUri : pictureUri2 }}
        />
    } else if (pictureUri) {
        image = <Image
            style={[styles.image, {
                width: RPW(95 * imgZoom),
                marginTop: RPW(imgMarginTop * 0.95),
                marginLeft: RPW(imgMarginLeft * 0.95)
            }]}
            source={requires[pictureUri]}
        />
    }



    // useState pour offset du Keyboard
    const [keyboardOffset, setKeyboardOffset] = useState(Platform.OS === 'ios' ? RPW(16) : RPW(8))

    return (
        <>
            <KeyboardAwareScrollView
                style={{ flex: 1, backgroundColor: "#fffcfc" }}
                contentContainerStyle={{ alignItems: "center", paddingTop: RPH(2), paddingBottom: RPH(2) }}
                scrollEnabled={scrollable}
                keyboardShouldPersistTaps="handled"
                bottomOffset={keyboardOffset}
            >

                {/* <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.body} keyboardVerticalOffset={RPH(14.5)}  >
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ alignItems: "center", paddingTop: RPH(2), paddingBottom: RPH(2) }} scrollEnabled={scrollable}
                    keyboardShouldPersistTaps="handled"> */}

                <View style={styles.inputTitleUnderline}>
                    <Text style={styles.inputTitle}>Titre de l'article :</Text>
                </View>
                <TextInput
                    style={styles.smallInput}
                    placeholder="Titre de l'article..."
                    onChangeText={(e) => setTitle(e)}
                    placeholderTextColor="#fbfff792"
                    value={title}
                    onFocus={() => setKeyboardOffset(Platform.OS === 'ios' ? RPW(16) : RPW(8))}>
                </TextInput>

                <View style={styles.inputTitleUnderline}>
                    <Text style={styles.inputTitle}>Sous-Catégorie de l'article :</Text>
                </View>
                <TextInput
                    style={styles.smallInput}
                    placeholder="Sous-Catégorie de l'article..."
                    onChangeText={(e) => setSubCategory(e)}
                    value={subCategory}
                    placeholderTextColor="#fbfff792"
                    onFocus={() => setKeyboardOffset(Platform.OS === 'ios' ? RPW(16) : RPW(8))}
                >
                </TextInput>

                <View style={styles.inputTitleUnderline}>
                    <Text style={styles.inputTitle}>Chapeau de l'article :</Text>
                </View>
                <TextInput multiline={true}
                    textAlignVertical="top"
                    style={styles.largeInput1}
                    placeholder="Chapeau de l'article..."
                    onChangeText={(e) => setText1(e)}
                    value={text1}
                    placeholderTextColor="#fbfff792"
                    returnKeyType='next'
                    onFocus={() => setKeyboardOffset(Platform.OS === 'ios' ? RPW(16) : RPW(8))}>
                </TextInput>

                <View style={styles.inputTitleUnderline}>
                    <Text style={styles.inputTitle}>Texte de l'article :</Text>
                </View>
                <TextInput multiline={true}
                    textAlignVertical="top"
                    style={styles.largeInput2}
                    placeholder="Texte de l'article..."
                    onChangeText={(e) => setText2(e)}
                    value={text2}
                    placeholderTextColor="#fbfff792"
                    returnKeyType='next'
                    onFocus={() => setKeyboardOffset(-RPW(50))}>
                </TextInput>

                <View style={styles.inputTitleUnderline}>
                    <Text style={styles.inputTitle}>Auteur de l'article :</Text>
                </View>
                <TextInput style={styles.smallInput}
                    placeholder="Auteur..."
                    onChangeText={(e) => setAuthor(e)}
                    placeholderTextColor="#fbfff792"
                    value={author}
                    onFocus={() => setKeyboardOffset(Platform.OS === 'ios' ? RPW(16) : RPW(8))}>
                </TextInput>

                <View style={styles.inputTitleUnderline}>
                    <Text style={styles.inputTitle}>Lien vers un autre média :</Text>
                </View>
                <TextInput style={styles.smallInput}
                    placeholder="Lien vers un autre média..."
                    autoCapitalize="none"
                    onChangeText={(e) => setMediaLink(e)}
                    placeholderTextColor="#fbfff792"
                    value={mediaLink}
                    onFocus={() => setKeyboardOffset(Platform.OS === 'ios' ? RPW(16) : RPW(8))}>
                </TextInput>

                <View style={styles.inputTitleUnderline}>
                    <Text style={styles.inputTitle}>Tags de l'article :</Text>
                </View>
                <TextInput multiline={true}
                    textAlignVertical="top"
                    style={styles.mediumInput}
                    placeholder="Tags : sans '#', à séparer par une virgule et un espace..."
                    onChangeText={(e) => setTags(e)}
                    value={tags}
                    placeholderTextColor="#fbfff792"
                    submitBehavior="blurAndSubmit"
                    onFocus={() => setKeyboardOffset(Platform.OS === 'ios' ? RPW(16) : RPW(8))}>
                </TextInput>

                <View style={styles.inputTitleUnderline}>
                    <Text style={styles.inputTitle}>Lien d'une vidéo Youtube :</Text>
                </View>
                <TextInput style={[styles.smallInput, { marginBottom: 30 }]}
                    placeholder="Lien d'une vidéo Youtube..."
                    onChangeText={(e) => setVideoLink(e)}
                    value={videoLink}
                    autoCapitalize="none"
                    placeholderTextColor="#fbfff792"
                    onFocus={() => setKeyboardOffset(Platform.OS === 'ios' ? RPW(16) : RPW(8))}
                >
                </TextInput>


                <View style={styles.inputTitleUnderline}>
                    <Text style={styles.inputTitle}>Catégorie :</Text>
                </View>

                <View style={styles.row3}>
                    <View
                        style={styles.btnContainer}
                    >
                        <TouchableOpacity style={[styles.btn, category === "advices" && { backgroundColor: "transparent" }]} onPress={() => setCategory("advices")}>
                            <Text style={[styles.categoryText2, category !== "advices" && { color: "#0c0000" }]}>Conseils</Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={styles.btnContainer}
                    >
                        <TouchableOpacity style={[styles.btn, category === "press" && { backgroundColor: "transparent" }]} onPress={() => setCategory("press")}>
                            <Text style={[styles.categoryText2, category !== "press" && { color: "#0c0000" }]}>Presse</Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={styles.btnContainer}
                    >
                        <TouchableOpacity style={[styles.btn, category === "home" && { backgroundColor: "transparent" }]} onPress={() => setCategory("home")}>
                            <Text style={[styles.categoryText2, category !== "home" && { color: "#0c0000" }]}>Accueil</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={styles.inputTitleUnderline}>
                    <Text style={styles.inputTitle}>Lien d'une image sur internet :</Text>
                </View>
                <TextInput
                    style={[styles.smallInput, { marginBottom: RPW(2), marginTop: RPW(2) }]}
                    placeholder="Lien internet de l'image"
                    onChangeText={(e) => {
                        setPictureUri(e)
                        if (e.length > 0) {
                            setPictureUri2("")
                            setPictureExtension("")
                            setPictureMimeType("")
                        }
                    }}
                    placeholderTextColor="#fbfff792"
                    value={pictureUri}
                    autoCapitalize="none"
                    onFocus={() => setKeyboardOffset(Platform.OS === 'ios' ? RPW(16) : RPW(8))}>
                </TextInput>

                <Text style={styles.inputTitle}>ou</Text>

                <TouchableOpacity style={styles.btn4} onPress={() => setModalVisible(true)} >
                    <Text style={styles.btn3Text}>Image du téléphone</Text>
                </TouchableOpacity>


                <View style={[styles.inputTitleUnderline, { marginBottom: RPW(3) }]}>
                    <Text style={styles.inputTitle}>Réglage du ratio de l'image :</Text>
                </View>

                <Text style={styles.categoryText1}>Ratio : {imgRatio.toFixed(2)}   (Instagram : 1,00 ; 16/9 : 0,55)</Text>


                <Slider
                    style={styles.slider}
                    value={imgRatio}
                    minimumValue={0.2}
                    maximumValue={1.5}
                    minimumTrackTintColor="rgb(185, 0, 0)"
                    maximumTrackTintColor="#0c0000"
                    onValueChange={(e) => setImgRatio(e)}
                />


                <View style={[styles.imgContainer, { height: RPW(95) * imgRatio, }, resizing && { borderColor: "#b60050" }]} {...panResponder.panHandlers} >
                    {image && image}
                </View>

                <View style={[styles.row, { marginBottom: 30 }]}>
                    <View style={styles.btnContainer2} >
                        <TouchableOpacity style={resizing ? styles.resizeBtn : styles.btn3} onPress={() => {
                            resizingRef.current = !resizingRef.current

                            resizing && setScrollable(true)
                            setResizing(!resizing)
                        }}>
                            <Text style={[styles.categoryText2, !resizing && { color: "#0c0000" }]}> {!resizing ? "Recadrer l'image" : "Arrêter de recadrer"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.btnContainer2}>
                        <TouchableOpacity style={styles.btn3} onPress={() => {
                            cancelResizingPress()
                        }}>
                            <Text style={styles.btn2Text}> Annuler recadrage</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={{ color: 'red', fontSize: 18, fontWeight: 600 }}>{error}</Text>


                <View style={[styles.row, { marginTop: 8 }]}>
                    <TouchableOpacity style={styles.btn2} onPress={() => testPress()}>
                        <Text style={styles.btnText}>Tester</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn2} onPress={() => setModal2Visible(true)}>
                        <Text style={styles.btnText}>Publier</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn2} onPress={() => cancelPress()}>
                        <Text style={styles.btnText}>Annuler</Text>
                    </TouchableOpacity>
                </View>





                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    style={styles.modal}
                    backdropColor="rgba(0,0,0,0.9)"
                    transparent={true}
                    onRequestClose={() => setModalVisible(!modalVisible)}
                >
                    <View style={styles.modalBody}>
                        <Text style={styles.modalText}>Souhaitez vous compresser l'image ?</Text>
                        <View style={styles.line}>
                        </View>
                        <View style={styles.btnContainer4}>
                            <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => getPhonePicture(true)}>
                                <Text style={styles.modalText2}>Oui</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => getPhonePicture(false)}>
                                <Text style={styles.modalText2}>Non</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>



                <Modal
                    visible={modal2Visible}
                    animationType="slide"
                    style={styles.modal}
                    backdropColor="rgba(0,0,0,0.9)"
                    transparent={true}
                    onRequestClose={() => setModal2Visible(false)}
                >
                    <View style={styles.modalBody}>
                        <Text style={styles.modalText}>Êtes vous sûr de vouloir publier l'article ?</Text>
                        <View style={styles.line}>
                        </View>
                        <View style={styles.btnContainer4}>
                            <Text style={styles.uploading}>{uploading}</Text>

                            <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => setModal2Visible(false)}>
                                <Text style={styles.modalText2}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnTouchable} activeOpacity={0.8} onPress={() => publishPress()}>
                                <Text style={styles.modalText2}>Publier</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>




                {/* </ScrollView>
            </KeyboardAvoidingView> */}

            </KeyboardAwareScrollView>
            {Platform.OS === "ios" && <KeyboardToolbar doneText="Fermer" />}
        </>
    )

}

const styles = StyleSheet.create({
    body: {
        backgroundColor: "#fffcfc",
        flex: 1,
        alignItems: "center",
    },
    inputTitle: {
        fontSize: RPW(4.3),
        fontWeight: "800",
        marginBottom: RPW(0.5),
    },
    inputTitleUnderline: {
        borderBottomWidth: 3,
        borderBottomColor: "#0c0000",
        marginBottom: RPW(2.5)
    },
    smallInput: {
        backgroundColor: "rgb(157, 0, 0)",
        color: "white",
        width: RPW(90),
        height: 45,
        borderRadius: RPW(2.5),
        paddingLeft: RPW(2),
        fontSize: 19,
        marginBottom: 22
    },
    mediumInput: {
        backgroundColor: "rgb(157, 0, 0)",
        color: "white",
        width: RPW(90),
        height: 85,
        borderRadius: RPW(3),
        paddingLeft: RPW(2),
        fontSize: 19,
        marginBottom: 22,
    },
    largeInput1: {
        backgroundColor: "rgb(157, 0, 0)",
        color: "white",
        width: RPW(90),
        height: RPW(25),
        borderRadius: RPW(3),
        paddingLeft: RPW(2),
        fontSize: 19,
        marginBottom: 22,
    },
    largeInput2: {
        backgroundColor: "rgb(157, 0, 0)",
        color: "white",
        width: RPW(90),
        height: RPW(100),
        borderRadius: RPW(3),
        paddingLeft: RPW(2),
        fontSize: 15,
        marginBottom: 22,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: RPW(90),
        marginBottom: 18,
    },
    row3: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width: RPW(90),
        marginBottom: 30,
    },
    categoryText1: {
        color: "#0c0000",
        fontSize: RPW(4.3),
        fontWeight: "600",
        marginBottom: RPW(1)
    },
    categoryText2: {
        color: "white",
        fontSize: RPW(4.2),
        fontWeight: "500",
    },
    btnContainer: {
        backgroundColor: "#0c0000",
        height: RPW(10),
        borderRadius: 10,
        marginRight: RPW(7),
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#fffcfc",
        margin: 2,
        borderRadius: 10,
        paddingRight: RPW(4),
        paddingLeft: RPW(4)
    },
    btnText: {
        color: "white",
        fontSize: RPW(4.8),
        fontWeight: "500",
    },
    row2: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: RPW(100),
    },
    column: {
        width: RPW(43),
        height: 180,
        alignItems: "center",
        justifyContent: "space-between"
    },
    slider: {
        width: RPW(80)
    },
    btn2: {
        backgroundColor: "#0c0000",
        width: "30%",
        height: RPW(10),
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resizeBtn: {
        backgroundColor: "#0c0000",
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    btn3: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#fffcfc",
        margin: 2,
        borderRadius: 10,
    },
    btn4: {
        backgroundColor: "#0c0000",
        paddingLeft: RPW(4),
        paddingRight: RPW(4),
        height: RPW(9),
        borderRadius: 10,
        marginBottom: RPW(7),
        marginTop: RPW(1),
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn2Text: {
        color: "#0c0000",
        fontSize: RPW(4.5),
        fontWeight: "500",
    },
    btn3Text: {
        color: "white",
        fontSize: RPW(4.7),
        fontWeight: "500",
    },
    btnContainer2: {
        backgroundColor: "#0c0000",
        width: RPW(43),
        height: RPW(10),
        borderRadius: 10,
        marginBottom: 10,
    },
    imgContainer: {
        width: RPW(95),
        borderWidth: 1.5,
        marginBottom: 20,
        overflow: "hidden",
        justifyContent: "center",
        backgroundColor: "rgb(44, 44, 44)",
    },
    image: {
        height: RPW(600),
        resizeMode: "contain",
    },
    modal: {
        alignItems: "center"
    },
    modalBody: {
        height: RPH(35),
        width: RPW(94),
        borderRadius: 10,
        paddingTop: RPH(5),
        paddingBottom: RPH(5),
        paddingLeft: RPW(2),
        paddingRight: RPW(2),
        backgroundColor: "#dfdfdf",
        position: "absolute",
        bottom: RPH(17),
        left: RPW(3),
        justifyContent: "space-between",
        alignItems: "center"
    },
    modalText: {
        color: "#0c0000",
        fontSize: RPW(5.5),
        fontWeight: "600",
        textAlign: "center",
        paddingLeft: RPW(5),
        paddingRight: RPW(5),
        lineHeight: RPH(4)
    },
    line: {
        width: "90%",
        height: 4,
        marginTop: -6,
        backgroundColor: "rgb(157, 0, 0)",
    },
    uploading: {
        position: "absolute",
        color: "rgb(208, 0, 0)",
        top: -RPW(8.5),
        fontSize: RPW(4.8),
        fontWeight: "600"
    },
    btnContainer4: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: "100%"
    },
    btnTouchable: {
        width: RPW(37),
        height: RPW(11),
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0c0000",
    },
    modalText2: {
        color: "white",
        fontSize: RPW(5),
        fontWeight: "700",
        marginRight: RPW(2),
    },
})