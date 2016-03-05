require('../config')
const rootTest = require('tap').test
const serverCreate = require('../server')
const ioClient = require('socket.io-client')
const socketURL = `http://${process.env.HOST}:${process.env.PORT}`
const options = {
  transports: ['websocket'],
  'force new connection': true
}

rootTest('server', function handleTape(test) {
  return new Promise(function handlePromise(resolve, reject) {
    serverCreate.create()
    .then(function handleCreateThen(serverData) {
      const socket = ioClient(socketURL, options)

      socket.on('connect', function handleConnect() {
        socket.disconnect()
        test.pass('Client connected.')
      })

      socket.on('error', function handleData(err) {
        reject(err)
        serverData.close()
      })

      socket.on('disconnect', function handleClose() {
        test.pass('Client disconnected.')
        serverData.close()
        resolve()
      })
    })
  })
})
