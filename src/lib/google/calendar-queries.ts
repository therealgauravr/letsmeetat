

/**
 * As advertised
 */
export async function createMeetAndReturnLink(email: string) : Promise<string> {
    const event = {
        'summary': 'Dummy Event',
        'location': 'The matrix',
        'description': 'dummy event',
        'start': {
          'dateTime': '2023-01-28T09:00:00-07:00',
          'timeZone': 'America/Los_Angeles'
        },
        'end': {
          'dateTime': '2023-01-28T17:00:00-07:00',
          'timeZone': 'America/Los_Angeles'
        },
        'attendees': [
          {'email': email},
        ],
        // 'reminders': {
        //   'useDefault': false,
        //   'overrides': [
        //     {'method': 'email', 'minutes': 24 * 60},
        //     {'method': 'popup', 'minutes': 10}
        //   ]
        // }
      };
      
      const calendarEvent = (await gapi.client.calendar.events.insert({
        'calendarId': 'primary',
        'resource': event
      })).result;


        const eventPatch = {
            conferenceData: {
                createRequest: {
                    requestId: Math.random().toString(),
                    conferenceSolutionKey: {
                      type: 'hangoutsMeet'
                    },
                  }

            }
          };
          
          const meetLink = (await gapi.client.calendar.events.patch({
            calendarId: "primary",
            eventId: calendarEvent.id,
            resource: eventPatch,
            sendNotifications: true,
            conferenceDataVersion: 1
          })).result.hangoutLink;


        const deleteResult = (await gapi.client.calendar.events.delete({
            calendarId: 'primary',
            eventId: calendarEvent.id
          })).result;


          return meetLink;

      
}