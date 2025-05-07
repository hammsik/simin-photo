import { ipcMain, desktopCapturer, app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
let liveViewWin = null;
function createLiveWindow() {
  const cameraWin = new BrowserWindow({
    width: 1024,
    height: 768,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    transparent: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      // 화면 캡쳐를 위해 필요한 설정
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: true
      // remote 모듈 활성화
    }
  });
  cameraWin.webContents.session.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      if (permission === "media") {
        return callback(true);
      }
      callback(false);
    }
  );
  const url = VITE_DEV_SERVER_URL ? `${VITE_DEV_SERVER_URL}#/live` : `file://${path.join(RENDERER_DIST, "index.html")}#/camera`;
  cameraWin.loadURL(url);
  liveViewWin = cameraWin;
  ipcMain.on("image-captured", (_, imageUrl) => {
    if (win && !win.isDestroyed()) {
      win.webContents.send("image-captured", imageUrl);
    }
  });
}
ipcMain.on("refresh-live-view", () => {
  if (liveViewWin && !liveViewWin.isDestroyed()) {
    liveViewWin.reload();
  }
});
ipcMain.on("open-camera-window", () => {
  createLiveWindow();
});
ipcMain.handle("capture-screen", async () => {
  const sources = await desktopCapturer.getSources({
    types: ["screen"],
    thumbnailSize: { width: 1920, height: 1080 }
    // 원하는 크기로 조정
  });
  return sources;
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
