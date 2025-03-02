
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

import { RPH, RPW } from '../../modules/dimensions'
import { LocaleConfig, Agenda } from 'react-native-calendars';

import CalendarEvent from '../../components/CalendarEvent';
import DayComponent from '../../components/DayComponent';
import CalendarEventsHeader from '../../components/CalendarEventsHeader';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import moment from 'moment/min/moment-with-locales'



export default function Calendar() {
    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS
    const [events, setEvents] = useState({ '2012-05-22': [{ name: 'initialObject' }] })
    const [markers, setMarkers] = useState({ '2012-05-20': { color: 'green' } })
    const [error, setError] = useState('')

    const [agendaOpen, setAgendaOpen] = useState(false)




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
        }, 450)
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

    const EmptyData = (props) => {
        return (
            <View style={styles.emptyDataContainer}>
                <CalendarEventsHeader date={props.date} toggleCalendar={toggleCalendar}></CalendarEventsHeader>
                <Text style={styles.emptyDataText}>Pas d'évènement prévu ce jour ci</Text>
            </View>
        )
    }





    // useRef et fonction en IDF pour enregistrer tous les premiers jours de chaque rang et leur date

    const firstDaysInRowRef = useRef([])

    const registerFirstDayInRow = (date) => {
        if (!firstDaysInRowRef.current.some(e => e === date)) {
            firstDaysInRowRef.current.push(date)
        }
    }






    // useRef pour enregistrer le jour sélectionné
    const selectedDayRef = useRef({ dateString: moment(new Date()).format('YYYY-MM-DD') })

    // Fonction pour sélectionner le premier jour de la semaine d'après ou d'avant

    const getAnotherWeek = (previousOrNext) => {
        const allFirstDaysOfRows = [...firstDaysInRowRef.current]

        // Tri des dates de premiers jours de rang dans l'ordre croissant si on cherche la première date au dessus ou décroissant si on cherche la première en dessous
        if (previousOrNext === "previous") {
            allFirstDaysOfRows.sort((a, b) => new Date(b) - new Date(a))
        } else {
            allFirstDaysOfRows.sort((a, b) => new Date(a) - new Date(b))
        }

        const currentSelectedDay = selectedDayRef.current.dateString

        const sixDayTimeMs = 1000 * 60 * 60 * 24 * 6

        for (let date of allFirstDaysOfRows) {
            if (previousOrNext === "previous") {
                if (new Date(currentSelectedDay) - new Date(date) > sixDayTimeMs) {
                    agendaRef.current.onDayPress({ dateString: date })
                    selectedDayRef.current = { dateString: date }
                    break;
                }
            } else {
                if (new Date(currentSelectedDay) - new Date(date) < 0) {
                    agendaRef.current.onDayPress({ dateString: date })
                    selectedDayRef.current = { dateString: date }
                    break;
                }
            }
        }
    }



    // Fonction IDF pour fermer le calendrier et enlever les flèches pour changer de semaine

    const toggleCalendar = (open) => {
        setAgendaOpen(false)
        setTimeout(()=>agendaRef.current.toggleCalendarPosition(open), 10)
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

                <FontAwesome6 name="caret-left" size={20} style={[styles.icon1, (!agendaOpen || !agendaReady) && { display: "none" }]} onPress={() => getAnotherWeek("previous")} />
                <FontAwesome6 name="caret-right" size={20} style={[styles.icon2, (!agendaOpen || !agendaReady) && { display: "none" }]} onPress={() => getAnotherWeek("next")} />

                <Agenda
                    ref={agendaRef}
                    items={events}
                    reservationsKeyExtractor={(item) => item.reservation.id}
                    markingType={"multi-period"}
                    markedDates={markers}
                    // N'aime pas flex : 1
                    style={{ width: RPW(100) }}
                    showOnlySelectedDayItems={true}
                    hideKnob={true}

                    renderItem={(item, firstItemInDay) => <CalendarEvent {...item} firstItemInDay={firstItemInDay} toggleCalendar={toggleCalendar} />}

                    renderEmptyData={() => {
                        return <EmptyData date={selectedDayRef.current.dateString} />;
                    }}

                    dayComponent={({ date, state, marking }) => {
                        return <TouchableOpacity activeOpacity={0.4} onPress={() => {
                            selectedDayRef.current = date
                            agendaRef.current.chooseDay(date)
                            setAgendaOpen(true)
                        }}>
                            <DayComponent date={date} state={state} marking={marking} registerFirstDayInRow={registerFirstDayInRow} />
                        </TouchableOpacity>
                    }}


                    theme={{
                        // CALENDAR STYLE
                        calendarBackground: "rgb(243, 241, 241)",

                        //Mois
                        'stylesheet.calendar.header': {
                            monthText: {
                                fontSize: 25,
                                letterSpacing: 1,
                                fontFamily: "Barlow-Bold",
                                fontWeight: "100",
                                color: "rgb(185,0,0)",
                                margin: 5
                            },
                        },


                        // Rajouter une ligne entre les mois
                        'stylesheet.calendar.main': {
                            container: {
                                borderBottomWidth: 1,
                                borderBottomColor: "rgb(185,0,0)",
                            },
                            // Pour cacher les lignes qui dépassent
                            monthView: {
                                overflow: "hidden",
                                height: 280,
                            },
                        },


                        // AGENDA STYLE
                        agendaKnobColor: "rgb(185, 0, 0)",
                        reservationsBackgroundColor: "rgb(185, 0, 0)",

                        // Pour gagner cacher la ligne de jours du dessous
                        'stylesheet.agenda.main': {
                            knobContainer: {
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                height: 14,
                                width: RPW(100),
                                bottom: 0,
                                paddingTop: 0,
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                backgroundColor: "rgb(243, 241, 241)"
                            },
                            reservations: {
                                flex: 1,
                                marginTop: 104,
                                backgroundColor: "rgb(185, 0, 0)",
                            },
                        },


                        // Pour cacher l'encart à gauche de la liste des évènements et centrer dans View
                        'stylesheet.agenda.list': {
                            day: {
                                width: 0,
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                marginTop: 32
                            },
                            innerContainer: {
                                flex: 1,
                                alignItems: "center"
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
        width: RPW(96),
        marginTop: RPW(14),
        alignSelf: "center",
        alignItems: "center",
    },
    emptyDataText: {
        color: "#fffcfc",
        fontSize: RPW(6),
        textAlign: "center",
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0.1),
        marginTop: RPW(10),
    },
    icon1: {
        // color : "rgb(185,0,0)",
        color: "black",
        position: "absolute",
        top: 40,
        // top : 14,
        left: 4,
        zIndex: 1000,
    },
    icon2: {
        color: "black",
        position: "absolute",
        top: 40,
        right: 4,
        zIndex: 1000,
    },
});
