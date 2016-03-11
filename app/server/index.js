const http = require('http')
const SocketIo = require('socket.io')
const log = require('../components/log')
const userFactory = require('../components/user')
const logConsumerConsole = require('../components/log-consumer-console')
const socketConnectionFactory = require('./socket-connection')
const configFactory = require('../config')
const eventsFactory = require('./interactions/events')
const actionsFactory = require('./interactions/actions')

function closeFactory(server) {
  return function close () {
    return new Promise(function handleDestroyPromise(resolveClose) {
      server.close(function handleClose() {
        log.events.add(
          log.levels.info,
          log.groups.httpServer,
          'Server closed'
        )
        resolveClose()
      })
    })
  }
}

function httpServerListen(httpServer, port, host) {
  return new Promise(function handleCreatePromise(resolve) {
    httpServer.listen(
      port,
      host,
      function handleServerListen() {
        log.events.add(
          log.levels.info,
          log.groups.httpServer,
          'Listening on ' +
          `[${httpServer.address().address}:${httpServer.address().port}]`
        )
        resolve()
      }
    )
  })
}

function createSetupIoServerFn(httpServer, event$, actions, logModule) {
  return function handleThenSetupIoServer() {
    const ioServer = SocketIo.listen(httpServer)
    ioServer.on(
      'connection',
      socketConnectionFactory.create(event$, actions, logModule)
    )
  }
}

function create() {
  const config = configFactory.create(log)
  logConsumerConsole.create(log, config.LOG_LEVELS, config.LOG_GROUPS)
  log.events.add(
    log.levels.info,
    log.groups.httpServer,
    `Server starting with NODE_ENV: [${process.env.NODE_ENV}]`
  )
  // TODO: Obfuscate values before logging. -MANI
  const JSON_SPACING = 2
  log.events.add(
    log.levels.info,
    log.groups.httpServer,
    `Config loaded with values: \n` +
    `CONFIG START\n${JSON.stringify(config, null, JSON_SPACING)}\nCONFIG END`
  )
  const httpServer = http.createServer()
  const user = userFactory.create()
  const events = eventsFactory.create([user.events.event$Collection])
  const actions = actionsFactory.create(user.actions)
  events.event$.subscribe(function logEvent(eventData) {
    log.events.add(
      log.levels.info,
      log.groups.event,
      JSON.stringify(eventData, null, JSON_SPACING)
    )
  })
  return httpServerListen(httpServer, config.PORT, config.HOST)
  .then(
    createSetupIoServerFn(
      httpServer,
      events.event$,
      actions,
       log
    )
  )
  .then(function handleThenReturnServerData() {
    return {
      httpServer,
      close: closeFactory(httpServer),
      config
    }
  })
}

module.exports = {
  create
}
