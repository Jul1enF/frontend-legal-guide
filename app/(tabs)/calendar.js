
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

import { RPH, RPW } from '../../modules/dimensions'
import { LocaleConfig, Agenda } from 'react-native-calendars';

import CalendarEvent from '../../components/CalendarEvent';

import moment from 'moment/min/moment-with-locales'



export default function Calendar() {
    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS
    const [events, setEvents] = useState({'2012-05-22': [{name: 'initialObject'}]})
    const [markers, setMarkers]=useState({'2012-05-20': {color: 'green'}})
    const [error, setError] = useState('')
    const [selectedDay, setSelectedDay]=useState(moment(new Date()).format('YYYY-MM-DD'))

    // UseFocusEffect et fonction pour fetcher les évènements

    const getEvents = async () => {
        const response = await fetch(`${url}/calendar/getEvents`)

        const data = await response.json()

        if (!data.result) {
            setError("Erreur : Problème de connexion")
            setTimeout(() => setError(""), 4000)
            return
        } else {
            setEvents(data.events)
            setMarkers(data.markers)
        }
    }

    useFocusEffect(useCallback(() => {
        getEvents()
    }, []))


    // useEffect pour fermer l'agenda après que le composant ait monté

    const agendaRef = useRef(null)
    const [agendaReady, setAgendaReady]=useState(false)


    useEffect(() => {
            setTimeout(()=>{
                setAgendaReady(true)
                agendaRef.current.setScrollPadPosition(0, false)
                agendaRef.current.enableCalendarScrolling()
            }, 150)
    }, [])





    LocaleConfig.locales['fr'] = {
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ],
        monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam'],
        today: "Aujourd'hui"
    };

    LocaleConfig.defaultLocale = 'fr'




    // Composant à retourner quand pas d'évènements prévus

    const EmptyData = () => {
        return (
            <View style={styles.emptyDataContainer}>
                <Text style={styles.emptyDataText}>Pas d'évènements prévus ce jour ci</Text>
            </View>
        )
    }




    return (
        <View style={styles.body}>
            <Text style={styles.subTitle}>Agenda</Text>
            <Text style={styles.title}>Évènements à venir</Text>


            <View style={styles.line} >
            </View>

            <Text style={[styles.error, !error && { display: "none" }]}>{error}</Text>

            <View style={styles.agendaContainer}>

                {/* Composant pour cacher l'agenda en attendant que le calendrier apparaisse */}
                {!agendaReady && <View style={{ width: RPW(100), height: RPH(100), backgroundColor: "#fffcfc", position: "absolute", zIndex: 2 }} />}

                <Agenda
                    ref={agendaRef}
                    items={events}
                    reservationsKeyExtractor={(item) => item.reservation.id }
                    markingType={"period"}
                    markedDates={{...markers, [selectedDay] : {startingDay: true, endingDay: true, color : 'rgba(231, 76, 60, .8)', textColor: 'green'}}}
                    // N'aime pas flex : 1
                    style={{ width: RPW(100) }}
                    renderItem={(item) => <CalendarEvent {...item} />}
                    renderEmptyData={() => {
                        return <EmptyData />;
                    }}
                    showOnlySelectedDayItems={true}
                    onDayPress={day => {
                        setSelectedDay(day.dateString)
                        // console.log('selected day', day);
                      }}
                    theme={{
                        // CALENDAR STYLE
                        dotColor: "rgb(185, 0, 0)",
                        calendarBackground: "rgb(243, 241, 241)",

                        selectedDayBackgroundColor: "black",
                        selectedDayTextColor: "#fffcfc",
                        selectedDotColor: "#fffcfc",
                  

                        // Jour des mois non sélectionnés
                        textDisabledColor: "rgba(148, 148, 148, 0.7)",

                         // Nom des jours (Lun, Mar...)
                        textSectionTitleColor: "#0c0000",
                        textDayHeaderFontSize : RPW(3.5),

                        todayTextColor: "rgb(185,0,0)",

                        // Numéro des jours
                        // dayTextColor: "red",
                        textDayFontSize : RPW(4),

                        //Mois
                        monthTextColor: "rgb(185,0,0)",
                        textMonthFontSize: RPW(4.5),
                        textMonthFontWeight: "700",

                        // Rajouter une ligne entre les mois
                        'stylesheet.calendar.main': {
                            container: {
                                borderBottomWidth: 1,
                                borderBottomColor: "rgb(185,0,0)",
                            }
                        },

                        // AGENDA STYLE
                        agendaKnobColor: "rgb(185, 0, 0)",
                        agendaDayTextColor: "#fffcfc",
                        agendaDayNumColor: "#fffcfc",
                        reservationsBackgroundColor: "rgb(185, 0, 0)",
                    }}
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "#fffcfc",
        paddingTop: RPW(5),
        paddingLeft: RPW(1),
        paddingRight: RPW(1),
        alignItems: "center",
    },
    subTitle: {
        color: "rgb(185, 0, 0)",
        fontSize: RPW(8.5),
        lineHeight: RPW(8),
        fontWeight: "400",
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0.1),
        marginBottom: RPW(3.5),
    },
    title: {
        color: "#0c0000",
        fontSize: RPW(7.5),
        lineHeight: RPW(7.5),
        fontWeight: "450",
        marginBottom: RPW(4),
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(-0.05),
    },
    line: {
        width: RPW(22),
        height: 3.5,
        marginBottom: RPW(5),
        borderRadius: 15,
        backgroundColor: "rgb(185, 0, 0)",
    },
    error: {
        color: 'red',
        fontSize: RPW(4.8),
        fontWeight: "600",
        alignSelf: "center",
        marginBottom: RPW(3)
    },
    agendaContainer: {
        flex: 1,
        alignItems: "center",
    },
    emptyDataContainer: {
        flex: 1,
        alignItems: "center",
        paddingTop: RPW(8)
    },
    emptyDataText: {
        color: "#fffcfc",
        fontSize: RPW(4.5),
        fontWeight: "700",
        textAlign: "center"
    }
});
