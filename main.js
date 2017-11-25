const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

// Listen for the app to be ready
app.on('ready', function(){
    // Create new window
    mainWindow = new BrowserWindow({});
    
    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.resolve('./mainWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    //Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    // Build menu from remplate
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);

    createLoginWindow();
});

// Handle login window
function createLoginWindow(){
    // Create new window
    loginWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Enter Username'
    });
    
    // Load html into window
    loginWindow.loadURL(url.format({
        pathname: path.resolve('./loginWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    // Garbage collection handle
    loginWindow.on('close', function(){
        addWindow = null;
    });
}

// Catch username
ipcMain.on('login:user', function(e, user){
    mainWindow.webContents.send('login:user', user);
    loginWindow.close();
});

// Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Register'
            },
            {
                label: 'Open Chat'
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' :
                'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

// If mac, add an empty object to the menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

// Add developer tools item if not in prod
if(process.env.Node_ENV != 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' :
                'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role:'reload'
            }
        ]
    });
}