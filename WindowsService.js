// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------
var path = require('path');

var Service = require('node-windows').Service;
var parseArgs = require('minimist')



// -----------------------------------------------------------------------------
// Initialization
// -----------------------------------------------------------------------------
// Create service object
var svc = new Service({
  name: 'PollBot',
  description: 'HipChat bot for simple question polls and restaurant polls.',
  script: path.join(__dirname, 'PollBot.js'),
});

// Parse arguments
var argv = parseArgs(process.argv.slice(2))
var validArg = false;
var reinstallFlag = false;

// Install
if (argv['install'] === true) {
  validArg = true;
  install();
}

// Uninstall
else if (argv['uninstall'] === true) {
  validArg = true;
  uninstall();
}

// Update / reinstall
else if (argv['update'] === true || argv['reinstall'] === true) {
  validArg = true;
  reinstallFlag = true;
  uninstall();
}

// Start
else if (argv['start'] === true) {
  validArg = true;
  start();
}

// Stop
else if (argv['stop'] === true) {
  validArg = true;
  stop();
}

// Restart
else if (argv['restart'] === true) {
  validArg = true;
  start();
  stop();
}

// Invalid arguments
else if (validArg === false) {
  var usage = `Invalid arguments.
Usage:
  node WindowsServce.js --install
  node WindowsServce.js --uninstall
  
  node WindowsServce.js --start
  node WindowsServce.js --stop
  node WindowsServce.js --restart`
  console.log(usage);
}


// -----------------------------------------------------------------------------
// Event handlers
// -----------------------------------------------------------------------------
svc.on('install', function() {
  console.log('Install complete!');  
  if (svc.exists) {
    console.log('Starting service...');
    svc.start();
  }
});

svc.on('alreadyinstalled', function() {
  console.log('Service is already installed.');
  console.log('Starting service...');
  svc.start();
});

svc.on('uninstall', function() {
  console.log('Uninstall complete!');
  if (reinstallFlag) {
    install();
  }
});

svc.on('start', function() {
  console.log('Service up and running!');
});

svc.on('stop', function() {
  console.log('Service stopped!');
});

svc.on('error', function() {
  console.log('An error occurred!');
});



// -----------------------------------------------------------------------------
// Utils
// -----------------------------------------------------------------------------
function install() {
  // Safeguard
  if (svc.exists) {
    console.log('Service already installed, nothing to do.!');
    return;
  }
  
  console.log('Installing service...');
  svc.install();
}

function uninstall() {
  if (!svc.exists) {
    console.log('Service does not exist, nothing to do.');
    return;
  }
  
  console.log('Uninstalling service...');
  svc.uninstall();
}

function start() {
  // Safeguard
  if (!svc.exists) {
    console.log('Service does not exist, install it first!');
    return;
  }
  
  svc.start();
}

function stop() {
  // Safeguard
  if (!svc.exists) {
    console.log('Service does not exist, install it first!');
    return;
  }
  
  svc.stop();
}