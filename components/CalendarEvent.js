import { StyleSheet, Text, View } from "react-native"

import { RPH, RPW } from "../modules/dimensions"
import moment from 'moment/min/moment-with-locales'

export default function CalendarEvent({item}) {
    if (!item) return <></>

    let schedules
    if (item.periodEvent && item.startingDay && item.startingTime){
        schedules = `À partir de ${item.startingTime}`
    }else if (item.periodEvent && item.endingDay && item.endingTime){
        schedules = `Jusqu'à ${item.endingTime}`
    }else if (item.allDayEvent || item.middleDay){
         schedules = "Jour entier"
    }else{
         schedules = `${item.startingTime} - ${item.endingTime}`
    }


    let lineColor = "rgb(185, 0, 0)"
    if (item.periodNumber === 1){
        lineColor = "rgb(123, 0, 111)"
    }else if (item.periodNumber === 2){
        lineColor = "rgb(35, 0, 105)"
    }



    return (
        <View style={styles.body}>

            <Text style={styles.schedules}>{schedules}</Text>

            <View style={[styles.line, {backgroundColor : lineColor}]}></View>

            <Text style={styles.title}>{item.title}</Text>

            { item.description && <Text style={styles.description}>{item.description}</Text>}

            {item.location && <Text style={styles.location}>Lieu : {item.location}</Text>} 

        </View>
    )
}


const styles = StyleSheet.create({
    body: {
        width : RPW(94),
        backgroundColor: "#fffcfc",
        paddingTop: RPW(2),
        paddingLeft: RPW(2),
        paddingRight: RPW(1),
        paddingBottom : RPW(2),
        marginBottom : RPW(8),
        borderRadius : RPW(2.5)
    },
    schedules : {
        fontSize: RPW(4.4),
        color: "#0c0000",
        fontFamily: "Barlow-Light",
        letterSpacing: RPW(0.15),
        marginBottom : RPW(2.5)
    },
    line : {
        height : 5,
        width : RPW(7),
        borderRadius : 3,
        marginBottom : RPW(3)
    },
    title : {
        fontSize: RPW(4.8),
        color: "#0c0000",
        fontFamily: "Barlow-SemiBold",
        letterSpacing: RPW(0.15),
        marginBottom : RPW(2)
    },
    description : {
        fontSize: RPW(4.5),
        color: "#0c0000",
        fontFamily: "Barlow-Light",
        letterSpacing: RPW(0.1),
        marginBottom : RPW(2.5),
        marginTop : RPW(1),
    },
    location : {
        fontSize: RPW(4),
        color: "#0c0000",
        fontFamily: "Barlow-ExtraLight",
        letterSpacing: RPW(0.1),
        marginBottom : RPW(2),
        marginTop : RPW(1),
    }
})