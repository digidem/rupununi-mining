var electron = require('electron')
var path = require('path')
var app = electron.app // Module to control application life.
var Menu = electron.Menu
var BrowserWindow = electron.BrowserWindow // Module to create native browser window.

var APP_NAME = 'Rupununi Mining'
var INDEX = 'file://' + path.join(__dirname, 'index.html')

var mainWindow

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  app.quit()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
  // Create the browser window.
  mainWindow = new BrowserWindow({title: APP_NAME})
  mainWindow.maximize()

  // and load the index.html of the app.
  mainWindow.loadURL(INDEX)
  createMenu()
  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
})

function createMenu () {
  var template
  console.log(process.platform)
  if (process.platform === 'darwin') {
    template = [
      {
        label: 'Rupununi Mining',
        submenu: [
          {
            label: 'About Rupununi Mining',
            selector: 'orderFrontStandardAboutPanel:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Hide Rupununi Mining',
            accelerator: 'Command+H',
            selector: 'hide:'
          },
          {
            label: 'Hide Others',
            accelerator: 'Command+Shift+H',
            selector: 'hideOtherApplications:'
          },
          {
            label: 'Show All',
            selector: 'unhideAllApplications:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Quit Rupununi Mining',
            accelerator: 'Command+Q',
            selector: 'performClose:'
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Cut',
            accelerator: 'Command+X',
            selector: 'cut:'
          },
          {
            label: 'Copy',
            accelerator: 'Command+C',
            selector: 'copy:'
          },
          {
            label: 'Paste',
            accelerator: 'Command+V',
            selector: 'paste:'
          },
          {
            label: 'Select All',
            accelerator: 'Command+A',
            selector: 'selectAll:'
          }
        ]
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'Command+R',
            click: function () { mainWindow.restart() }
          },
          {
            label: 'Toggle Developer Tools',
            accelerator: 'Alt+Command+I',
            click: function () { mainWindow.toggleDevTools() }
          },
          {
            type: 'separator'
          },
          {
            label: 'Toggle Full Screen',
            accelerator: 'Ctrl+Command+F',
            click: function () { mainWindow.setFullScreen(!mainWindow.isFullScreen()) }
          }
        ]
      },
      {
        label: 'Window',
        submenu: [
          {
            label: 'Minimize',
            accelerator: 'Command+M',
            selector: 'performMiniaturize:'
          }
        ]
      }
    ]

    var menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  }
}
