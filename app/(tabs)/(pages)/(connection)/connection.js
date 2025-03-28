import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { router } from 'expo-router'
import { RPH, RPW } from '../../../../modules/dimensions'



export default function Connection() {


    return (
        <View style={styles.body}>
            <View style={styles.signContainer}>
                <TouchableOpacity style={styles.iconContainer}
                  onPress={() => router.push('/signin')}
                >
                    <FontAwesome5 name="user-edit" style={styles.icon} size={RPW(8)} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn}  onPress={() => router.push('/signin')}>
                    <Text style={styles.signText}>Se connecter</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.signContainer}>
                    <TouchableOpacity style={styles.iconContainer}
                        onPress={() => router.push('/signup')}
                    >
                        <FontAwesome5 name="user-plus" style={styles.icon} size={RPH(4.5)} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={() => router.push('/signup')}>
                        <Text style={styles.signText}>S'inscrire</Text>
                    </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "#fffcfc",
        justifyContent: "space-evenly",
        alignItems: "center",
        paddingBottom: RPH(8),
    },
    signContainer: {
        alignItems: "center",
        justifyContent: "space-between",
        height: RPW(40),
    },
    iconContainer: {
        width: RPW(23),
        height: RPW(23),
        borderRadius: RPH(7),
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: RPW(2.5),
        backgroundColor : "#0c0000",
    },
    icon: {
        color: "#fffcfc",
    },
    btn: {
        width: RPW(58),
        height: RPW(12),
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor : "#0c0000",
        borderRadius: 10,
    },
    signText: {
        color: "#fffcfc",
        fontSize: RPW(5),
        fontWeight: "500",
        letterSpacing: 1,
    },
})