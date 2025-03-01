
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

import { RPH, RPW } from '../../modules/dimensions'
import { LocaleConfig, ExpandableCalendar, AgendaList, CalendarProvider } from 'react-native-calendars';

import CalendarEvent from '../../components/CalendarEvent';
import DayComponent from '../../components/DayComponent';

import moment from 'moment/min/moment-with-locales'
moment.locale('fr')



export default function Calendar() {
    const url = process.env.EXPO_PUBLIC_BACK_ADDRESS
    const [events, setEvents] = useState(null)
    const [markers, setMarkers] = useState("")
    const [error, setError] = useState('')


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

        // Le premier rendu de DayComponent n'est pas bon
    }

    useFocusEffect(useCallback(() => {
        getEvents()
    }, []))




    LocaleConfig.locales['fr'] = {
        monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ],
        monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
        today: "Aujourd'hui"
    };

    LocaleConfig.defaultLocale = 'fr'

    if (events){
        events.map(e=>{
            if (e.title === '2025-04-22'){
                console.log("22/04", e)
            }
        })
    }



    const agendaItems = [
        {
            title: '2025-03-02',
            data: [{ hour: '12am', duration: '1h', title: 'First Yoga' }, { hour: '9am', duration: '1h', title: 'Long Yoga', itemCustomHeightType: 'LongEvent' }]
        },
        {
            title: '2025-03-04',
            data: [
                { hour: '4pm', duration: '1h', title: 'Pilates ABC' },
                { hour: '5pm', duration: '1h', title: 'Vinyasa Yoga' }
            ]
        },
        {
            title: '2025-03-06',
            data: [
                { hour: '1pm', duration: '1h', title: 'Ashtanga Yoga' },
                { hour: '2pm', duration: '1h', title: 'Deep Stretches' },
                { hour: '3pm', duration: '1h', title: 'Private Yoga' }
            ]
        },
    ]

    // Fonction pour mettre la date des évènements au bon format

    const formatDate = (string) => {
        const localDate = moment(string).format('LLLL')
        const i = localDate.length
        const finalDate = localDate.slice(0, i - 6)
        return finalDate
    }



    return (
        <View style={styles.body}>
            <Text style={styles.subTitle}>Agenda</Text>
            <Text style={styles.title}>Évènements à venir</Text>


            <View style={styles.line} >
            </View>

            <Text style={[styles.error, !error && { display: "none" }]}>{error}</Text>

            <View style={styles.agendaContainer}>
                {markers &&
                    <CalendarProvider
                        date={moment(new Date()).format('YYYY-MM-DD')}
                        showTodayButton={false}
                    >
                        <ExpandableCalendar
                            theme={{
                                "stylesheet.calendar.header": {
                                    monthText: {
                                        fontSize: 25,
                                        letterSpacing: 1,
                                        fontFamily: "Barlow-Bold",
                                        fontWeight: "100",
                                        color: "rgb(185,0,0)",
                                        margin: 5,
                                    },
                                },
                                stylesheet: {
                                    expandable: {
                                        main: {
                                            knobContainer: {
                                                position: "absolute",
                                                left: 0,
                                                right: 0,
                                                height: 14,
                                                width: RPW(100),
                                                bottom: 0,
                                                paddingBottom: 0,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: "rgb(243, 241, 241)"
                                                //  backgroundColor: "orange"
                                            },
                                        },
                                    },
                                },
                                // Ne supporte que le rgb
                                expandableKnobColor: "rgb(185,0,0)",
                                calendarBackground: "rgb(243, 241, 241)",
                                arrowColor: "rgb(185,0,0)",
                                reservationsBackgroundColor: "rgb(243, 241, 241)"
                            }}


                            dayComponent={({ date, state, marking, onPress }) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.2}
                                        onPress={() => onPress(date)}
                                    >
                                        <DayComponent
                                            date={date}
                                            state={state}
                                            marking={marking}
                                            key={date.dateString}
                                        />
                                    </TouchableOpacity>
                                );
                            }}
                            disableWeekScroll
                            initialPosition='open'
                            firstDay={1}
                            markedDates={markers}
                            animateScroll
                        />
                        <AgendaList
                            style={{ backgroundColor: "rgb(185, 0, 0)", width: RPW(100) }}
                            contentContainerStyle={{ alignItems: "center" }}

                            sections={events}
                            renderItem={CalendarEvent}

                            // Encart du haut avec la date
                            sectionStyle={styles.sectionStyle}
                            dayFormatter={formatDate}
                            scrollToNextEvent={false}
                        />
                    </CalendarProvider>
                }
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
    },
    emptyDataText: {
        color: "#fffcfc",
        fontSize: RPW(6),
        textAlign: "center",
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0.1),
        marginTop: RPW(10),
    },
    sectionStyle: {
        color: "white",
        backgroundColor: "#0c0000",
        fontSize: RPW(4.5),
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0.1),
        width: RPW(100),
        height: RPW(10),
        paddingTop: RPW(4),
        textAlign: "center",
        marginBottom: RPW(3)
    },
});
