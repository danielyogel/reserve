// TODO: Remove duplicate code (original in backend). -MANI
import Rx from 'rxjs'

function create(events, namespace) {
  const eventKeys = Object.keys(events)
  const eventsArray = eventKeys.map(function handleEventKeyMap(eventKey) {
    return events[eventKey].map(function handleEvent$Map(actionData) {
      return {
        header: {
          namespace,
          eventName: eventKey
        },
        body: actionData
      }
    })
  })
  const event$ = Rx.Observable.merge(...eventsArray)
  return Object.assign({}, events, {event$})
}

export default {
  create
}
