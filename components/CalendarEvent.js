import { StyleSheet, Text, View } from "react-native"

import { RPH, RPW } from "../modules/dimensions"
import moment from 'moment/min/moment-with-locales'

export default function CalendarEvent(props) {

    let schedules
    if (props.periodEvent && props.startingDay && props.startingTime){
        schedules = `À partir de ${props.startingTime}`
    }else if (props.periodEvent && props.endingDay && props.endingTime){
        schedules = `Jusqu'à ${props.endingTime}`
    }else if (props.allDayEvent || props.middleDay){
         schedules = "Jour entier"
    }else{
         schedules = `${props.startingTime} - ${props.endingTime}`
    }


    let lineColor = "rgb(185, 0, 0)"
    if (props.periodNumber === 1){
        lineColor = "rgb(123, 0, 111)"
    }else if (props.periodNumber === 2){
        lineColor = "rgb(35, 0, 105)"
    }



    return (
        <View style={[styles.body, props.firstItemInDay && { marginTop : RPW(3)}]}>
            <Text style={styles.schedules}>{schedules}</Text>

            <View style={[styles.line, {backgroundColor : lineColor}]}></View>

            <Text style={styles.title}>{props.title}</Text>
            
            { props.description && <Text style={styles.description}>{props.description}</Text>}

            {props.location && <Text style={styles.location}>Lieu : {props.location}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width : "98%",
        backgroundColor: "#fffcfc",
        paddingTop: RPW(2),
        paddingLeft: RPW(2),
        paddingRight: RPW(1),
        paddingBottom : RPW(2),
        marginBottom : RPW(3),
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
        fontSize: RPW(4.3),
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