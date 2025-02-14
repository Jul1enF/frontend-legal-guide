
import { StyleSheet, Text, View } from 'react-native';

import { RPH, RPW } from '../modules/dimensions'

import moment from 'moment/min/moment-with-locales'

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';



export default function Emergency(props) {

    moment.locale('fr')
    const date = moment(props.createdAt).format('DD/MM/YYYY')
    const hour = moment(props.createdAt).format('LT')

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.round}></View>
                <Text style={styles.txt1}>{props.user_firstname} {props.user_name} à {hour} le {date}</Text>
            </View>
            <View style={styles.row}>
                <FontAwesome5 name="long-arrow-alt-right" size={RPW(3.5)} style={styles.icon} />
                <Text style={styles.txt1}>Motif : {props.emergency_reason}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: RPW(24),
        width: RPW(96),
        marginBottom: RPW(5),
        paddingLeft: RPW(4),
        paddingRight: RPW(4),
        backgroundColor: "black",
        alignItems: 'center',
        justifyContent: 'space-evenly',
        borderWidth: 0,
        borderColor: "rgb(185, 0, 0)",
        borderRadius: RPW(4),
    },
    row: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        width : "100%",
        overflow : "hidden"
    },
    round: {
        backgroundColor: "#fffcfc",
        height: RPW(2),
        width: RPW(2),
        borderRadius: RPW(1),
        marginRight: RPW(6),
        marginTop: RPW(1.5)
    },
    txt1: {
        fontFamily: "Barlow-Regular",
        fontSize: RPW(5.2),
        letterSpacing: RPW(0.25),
        color : "#fffcfc",
    },
    icon : {
        color : "#fffcfc",
        marginRight: RPW(5),
        marginTop: RPW(1.5)
    }
});