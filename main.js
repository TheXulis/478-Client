const electron = require('electron');
const url = require('url');
const path = require('path');
const https = require('https');

const {app, BrowserWindow, Menu, ipcMain} = electron;
let mainWindow;
let currentUser;

// Listen for the app to be ready
app.on('ready', function(){

    createLoginWindow();

    // Build menu from remplate
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);

    
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
        pathname: path.resolve('HTML_Files/loginWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    // Garbage collection handle
    loginWindow.on('close', function(){
        addWindow = null;
    });
}

// Handle main window
function createMainWindow(){
    // Create new window
    mainWindow = new BrowserWindow({});
    
    // Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.resolve('HTML_Files/mainWindow.html'),
        protocol: 'file',
        slashes: true,
        title: 'End2EndChat.me'
    }));

    //Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });
}

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
        pathname: path.join(__dirname, 'HTML_Files/registerWindow.html'),
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
        pathname: path.join(__dirname, 'HTML_Files/chatWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
     // Garbage collection handle
     chatWindow.on('close', function(){
        chatWindow = null;
    });
}

// Create Chat Request Window
function createRequestWindow(){
    //create new window
    requestWindow = new BrowserWindow({
        height: 200,
        width: 400,
        title:'Chat Window'
    });
    // Load html into window
    requestWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'HTML_Files/requestChat.html'),
        protocol: 'file:',
        slashes: true
    }));
     // Garbage collection handle
     requestWindow.on('close', function(){
        requestWindow = null;
    });
}

// Create Request Pop up Window for when a user receives a chat request.
function createChatNotificationWindow(other){
    //create new window
    chatNotificationWindow = new BrowserWindow({
        height: 150,
        width: 400,
        title:'Chat Window',
        skipTaskbar: true
    });
    // Load html into window
    chatNotificationWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'HTML_Files/chatNotification.html'),
        protocol: 'file:',
        slashes: true
    }));
     // Garbage collection handle
     chatNotificationWindow.on('close', function(){
        chatNotificationWindow = null;
    });

    chatNotificationWindow.requester = other;

}

// Catch log in
ipcMain.on('login:done', function(e){
    loginWindow.close();
    createMainWindow();
});

// catch register
ipcMain.on('register:user', function(e){
    registerWindow.close();
});

// catch request chat
ipcMain.on('request:other', function(e, other){
    requestWindow.close();
    //createPopUpWindow(currentUser);

    mainWindow.webContents.send('request:other', other);
});

// catch nootification for chat
ipcMain.on('notification:chat', function(e, other){
    console.log(other);
    createChatNotificationWindow(other);
});

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
                label: 'Request Chat',
                accelerator: process.platform == 'darwin' ? 'Command+Alt+C' :
                'Ctrl+Alt+C',
                click(){
                    createRequestWindow();
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
            },
            {
                label: 'Clear Local Storage',
                accelerator: process.platform == 'darwin' ? 'Command+Alt+I' :
                'Ctrl+Alt+I',
                click(){
                    mainWindow.webContents.session.clearStorageData();
                }
            }
        ]
    });
}