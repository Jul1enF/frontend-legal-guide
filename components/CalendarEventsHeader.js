
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import { RPH, RPW } from '../modules/dimensions'
import FontAwesome6 from '@expo/vector-icons/FontAwesome5';

export default function CalendarEventsHeader(props) {
    return (
        <View style={styles.body}>
            <FontAwesome6 name="caret-left" size={RPW(5.5)} style={styles.icon} onPress={()=>props.getAnotherWeek("previous")}/>
            <FontAwesome6 name="chevron-down" size={RPW(4.8)} style={styles.icon} onPress={()=>props.toggleCalendar(true)}/>
            <FontAwesome6 name="caret-right" size={RPW(5.5)} style={styles.icon} onPress={()=>props.getAnotherWeek("next")}/>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        width: RPW(100),
        height: RPW(5),
        backgroundColor: 'orange',
        paddingLeft : RPW(2),
        paddingRight : RPW(2),
        flexDirection : "row",
        alignItems : "center",
        justifyContent : "space-between",
    },
    icon : {
        color : "black",
    }
});
