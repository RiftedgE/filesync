import { Pool } from "../../common/Pool";
import { AlertType } from "../config/ClientDefine";
import { Config } from "../config/Config";
import { HtmlControl } from "../config/HtmlControl";
import { Utils } from "../utils/Utils";

export class TipsMgr {
    private static _body: HTMLElement;
    private static get body() {
        if (!TipsMgr._body) {
            TipsMgr._body = document.body;
        }
        return TipsMgr._body;
    }

    private static myAlert: Alert;
    private static myDialog: Dialog;
    private static myTips: Notice;
    private static myProgress: Progress;
    private static imgPreview: ImgPreview;
    private static videoPreview: VideoPreview;
    private static audioPreview: AudioPreview;

    /**预览音频 */
    static showAudioPreview(audioUrl: string) {
        if (!this.audioPreview) {
            this.audioPreview = new AudioPreview(this.body);
        }
        this.audioPreview.show(audioUrl);
    }

    /**预览一张图片 */
    static showImgPreview(imgUrl: string) {
        if (!this.imgPreview) {
            this.imgPreview = new ImgPreview(this.body);
        }
        this.imgPreview.show(imgUrl);
    }

    /**预览视频 */
    static showVideoPreview(videoUrl: string) {
        if (!this.videoPreview) {
            this.videoPreview = new VideoPreview(this.body);
        }
        this.videoPreview.show(videoUrl);
    }

    /**显示一个提示 */
    static showNotice(msg: string) {
        if (!this.myTips) {
            this.myTips = new Notice(this.body);
        }
        this.myTips.show(msg);
    }

    /**显示一个对话框 */
    static showDialog(content: string, caller: any, sure: Function | null, cancel: Function | null, title: string = "提示", onlySure: boolean = false) {
        if (!this.myDialog) {
            this.myDialog = new Dialog(this.body);
        }
        this.hideAll();
        this.myDialog.show(content, caller, sure, cancel, title, onlySure);
    }

    /**隐藏对话框 */
    static hideDialog() {
        if (this.myDialog) {
            this.myDialog.close();
        }
    }

    /**显示一个提示框 */
    static showAlert(content: string, title: string = "提示", type: AlertType = AlertType.text, caller: any = null, callback: Function | null = null) {
        if (!this.myAlert) {
            this.myAlert = new Alert(this.body);
        }
        this.myAlert.show(content, title, type, caller, callback);
    }

    /**隐藏提示框 */
    static hideAlert() {
        if (this.myAlert) {
            this.myAlert.close();
        }
    }

    /**显示进度条 */
    static showProgress(value: number, autoClose: boolean = false) {
        if (!this.myProgress) {
            this.myProgress = new Progress(this.body);
        }
        this.myProgress.show(value, autoClose);
    }

    /**隐藏进度条 */
    static hideProgress() {
        if (this.myProgress) {
            this.myProgress.close();
        }
    }

    /**隐藏所有提示 */
    static hideAll() {
        this.hideDialog();
        this.hideAlert();
        this.hideProgress();
    }
}

class UIControl {
    init(): void { };
    show(...args: any[]): void { };
    close(): void { };
}

class Dialog extends UIControl {
    private parent: HTMLElement;
    private dialog: HTMLDialogElement;
    private dialogTitle: HTMLHeadingElement;
    private dialogContent: HTMLParagraphElement;
    private dialogSureButton: HTMLAnchorElement;
    private dialogCancelButton: HTMLAnchorElement;
    private dialogCloseButton: HTMLButtonElement;
    private _caller: any;
    private _sure: Function | null;
    private _cancel: Function | null;

    constructor(parent: HTMLElement) {
        super();
        this.parent = parent;
        this.init();
    }

    init() {
        this.dialog = Utils.createConnonControl(this.parent, HtmlControl.myDialog, "myDialog") as HTMLDialogElement;
        this.dialogTitle = this.dialog.querySelector("article header p strong")!;
        this.dialogContent = this.dialog.querySelectorAll("article p")[1]! as HTMLParagraphElement;
        this.dialogCancelButton = this.dialog.querySelector("article footer button:first-child")!;
        this.dialogSureButton = this.dialog.querySelector("article footer button:last-child")!;
        this.dialogCloseButton = this.dialog.querySelector("article header button")!;

        this.dialogSureButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.dialog.close();
            this._sure?.call(this._caller);
            this._sure = null;
            this._caller = null;
        });

        this.dialogCancelButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.dialog.close();
            this._cancel?.call(this._caller);
            this._cancel = null;
            this._caller = null;
        });

        this.dialogCloseButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.dialog.close();
            this._cancel?.call(this._caller);
            this._cancel = null;
            this._caller = null;
        });
    }

    show(content: string, caller: any, sure: Function | null, cancel: Function | null, title: string = "提示", onlySure: boolean = false) {
        this._caller = caller;
        this._sure = sure;
        this._cancel = cancel;
        this.dialogTitle.innerText = title;
        this.dialogContent.innerText = content;
        if (onlySure) {
            this.dialogCancelButton.style.display = "none";
            this.dialogCloseButton.style.display = "none";
        } else {
            this.dialogCancelButton.style.display = "inline-block";
            this.dialogCloseButton.style.display = "inline-block";
        }
        if (this.dialog.open) {
            this.dialog.close();
        }
        this.dialog.showModal();
    }

    close() {
        this.dialog.close();
        this._caller = null;
        this._sure = null;
        this._cancel = null;
    }
}

class Alert extends UIControl {
    private parent: HTMLElement;
    private qrcodeDiv: HTMLImageElement;
    private imgQrCode: HTMLImageElement;
    private dialog: HTMLDialogElement;
    private dialogTitle: HTMLHeadingElement;
    private dialogContent: HTMLParagraphElement;
    private dialogCloseButton: HTMLButtonElement;
    private _caller: any;
    private _callback: Function | null;

    constructor(parent: HTMLElement) {
        super();
        this.parent = parent;
        this.init();
    }

    init() {
        this.dialog = Utils.createConnonControl(this.parent, HtmlControl.myAlert, "myAlert") as HTMLDialogElement;
        this.qrcodeDiv = this.dialog.querySelector('#qrcodeDiv') as HTMLImageElement;
        this.imgQrCode = this.dialog.querySelector("#qrcodeImg") as HTMLImageElement;
        this.dialogTitle = this.dialog.querySelector("article header p strong")!;
        this.dialogContent = this.dialog.querySelectorAll("article p")[1]! as HTMLParagraphElement;
        this.dialogCloseButton = this.dialog.querySelector("article header button")!;
        this.dialogCloseButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.dialog.close();
            this._callback?.call(this._caller);
            this._callback = null;
            this._caller = null;
        });
    }

    show(content: string, title: string = "提示", type: AlertType = AlertType.text, caller: any = null, callback: Function | null = null) {
        this._caller = caller;
        this._callback = callback;
        this.dialogTitle.innerText = title;
        if (type == AlertType.text) {
            this.dialogContent.style.display = "block";
            this.dialogContent.innerText = content;
            this.qrcodeDiv.className = HtmlControl.hideQrcodeDivClass;
            if (this.imgQrCode) {
                this.imgQrCode.style.display = "none";
            }
        } else if (type == AlertType.qrcode) {
            this.dialogContent.innerText = "";
            this.qrcodeDiv.className = HtmlControl.showQrcodeDivClass;
            if (this.dialogContent) {
                this.dialogContent.style.display = "none";
            }
            if (this.imgQrCode) {
                Utils.createQRCode(content)
                    .then((url) => {
                        this.imgQrCode.src = url;
                        this.imgQrCode.style.display = "block";
                    })
                    .catch((err) => {
                        this.show(content, title, AlertType.text, caller, callback);
                        console.error(err);
                    });
            }
        }
        if (this.dialog.open) {
            this.dialog.close();
        }
        this.dialog.showModal();
    }

    close() {
        this.dialog.close();
        this._caller = null;
        this._callback = null;
    }
}

class Notice extends UIControl {
    private parent: HTMLElement;
    private showIngTips: HTMLElement[];
    private tipsPool: Pool<HTMLElement>;

    constructor(parent: HTMLElement) {
        super();
        this.parent = parent;
        this.showIngTips = [];
        this.tipsPool = new Pool<HTMLElement>(this.createTips);
    }

    show(msg: string) {
        let tips = this.tipsPool.get();
        this.showIngTips.push(tips);
        this.parent.appendChild(tips);
        tips.innerText = msg;
        let self = this;
        (<any>tips)["startTime"] = setTimeout(() => {
            tips.style.top = '30%';
            tips.style.opacity = '0';
            (<any>tips)["holdTime"] = setTimeout(() => {
                self.recoverTips(tips);
            }, 1000);
        }, 1000);
    }

    close(): void {
        this.showIngTips.forEach((tips) => {
            this.recoverTips(tips);
        });
    }

    private createTips(): HTMLElement {
        let tips = Utils.createControlByHtml(HtmlControl.tipsComponent) as HTMLElement;
        return tips;
    }

    private recoverTips(tips: HTMLElement) {
        if (this.parent.contains(tips)) {
            this.parent.removeChild(tips);
        }
        if ((<any>tips)["startTime"]) {
            clearTimeout((<any>tips)["startTime"]);
            clearTimeout((<any>tips)["holdTime"]);
            (<any>tips)["startTime"] = null;
            (<any>tips)["holdTime"] = null;
        }
        tips.innerText = "";
        this.tipsPool.recycle(tips);
    }
}

class Progress extends UIControl {
    private parent: HTMLElement;
    private progress: HTMLDialogElement;
    private progressCard: HTMLElement;
    private progressValue: HTMLProgressElement;
    private myProgressText: HTMLSpanElement;

    constructor(parent: HTMLElement) {
        super();
        this.parent = parent;
        this.init();
    }

    init() {
        this.progress = Utils.createConnonControl(this.parent, HtmlControl.myProgress, "myProgress") as HTMLDialogElement;
        this.progressCard = this.progress.querySelector('#myProgressCard') as HTMLDListElement;
        this.progressValue = this.progress.querySelector('#myProgressValue') as HTMLProgressElement;
        this.myProgressText = this.progress.querySelector('#myProgressText') as HTMLSpanElement;

        this.progressCard.style.position = 'fixed';
        this.progressCard.style.left = '50%';
        this.progressCard.style.top = '50%';
        this.progressCard.style.transform = 'translate(-50%, -50%)';
        this.progressCard.style.width = "30%";
    }

    show(value: number, autoClose: boolean = false) {
        value = value * 100;
        value = value > 99.9 ? 99.9 : value;
        value = value < 0 ? 0 : value;
        this.progressValue.value = value;
        this.myProgressText.textContent = `文件上传中，进度：${value.toFixed(1)}%`;
        if (!this.progress.open) {
            this.progress.showModal();
        }
        if (autoClose) {
            if (value >= 99.9) {
                this.close();
            }
        }
    }

    close() {
        this.myProgressText.textContent = "0%";
        this.progressValue.value = 0;
        this.progress.close();
    }
}

class ImgPreview extends UIControl {
    private parent: HTMLElement;
    private dialog: HTMLDialogElement;
    private img: HTMLImageElement;
    private dialogCloseButton: HTMLButtonElement;

    constructor(parent: HTMLElement) {
        super();
        this.parent = parent;
        this.init();
    }

    init() {
        this.dialog = Utils.createConnonControl(this.parent, HtmlControl.alertImgPreview, "alertImgPreview") as HTMLDialogElement;
        this.img = this.dialog.querySelector('#imgPreview') as HTMLImageElement;
        this.dialogCloseButton = this.dialog.querySelector("article header button")!;

        this.dialogCloseButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.close()
        });
    }

    show(imgUrl: string) {
        this.img.src = imgUrl;
        if (this.dialog.open) {
            this.dialog.close();
        }
        this.dialog.showModal();
    }

    close() {
        this.dialog.close();

        this.img.src = Config.defaultImg;
    }
}

class VideoPreview extends UIControl {
    private parent: HTMLElement;
    private dialog: HTMLDialogElement;
    private video: HTMLVideoElement;
    private dialogCloseButton: HTMLButtonElement;

    constructor(parent: HTMLElement) {
        super();
        this.parent = parent;
        this.init();
    }

    init() {
        this.dialog = Utils.createConnonControl(this.parent, HtmlControl.alertVideoPreview, "alertVideoPreview") as HTMLDialogElement;
        this.video = this.dialog.querySelector('#videoPreview') as HTMLVideoElement;
        this.dialogCloseButton = this.dialog.querySelector("article header button")!;

        this.dialogCloseButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.close();
        });
    }

    show(videoUrl: string) {
        this.video.src = videoUrl;
        this.video.play();
        if (this.dialog.open) {
            this.dialog.close();
        }
        this.dialog.showModal();
    }

    close() {
        this.dialog.close();
        this.video.currentTime = 0;
        this.video.pause();
        this.video.src = "";
        this.video.poster = Config.defaultImg;
    }
}

class AudioPreview extends UIControl {
    private parent: HTMLElement;
    private dialog: HTMLDialogElement;
    private audio: HTMLAudioElement;
    private dialogCloseButton: HTMLButtonElement;

    constructor(parent: HTMLElement) {
        super();
        this.parent = parent;
        this.init();
    }

    init() {
        this.dialog = Utils.createConnonControl(this.parent, HtmlControl.alertAudioPreview, "alertAudioPreview") as HTMLDialogElement;
        this.audio = this.dialog.querySelector('#audioPreview') as HTMLAudioElement;
        this.dialogCloseButton = this.dialog.querySelector("article header button")!;

        this.dialogCloseButton.addEventListener('click', (event) => {
            event.preventDefault();
            this.dialog.close();
        });
    }

    show(audioUrl: string) {
        this.audio.src = audioUrl;
        if (this.dialog.open) {
            this.dialog.close();
        }
        this.dialog.showModal();
    }

    close() {
        this.audio.currentTime = 0;
        this.audio.pause();
        this.dialog.close();
    }
}