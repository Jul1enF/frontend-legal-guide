
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useState, useCallback, useEffect, useRef } from 'react';
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

    // Fonction pour mettre la date des évènements au bon format

    const formatDate = (string) => {
        const localDate = moment(string).format('LLLL')
        const i = localDate.length
        const finalDate = localDate.slice(0, i - 6)
        return finalDate
    }


    // Définition du rendu des items de la liste de l'agenda
    const renderItem = useCallback((item) => {
        return <CalendarEvent item={item} key={item.item.id} />;
    }, []);


    // L'agenda n'apparait qu'à moitié ouvert. Passage d'un mois à un autre pour bien le fermer.
    const [selectedDate, setSelectedDate] = useState(moment(new Date()).subtract(1, 'month').format('YYYY-MM-DD'))


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
                        date={selectedDate}
                        showTodayButton={false}
                    >
                        <ExpandableCalendar
                            onLayout={() => {
                                setTimeout(() => {
                                    setSelectedDate(moment(new Date()).format('YYYY-MM-DD'))
                                }, 500)
                            }}
                            theme={{
                                "stylesheet.calendar.header": {
                                    monthText: {
                                        fontSize: 25,
                                        letterSpacing: 1,
                                        fontFamily: "Barlow-Bold",
                                        fontWeight: "100",
                                        color: "rgb(185,0,0)",
                                        margin: 0,
                                    },
                                    header: {
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                        marginTop: 0,
                                        alignItems: 'center',
                                        // height : 30,
                                    },
                                },
                                stylesheet: {
                                    expandable: {
                                        main: {
                                            knobContainer: {
                                                position: "absolute",
                                                left: 0,
                                                right: 0,
                                                height: 18,
                                                width: RPW(100),
                                                bottom: 0,
                                                paddingBottom: 0,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundColor: "rgb(237, 235, 235)"
                                                //  backgroundColor: "orange"
                                            },
                                            // Pour ne pas voir des lignes dépasser en dessous quand agenda remonté
                                            week: {
                                                marginTop: 7,
                                                marginBottom: 15,
                                                paddingRight: 15,
                                                paddingLeft: 15,
                                                flexDirection: 'row',
                                                justifyContent: 'space-around'
                                            },
                                        },
                                    },
                                },
                                // Ne supporte que le rgb
                                expandableKnobColor: "rgb(185,0,0)",
                                calendarBackground: "rgb(237, 235, 235)",
                                arrowColor: "rgb(185,0,0)",
                                reservationsBackgroundColor: "rgb(237, 235, 235)"
                            }}


                            dayComponent={({ date, state, marking, onPress }) => {
                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.2}
                                        onPress={() => onPress(date)}
                                        key={date.dateString}
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
                            // animateScroll
                            markedDates={markers}
                        />
                        <AgendaList
                            style={{ backgroundColor: "rgb(185, 0, 0)", width: RPW(100) }}
                            contentContainerStyle={{ alignItems: "center" }}
                            sections={events}
                            renderItem={renderItem}

                            // Encart du haut avec la date
                            sectionStyle={styles.sectionStyle}
                            dayFormatter={formatDate}
                            scrollToNextEvent={true}
                            // Préparer l'affichage de pleins d'éléments pour pas de bug en scrollant loin
                            windowSize={401}

                        // infiniteListProps={{
                        //     itemHeight: 200, // The height of the agendaItem without padding. Defaults to 80 I believe
                        //     titleHeight: 60, // The height of the section (date) title without padding.
                        //     visibleIndicesChangedDebounce: 250,
                        //     itemHeightByType : ""
                        //   }}
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
        paddingTop: RPW(2.5),
        alignItems: "center",
    },
    subTitle: {
        color: "rgb(185, 0, 0)",
        fontSize: RPW(8),
        lineHeight: RPW(8),
        fontWeight: "400",
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0.1),
        marginBottom: RPW(2),
    },
    title: {
        color: "#0c0000",
        fontSize: RPW(7),
        lineHeight: RPW(7),
        fontWeight: "450",
        marginBottom: RPW(2.5),
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(-0.05),
    },
    line: {
        width: RPW(22),
        height: 3.5,
        marginBottom: RPW(4),
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
    sectionStyle: {
        // color : "rgb(243, 241, 241)",
        // backgroundColor: "rgb(185,0,0)",
        color: "rgb(185,0,0)",
        backgroundColor: "#fffcfc",
        fontSize: RPW(4.5),
        fontFamily: "Barlow-Bold",
        letterSpacing: RPW(0.1),
        width: RPW(100),
        height: RPW(8),
        paddingTop: RPW(3),
        textAlign: "center",
        marginBottom: RPW(6),
        borderTopWidth: 0.5,
        borderTopColor: "black",
        borderBottomWidth: 1,
        borderBottomColor: "rgb(185,0,0)",
    },
});
