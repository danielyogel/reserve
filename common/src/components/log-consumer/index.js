import Rx from 'rxjs'
import defaultWriteStreamsFactory from './write-streams'

const INDEX_OF_NOT_FOUND = -1

function create(log, writeStreams, options) {
  return Rx.Observable.merge(
    log.events.info$,
    log.events.warning$,
    log.events.error$
  )
  .filter(function handleLevelsFilter(logData) {
    return !options.levelsFilter ||
    options.levelsFilter
    .split(',')
    .indexOf(logData.level) !== INDEX_OF_NOT_FOUND
  })
  .filter(function handleGroupsFilter(logData) {
    return !options.groupsFilter ||
      options.groupsFilter
      .split(',')
      .indexOf(logData.group) !== INDEX_OF_NOT_FOUND
  })
  .map(function functionName(logData) {
    return function produceLog() {
      const FIRST_LETTER = 0
      const message =
        `\n[${logData.level[FIRST_LETTER]}]` +
        `[${logData.group}]:` +
        ` ${logData.message}\n`
      // TODO: Redo for each stream (info$, warning$, error$). -MANI
      switch (logData.level) {
      case log.levels.info:
        return writeStreams.out.write(message)
      case log.levels.warning:
        return writeStreams.error.write(message)
      case log.levels.error:
        return writeStreams.error.write(message)
      default:
        return writeStreams.error.write(message)
      }
    }
  })
  .subscribe(function handleLogSubscribe(produceLog) {
    produceLog()
  })
}

export default {
  create,
  writeStreamsFactory: defaultWriteStreamsFactory
}
