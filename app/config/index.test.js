const configFactory = require('./index')
const rootTest = require('tap').test

/* eslint-disable max-statements */
rootTest('config', function onConfigTest(test) {
  /* eslint-enable max-statements */
  const config = configFactory.create()
  const configKeys = Object.keys(config)
  test.strictEquals(
    configFactory.PREFIX,
    'RSRV_',
    'should have prefix "RSRV_"'
  )
  test.strictEquals(
    Boolean(process.env.NODE_ENV.length),
    true,
    'should require a value for NODE_ENV'
  )
  test.strictEquals(
    Boolean(config.PORT.length),
    true,
    'should require a value for PORT'
  )
  test.strictEquals(
    Boolean(config.HOST.length),
    true,
    'should require a value for HOST'
  )
  const INDEX_OF_NOT_FOUND = -1
  test.strictEquals(
    configKeys.indexOf('LOG_LEVELS') !== INDEX_OF_NOT_FOUND,
    true,
    'should have config variable LOG_LEVELS'
  )
  test.strictEquals(
    configKeys.indexOf('LOG_GROUPS') !== INDEX_OF_NOT_FOUND,
    true,
    'should have config variable LOG_GROUPS'
  )
  test.strictEquals(
    configKeys.indexOf('SENTRY') !== INDEX_OF_NOT_FOUND,
    true,
    'should have config variable SENTRY'
  )
  test.strictEquals(
    configKeys.indexOf('SENDGRID') !== INDEX_OF_NOT_FOUND,
    true,
    'should have config variable SENDGRID'
  )
  test.strictEquals(
    configKeys.indexOf('AUTHY') !== INDEX_OF_NOT_FOUND,
    true,
    'should have config variable AUTHY'
  )
  const EXPECTED_CONFIG_LENGTH = 7
  test.strictEquals(
    configKeys.length,
    EXPECTED_CONFIG_LENGTH,
    'should have the right number of config variables'
  )
  test.done()
})
