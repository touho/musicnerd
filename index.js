require('./server/webserver')
require('./server/connection')

// Require midi here so that midi devices are ready & validated at the start up
require('./server/midi')
