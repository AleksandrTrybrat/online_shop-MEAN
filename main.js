const { app, BrowserWindow } = require('electron');
const path = require('path');


app.on('ready', () => {
  process.env.ELECTRON = true;
  
  const mainWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    // ! можно потом дописать код для иконки
    // подключение иконки
    icon: path.join(__dirname, './src/favicon.ico')
  });



  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });


  // ! Используем path.join для построения пути к файлу index.html, из папки dist бандл файлы
  mainWindow.loadFile(path.join(__dirname, '/dist/online-shop/index.html'));
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
