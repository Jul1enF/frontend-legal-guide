
import { StyleSheet, Text, View } from 'react-native';
import { useLayoutEffect, useState } from 'react';

import { RPH, RPW } from '../modules/dimensions'

export default function DayComponent(props) {

    const { date, state, marking } = props

    // if (date.dateString === "2025-03-13") {
    //     console.log("PROPS", props)
    // }

    const [selectedBg, setSelectedBg] = useState('fff')
    const [textColor, setTextColor] = useState('black')
    const [textWeight, setTextWeight] = useState("300")
    const [dotColor, setDotColor] = useState('fff')
    const [dotWidth, setDotWidth] = useState(5)
    const [thisLineStyle, setThisLineStyle] = useState('')
    const [thisLineStyle2, setThisLineStyle2] = useState('')




    const setConditionnalStyle = () => {
        // Style conditionnel selectedContainer
        if (state !== 'disabled' && marking?.selected) {
            setSelectedBg('black')
        } else if (selectedBg !== 'fff') {
            setSelectedBg('fff')
        }

        // Style conditionnel dayText
        if (state === "disabled") { setTextColor("rgba(148, 148, 148, 0.7)") }
        else if (marking?.selected) { setTextColor("#fffcfc") }
        else if (state === "today") {
            setTextColor("rgb(185, 0, 0)")
            setTextWeight("500")
        } else if (textColor !== 'black' || textWeight !== "300") {
            setTextColor('black')
            setTextWeight("300")
        }

        // Style conditionnel couleur dot
        if (marking?.marked) {
            state === "disabled" ? setDotColor("rgba(148, 148, 148, 0.7)") : setDotColor("rgb(185, 0, 0)")
        } else if (dotColor !== 'fff') {
            setDotColor('fff')
        }

          // Style conditionnel largeur dot
          if (marking?.marked2) {
            setDotWidth(12.5)
        } else if (dotWidth !== 5) {
            setDotColor(5)
        }


        // Style conditionnel de la première ligne d'un marqueur de période
        if (marking?.periodMarker) {
            if (marking.startingDay) {
                setThisLineStyle("startingLine")
            } else if (marking.endingDay) {
                setThisLineStyle("endingLine")
            } else { setThisLineStyle("line") }
        } else if (thisLineStyle !== "") {
            setThisLineStyle('')
        }

        // Style conditionnel de la deuxième ligne d'un marqueur de période
        if (marking?.periodMarker2) {
            if (marking.startingDay2) {
                setThisLineStyle2("startingLine2")
            } else if (marking.endingDay2) {
                setThisLineStyle2("endingLine2")
            } else { setThisLineStyle2("line2") }
        } else if (thisLineStyle2 !== "") {
            setThisLineStyle2('')
        }
    }



    // useLayoutEffect pour effectuer l'affichage conditionnel seulement à chaque fois que marking change et avant rendu
    useLayoutEffect(() => {
        setConditionnalStyle()
    }, [marking])


    // Style de la première ligne de marqueur de période
    const lineStyle = styles[thisLineStyle]


    // Style de la deuxième ligne de marqueur de période
    const lineStyle2 = styles[thisLineStyle2]



    return (
        <View style={styles.dayContainer}>
            <View style={[styles.selectedContainer, { backgroundColor: selectedBg }]}>
                <Text style={[styles.dayText, { color: textColor, fontWeight: textWeight }]}>
                    {date.day}
                </Text>
                <View style={[styles.dot, { backgroundColor: dotColor, width : dotWidth, left : dotWidth === 5 ? 14 : 9 }]} />
            </View>

            <View style={lineStyle}></View>
            <View style={lineStyle2}></View>
            {/* <View style={styles.borderLine} ></View> */}

        </View>
    );
}

const styles = StyleSheet.create({
    dayContainer: {
        width: 38,
        height: 34,
        alignSelf: 'stretch',
        backgroundColor: 'fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedContainer: {
        position: "absolute",
        bottom: 12,
        width: 30,
        height: 28,
        borderRadius: 17,
        paddingBottom: 4,
        justifyContent: "center",
        alignItems: "center"
    },
    dayText: {
        fontSize: 16,
        letterSpacing: 0.5,
        textAlign: "center",
    },
    dot: {
        position: "absolute",
        bottom: 2,
        height: 5,
        borderRadius: 3,
    },
    startingLine: {
        position: "absolute",
        top: 23,
        height: 6,
        width: 45,
        left: 3,
        backgroundColor: "rgb(123, 0, 111)",
        borderTopLeftRadius: 2,
        borderBottomLeftRadius: 2,
    },
    line: {
        position: "absolute",
        top: 23,
        height: 6,
        width: 60,
        backgroundColor: "rgb(123, 0, 111)",
    },
    endingLine: {
        position: "absolute",
        top: 23,
        height: 6,
        width: 45,
        right: 3,
        backgroundColor: "rgb(123, 0, 111)",
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2,
    },
    startingLine2: {
        position: "absolute",
        top: 29.5,
        height: 6,
        width: 45,
        left: 3,
        backgroundColor: "rgb(35, 0, 105)",
        borderTopLeftRadius: 2,
        borderBottomLeftRadius: 2,
    },
    line2: {
        position: "absolute",
        top: 29.5,
        height: 6,
        width: RPW(13.5),
        backgroundColor: "rgb(35, 0, 105)",
    },
    endingLine2: {
        position: "absolute",
        top: 29.5,
        height: 6,
        width: 45,
        right: 3,
        backgroundColor: "rgb(35, 0, 105)",
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2,
    },
    borderLine: {
        backgroundColor: "black",
        width: 60,
        height: 2,
        position: "absolute",
        top: 37,
    }
});
