const electron = require('electron');
const url = require('url');
const path = require('path');
const https = require('https');

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
        width: 400,
        height: 300,
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
    loginWindow.close();
    mainWindow.webContents.send('login:user', user);
    
});

ipcMain.on('auth:token', function(e, token){
    if(token == null){
        createLoginWindow();
    }
    else{

    }
});

// Create Registration Window
function createRegisterWindow(){
    //create new window
    registerWindow = new BrowserWindow({
        height: 400,
        width: 300,
        tutle:'Register as a New User'
    });
    // Load html into window
    registerWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'registerWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
     // Garbage collection handle
     registerWindow.on('close', function(){
        registerWindow = null;
    });
}

// catch register

// Create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Register',
                click(){
                    createRegisterWindow();
                }
            },
            {
                label: 'Open Chat'
            },
            {
                label: 'Get Users',
                click(){
                    mainWindow.webContents.send('users');
                }
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