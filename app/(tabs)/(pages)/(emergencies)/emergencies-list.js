
import { router, useFocusEffect } from 'expo-router'
import { StyleSheet, Text, View, RefreshControl, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { addEmergencies } from '../../../../reducers/emergencies';
import { useCallback, useState } from 'react';
import Emergency from '../../../../components/Emergency'

import { RPH, RPW } from '../../../../modules/dimensions'

export default function EmergenciesList() {

    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS
    const user = useSelector((state) => state.user.value)
    const emergencies = useSelector((state) => state.emergencies.value)
    const dispatch = useDispatch()

    const [error, setError] = useState('')


    // Fonction et useFocusEffect pour fetcher les demandes d'urgences
    const getEmergencies = async () => {
        const response = await fetch(`${url}/emergencies/get-emergencies/${user.jwtToken}`)

        const data = await response.json()

        if (!data.result) {
            setError("Erreur : problème de connexion. Données non actualisées. Quittez l'appli et reconnectez vous.")
            setTimeout(() => { setError(''), 4000 })
        }
        else {
            dispatch(addEmergencies(data.emergencies))
        }
    }

    useFocusEffect(useCallback(() => {
        getEmergencies()
    }, []))




    // Header pour la flatlist

    const HeaderFlatlist = () => {
        return (
            <>
                <Text style={[styles.error, !error && { display: "none" }]}>{error}</Text>

                <Text style={styles.title}>Liste des demandes de contact urgent</Text>
                <View style={styles.titleLine}></View>
            </>
        )
    }



      // Composant pour rafraichir la page
    
        const [isRefreshing, setIsRefreshing] = useState(false)
    
        const refreshComponent = <RefreshControl refreshing={isRefreshing} colors={["#0c0000"]} progressBackgroundColor={"#fffcfc"} tintColor={"#0c0000"} onRefresh={() => {
            setIsRefreshing(true)
            setTimeout(() => setIsRefreshing(false), 1000)
            getEmergencies()
        }} />
    



    if (emergencies.emergenciesList.length === 0) {
        return (
            <View style={styles.body}>

                <Text style={[styles.error, !error && { display: "none" }]}>{error}</Text>

                <Text style={styles.title}>Liste des demandes de contact urgent</Text>
                <View style={styles.titleLine}></View>
                <Text style={styles.subTitle}>Aucune demande en cours</Text>
            </View>
        )
    }





    return (
        <View style={styles.body}>
            <FlatList
                data={emergencies.emergenciesList}
                refreshControl={refreshComponent}
                ListHeaderComponent={HeaderFlatlist}
                contentContainerStyle={{alignItems : "center"}}
                keyExtractor={(item) => item._id}
                renderItem={({item})=>
                    <TouchableOpacity onPress={()=> router.push(`emergency/${item._id}`)}>
                             <Emergency {...item}/>
                    </TouchableOpacity>
            }
            />
        </View>
    );
}




const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "#fffcfc",
        alignItems: "center",
        paddingTop: RPW(7)
    },
    error: {
        color: "red",
        fontSize: RPW(5),
        fontWeight: "600",
        textAlign: "center",
        marginBottom: RPW(5)
    },
    title: {
        color: "#0c0000",
        fontSize: RPW(8),
        marginBottom: RPW(5),
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0),
        textAlign: "center"
    },
    titleLine: {
        width: RPW(30),
        height: 3.5,
        marginBottom: RPW(8),
        borderRadius: 15,
        backgroundColor: "rgb(185, 0, 0)",
        alignSelf : "center"
    },
    subTitle: {
        fontFamily: "Barlow-SemiBold",
        fontSize: RPW(7)
    }
});
