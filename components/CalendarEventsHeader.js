
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { RPH, RPW } from '../modules/dimensions'

import moment from 'moment/min/moment-with-locales'
moment.locale('fr')

export default function CalendarEventsHeader(props) {
    const formatDate = (string) => {
        const localDate = moment(string).format('LLLL')
        const i = localDate.length
        const finalDate = localDate.slice(0, i - 6)
        return finalDate.toUpperCase()
    }
    const title = formatDate(props.date)

    return (
        <View style={styles.body}>
            <TouchableOpacity activeOpacity={0.9} style={styles.knobContainer} onPress={()=>{
                props.toggleCalendar(true)
            }}>
                <View style={styles.knob}></View>
            </TouchableOpacity>
        <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
        </View>
        </View>
    );
}


const styles = StyleSheet.create({
    body: {
        width: RPW(100),
        height: RPW(11),
        position : "absolute",
        top : -RPW(14),
        left : -RPW(2),
    },
    knobContainer : {
        backgroundColor : "rgb(243, 241, 241)",
        width: RPW(100),
        height: RPW(3),
        alignItems : "center",
    },
    knob : {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderRightWidth: RPW(4),
        borderTopWidth: RPW(2),
        borderLeftWidth: RPW(4),
        borderRightColor: 'transparent',
        borderTopColor: "rgb(185,0,0)",
        borderLeftColor: 'transparent',
        position : "absolute",
        top : 0,
        alignSelf : "center",
    },
    titleContainer : {
        width: RPW(100),
        height: RPW(8),
        justifyContent : "center",
        alignItems : "center",
        backgroundColor: "#fffcfc",
    },
    title : {
        fontSize : RPW(4.8),
        letterSpacing : RPW(0.1),
        fontFamily : "Barlow-Bold",
        color : "rgb(185,0,0)",
    },
    icon : {
        color : "black",
    }
});
