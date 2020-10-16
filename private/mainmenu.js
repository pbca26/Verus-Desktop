const { Menu } = require('electron');
const electron = require('electron');
const app = electron.app;
const { shell, dialog } = require('electron');
const {
  pathsAgama,
  pathsDaemons,
} = require('../routes/api/pathsUtil');
const path = require('path')
const fs = require('fs');
const { createFetchBoostrapWindow } = require('../routes/children/fetch-bootstrap/window');
const { appConfig } = require('../routes/api');

const template = [
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'pasteandmatchstyle'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.reload();
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.webContents.toggleDevTools();
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'help',
    label: 'Help',
    submenu: [
      // TODO: Reimplement
      //{
      //  label: 'Reset settings',
      //  click (item, focusedWindow) {
      //    focusedWindow.resetSettings();
      //  }
      //},
      {
        label: 'Join our Discord',
        click (item, focusedWindow) {
          shell.openExternal('https://discord.gg/VRKMP2S');
        }
      },
      {
        label: 'Verus Wiki',
        click (item, focusedWindow) {
          shell.openExternal('https://wiki.veruscoin.io/#!index.md');
        }
      },
      // ref: https://github.com/sindresorhus/new-github-issue-url
      {
        label: 'Add Github issue',
        click (item, focusedWindow) {
          shell.openExternal('https://github.com/VerusCoin/Verus-Desktop/issues/new?body=Please+describe+your+issue+in+detail.+Attach+screenshots+if+you+can,+they+help+a+lot.');
        }
      },
      {
        label: 'Show Verus Desktop Wallet data folder',
        click (item, focusedWindow) {
          shell.openItem(pathsAgama().paths.agamaDir);
        }
      },
      {
        label: 'Show Verus data folder (default)',
        click (item, focusedWindow) {
          shell.openItem(pathsDaemons().paths.vrscDir);
        }
      },
      {
        label: 'Show binary folder',
        click (item, focusedWindow) {
          shell.openItem(pathsDaemons().paths.komodocliDir);
        }
      },
      {
        label: 'Bootstrap VRSC',
        click (item, focusedWindow) {
          createFetchBoostrapWindow('VRSC', appConfig)
        }
      },
      /*{
        label: global.USB_MODE ? 'Disable USB Mode' : 'Enable USB Mode',
        click (item, focusedWindow) {
          const verusIcon = path.join(__dirname, '../assets/icons/vrsc_256x256x32.png');

          try {
            const rootLocation = path.join(__dirname, '../');
            const location = `${rootLocation}version`
            const localVersionFile = fs.readFileSync(location, 'utf8');
            let localVersion = localVersionFile.split(localVersionFile.indexOf('\r\n') > -1 ? '\r\n' : '\n');
  
            localVersion[2] = global.USB_MODE ? "mode=standard" : "mode=usb"
  
            fs.writeFileSync(location, localVersion.join('\n'))

            dialog.showMessageBox({
              icon: verusIcon,
              title: "Success",
              message: `${
                global.USB_MODE ? "Disabled" : "Enabled"
              } USB mode, restart Verus Desktop for changes to take effect.`,
            });
          } catch(e) {
            console.log(e)
            dialog.showMessageBox({
              icon: verusIcon,
              type: "error",
              title: "Error",
              message: `Failed to ${
                global.USB_MODE ? "disable" : "enable"
              } USB mode.`,
            });
          }
        }
      }*/,
    ]
  }
];

if (process.platform === 'darwin') {
  const name = app.getName();

  template.unshift({
    label: name,
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        role: 'close'
      }
    ]
  });
  // Edit menu.
  template[1].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    }
  );
  // Window menu.
  template[3].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);