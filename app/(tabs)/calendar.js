
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

import { RPH, RPW } from '../../modules/dimensions'
import { LocaleConfig, Agenda } from 'react-native-calendars';

import CalendarEvent from '../../components/CalendarEvent';
import DayComponent from '../../components/DayComponent';

import moment from 'moment/min/moment-with-locales'



export default function Calendar() {
    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS
    const [events, setEvents] = useState({ '2012-05-22': [{ name: 'initialObject' }] })
    const [markers, setMarkers] = useState({ '2012-05-20': { color: 'green' } })
    const [error, setError] = useState('')
    const [selectedDay, setSelectedDay] = useState(moment(new Date()).format('YYYY-MM-DD'))

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
    const [agendaReady, setAgendaReady] = useState(false)


    useEffect(() => {
        setTimeout(() => {
            setAgendaReady(true)
            agendaRef.current.setScrollPadPosition(0, false)
            agendaRef.current.enableCalendarScrolling()
        }, 350)
    }, [])





    LocaleConfig.locales['fr'] = {
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ],
        monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
        today: "Aujourd'hui"
    };

    LocaleConfig.defaultLocale = 'fr'




    // Composant à retourner quand pas d'évènements prévus

    const EmptyData = () => {
        return (
            <View style={styles.emptyDataContainer}>
                <Text style={styles.emptyDataText}>Pas d'évènement prévu ce jour ci</Text>
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
                    reservationsKeyExtractor={(item) => item.reservation.id}
                    markingType={"multi-period"}
                    markedDates={markers}
                    // N'aime pas flex : 1
                    style={{ width: RPW(100) }}
                    renderItem={(item, firstItemInDay) => <CalendarEvent {...item} firstItemInDay={firstItemInDay} />}

                    renderEmptyData={() => {
                        return <EmptyData />;
                    }}
                    showOnlySelectedDayItems={true}



                    dayComponent={({ date, state, marking }) => {
                        return <TouchableOpacity activeOpacity={0.4} onPress={() => agendaRef.current.onDayPress(date)}>
                            <DayComponent date={date} state={state} marking={marking} />
                        </TouchableOpacity>
                    }}



                    theme={{
                        // CALENDAR STYLE
                        calendarBackground: "rgb(243, 241, 241)",

                        //Mois
                        'stylesheet.calendar.header' : {
                            monthText: {
                                fontSize: 25,
                                letterSpacing : 1,
                                fontFamily: "Barlow-Bold",
                                fontWeight: "100",
                                color: "rgb(185,0,0)",
                                margin: 6.5
                              },
                        },

                        // Nom des jours (Lun, Mar...)
                        textSectionTitleColor: "black",
                        textDayHeaderFontSize: 14,
                        textDayHeaderFontFamily : "Barlow-Light",


                        // Rajouter une ligne entre les mois
                        'stylesheet.calendar.main': {
                            container: {
                                borderBottomWidth: 1,
                                borderBottomColor: "rgb(185,0,0)",
                            }
                        },


                         // AGENDA STYLE
                         agendaKnobColor: "rgb(185, 0, 0)",
                         reservationsBackgroundColor: "rgb(185, 0, 0)",
                        
                         // Encart à gauche de la liste des évènements
                         'stylesheet.agenda.list': {
                             dayNum: {
                                 fontSize: 32,
                                 letterSpacing : 2,
                                 fontWeight: '200',
                                 fontFamily: "Barlow-Bold",
                                 color: "rgb(245, 245, 245)",
                                 marginBottom : 0,
                             },
                             dayText: {
                                 fontSize: 17,
                                 fontFamily: "Barlow-Bold",
                                 color: "rgb(245, 245, 245)",
                                 backgroundColor: 'rgba(0,0,0,0)',
                                 marginTop: 0
                             },
                             day: {
                                 width: 63,
                                 alignItems: 'center',
                                 justifyContent: 'flex-start',
                                 marginTop: 32
                             },
                             today: {
                                 color: "rgb(245, 245, 245)",
                             },
                         },

                          // Pour gagner un peu de hauteur au dessus du knob
                        'stylesheet.agenda.main': {
                            knobContainer: {
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                height: 14,
                                width: RPW(100),
                                bottom: 0,
                                paddingBottom: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: "rgb(243, 241, 241)"
                            },
                        },
                         

                    }}
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        flex : 1,
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
        paddingTop: "10%"
    },
    emptyDataText: {
        color: "#fffcfc",
        fontSize: RPW(6),
        textAlign: "center",
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0.1),
    }
});
