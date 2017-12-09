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
        slashes: true,
        title: 'End2EndChat.me'
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
        width: 600,
        height: 600,
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

// Catch log in
ipcMain.on('login:user', function(e, user){
    loginWindow.close();
    mainWindow.webContents.send('login:user', user);
    
});

// catch register
ipcMain.on('register:user', function(e, user){
    //registerWindow.close();
    
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
        height: 600,
        width: 600,
        title:'Register as a New User'
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

// Create Chat Window
function createChatWindow(){
    //create new window
    chatWindow = new BrowserWindow({
        height: 600,
        width: 600,
        title:'Chat Window'
    });
    // Load html into window
    chatWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'chatWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
     // Garbage collection handle
     chatWindow.on('close', function(){
        chatWindow = null;
    });
}


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
                label: 'Open Chat',
                click(){
                    createChatWindow();
                }
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