const INDEX_OF_NOT_FOUND = -1
const defaultWriteStreamsFactory = require('./write-streams')

function create(log, writeStreams, options) {
  return log.events.add$
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
      switch (logData.level) {
      case log.levels.info:
        return writeStreams.out.write(message)
      case log.levels.warning:
        return writeStreams.err.write(message)
      case log.levels.error:
        return writeStreams.err.write(message)
      default:
        return writeStreams.err.write(message)
      }
    }
  })
  .subscribe(function handleLogSubscribe(produceLog) {
    produceLog()
  })
}

module.exports = {
  create,
  writeStreamsFactory: defaultWriteStreamsFactory
}
