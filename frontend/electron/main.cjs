const { app, BrowserWindow } = require('electron')

function createWindow() {
    const startUrl = 'http://localhost:4173/'

    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    // window.loadFile(`${app.getAppPath()}\\dist\\index.html`) // Replace 'index.html' with the path to your React app's HTML file
    window.loadURL(startUrl)

    window.show()
    // window.webContents.openDevTools({ mode: 'detach' });
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
