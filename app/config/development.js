// TODO: Setup with a development.sh bash script that exports the defaults.
// Maybe make the file optional somehow. -MANI

/** @module config/development */

/**
* Creates a default development configuration.
* @returns {Object} The development config object.
*/
function create() {
  return {
    PORT: '3000',
    HOST: '0.0.0.0',
    LOG_LEVELS: '',
    LOG_GROUPS: ''
  }
}

module.exports = {
  create
}
