import { StyleSheet, Text, View } from "react-native"

import { RPH, RPW } from "../modules/dimensions"
import moment from 'moment/min/moment-with-locales'

export default function CalendarEvent(props) {

    // const event = {...props}

    // const items = [{ "created": "2025-02-25T02:09:14.000Z", "creator": { "email": "j.furic@gmail.com", "self": true }, "description": "Test d'un évènement. Ce sera super cool. Bla bla bla. Venez tous.", "end": { "dateTime": "2025-03-10T15:00:00+01:00", "timeZone": "Europe/Paris" }, "etag": "\"3480898855198558\"", "eventType": "default", "htmlLink": "https://www.google.com/calendar/event?eid=MXRia3BoYWN2ZDUxY3VpcDRscDUzM3BlcmIgai5mdXJpY0Bt", "iCalUID": "1tbkphacvd51cuip4lp533perb@google.com", "id": "1tbkphacvd51cuip4lp533perb", "kind": "calendar#event", "location": "Meudon, France", "organizer": { "email": "j.furic@gmail.com", "self": true }, "reminders": { "useDefault": true }, "sequence": 0, "start": { "dateTime": "2025-03-10T10:00:00+01:00", "timeZone": "Europe/Paris" }, "status": "confirmed", "summary": "Évènement calendrier 1", "updated": "2025-02-25T02:10:27.599Z" }, { "created": "2025-02-25T02:09:14.000Z", "creator": { "email": "j.furic@gmail.com", "self": true }, "description": "Test d'un évènement. Ce sera super cool. Bla bla bla. Venez tous.", "end": { "dateTime": "2025-03-10T18:00:00+01:00", "timeZone": "Europe/Paris" }, "etag": "\"3480898855198558\"", "eventType": "default", "htmlLink": "https://www.google.com/calendar/event?eid=MXRia3BoYWN2ZDUxY3VpcDRscDUzM3BlcmIgai5mdXJpY0Bt", "iCalUID": "1tbkphacvd51cuip4lp533perb@google.com", "id": "1tbkphacvd51cuip4lp533perb", "kind": "calendar#event", "location": "Meudon, France", "organizer": { "email": "j.furic@gmail.com", "self": true }, "reminders": { "useDefault": true }, "sequence": 0, "start": { "dateTime": "2025-03-10T16:00:00+01:00", "timeZone": "Europe/Paris" }, "status": "confirmed", "summary": "Évènement calendrier 2", "updated": "2025-02-25T02:10:27.599Z" }]


    const items = [ { "created": "2025-02-25T02:12:34.000Z", "creator": { "email": "j.furic@gmail.com", "self": true }, "description": "On va tous aller squatter chez Uller. On mangera dans son frigo. Viendez nombreux. On appellera les flics pour qu'ils viennent défoncer la porte.", "end": { "dateTime": "2025-03-15T16:30:00+01:00", "timeZone": "Europe/Paris" }, "etag": "\"3480899109119486\"", "eventType": "default", "htmlLink": "https://www.google.com/calendar/event?eid=NHJhcjYwdHJnbjZpcXJ0c2locW03aWUzODIgai5mdXJpY0Bt", "iCalUID": "4rar60trgn6iqrtsihqm7ie382@google.com", "id": "4rar60trgn6iqrtsihqm7ie382", "kind": "calendar#event", "location": "Clamart, France", "organizer": { "email": "j.furic@gmail.com", "self": true }, "reminders": { "useDefault": true }, "sequence": 0, "start": { "dateTime": "2025-03-13T12:30:00+01:00", "timeZone": "Europe/Paris" }, "status": "confirmed", "summary": "Squatter chez Uller", "updated": "2025-02-25T02:12:34.559Z" }]

    let events = {}
    let marks = {}


    const addDayEvent = (event, i, numberOfDays) => {
        let newEvent = { ...event }

        const newStartingDate = moment(newEvent.startingDate).add(i, 'days').format('YYYY-MM-DD')

        newEvent.startingDate = newStartingDate

        if (i !== numberOfDays){
            newEvent.allDay = true
        }else{
            newEvent.lastDayPeriod = true
        }

        if (events[newStartingDate]) {
            events[newStartingDate].push(newEvent)
        } else {
            events[newStartingDate] = [newEvent]
        }
            
    }


    for (let item of items) {
        let event = {}

        const startingDate = moment(item.start.dateTime).format('YYYY-MM-DD')
        const startingTime = moment(item.start.dateTime).format('HH:mm')
        const endingDate = moment(item.end.dateTime).format('YYYY-MM-DD')
        const endingTime = moment(item.end.dateTime).format('HH:mm')

        const periodEvent = startingDate === endingDate ? false : true

        event.title = item.summary
        event.description = item.description
        event.location = item.location
        event.startingDate = startingDate
        event.startingTime = startingTime
        event.endingDate = endingDate
        event.endingTime = endingTime
        event.periodEvent = periodEvent



        if (periodEvent) {
            const end = moment(endingDate)
            const start = moment(startingDate)
            const numberOfDays = end.diff(start, 'days')

            for (let i = 1; i <= numberOfDays ; i++){
                addDayEvent(event, i, numberOfDays)
            }

            event.firstDayPeriod = true
        }


        if (events[startingDate]) {
            events[startingDate].push(event)
        } else {
            events[startingDate] = [event]
        }



        // console.log("log", events)
    }



    return (
        <View style={styles.body}>
            <Text>{props.title}</Text>
            <Text>{props.description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "#fffcfc",
        paddingTop: RPW(2),
        paddingLeft: RPW(1),
        paddingRight: RPW(1),
    },
})