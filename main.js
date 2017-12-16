const electron = require('electron');
const { app, BrowserWindow, Menu, ipcMain } = electron;
const url = require('url');
const path = require('path');

// set env
process.env.NODE_ENV = 'production'

let mainWindow;
let addWindow;

app.on('ready', () => {

    // create new main window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    // loading the initial html page
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Quit app when closed
    mainWindow.on('closed', () => {
        app.quit();
    });

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    // Insert menu
    Menu.setApplicationMenu(mainMenu);

});

// Handle create add window
function createAddWindow() {
    // create new main window
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Shopping List Item'
    });

    // loading the initial html page
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Garbage collection handle
    addWindow.on('close', () => {
        addWindow = null;
    });

}

// catck item:add
ipcMain.on('item:add', (e, item) => {
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
});

// create main menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Item',
                click() {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q' ,
                click() {
                    app.quit();
                }
            }
        ]
    }
];

// If mac add empty obj to menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// add developer tools item if not in production
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}
