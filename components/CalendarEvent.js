import { StyleSheet, Text, View } from "react-native"

import { RPH, RPW } from "../modules/dimensions"
import moment from 'moment/min/moment-with-locales'

export default function CalendarEvent(props) {
    console.log("PROPSSSS", props)

    return (
        <View style={styles.body}>
            <Text>{props.title}</Text>
            <Text>{props.description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width : "100%",
        backgroundColor: "#fffcfc",
        paddingTop: RPW(2),
        paddingLeft: RPW(1),
        paddingRight: RPW(1),
    },
})