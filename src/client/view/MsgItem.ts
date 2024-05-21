import { MsgData } from "../../common/CommonDefine";
import { EventMgr } from "../../common/EventMgr";
import { BtnEvent } from "../config/ClientDefine";
import { HtmlControl } from "../config/HtmlControl";
import { Utils } from "../utils/Utils";

export class MsgItem {
    private form: HTMLFormElement;
    private txtNameOrText: HTMLParagraphElement;
    private txtDate: HTMLParagraphElement;
    private btnDownload: HTMLButtonElement;
    private btnCopy: HTMLButtonElement;
    private btnDel: HTMLButtonElement;
    private data: MsgData | null;
    private maxTextLength = 30;
    constructor() {

    }

    initItem(parent: HTMLElement) {
        if (!this.form) {
            this.form = Utils.createControlByHtml(HtmlControl.fileItem) as HTMLFormElement;
            this.txtNameOrText = this.form.querySelector('p') as HTMLParagraphElement;
            this.txtDate = this.form.querySelector('div small') as HTMLParagraphElement;
            this.btnDownload = this.form.querySelector('div .downloadFile') as HTMLButtonElement;
            this.btnCopy = this.form.querySelector('div .copyMsg') as HTMLButtonElement;
            this.btnDel = this.form.querySelector('div .deleteMsg') as HTMLButtonElement;
        }
        this.setMyParnet(parent);

        this.addEvent();
    }
    addEvent() {
        this.btnDownload.addEventListener('click', this.downloadFile.bind(this));
        this.btnCopy.addEventListener('click', this.copyData.bind(this));
        this.btnDel.addEventListener('click', this.deleteData.bind(this));
    }
    removeEvent() {
        this.btnDownload.removeEventListener('click', this.downloadFile);
        this.btnCopy.removeEventListener('click', this.copyData);
        this.btnDel.removeEventListener('click', this.deleteData);
    }

    downloadFile(): void {
        EventMgr.emit(BtnEvent.downloadFile, this.data!.url, this.data!.fileName);
    }

    copyData() {
        if (this.data) {
            if (this.data.fileName) {
                Utils.copyText(this.data.fileName);
            } else {
                Utils.copyText(this.data.text!);
            }
        }
    }

    deleteData(): void {
        EventMgr.emit(BtnEvent.deleteItem, this.data!.fileOrTextHash!);
    }

    setData(data: MsgData, parent: HTMLElement): void {
        this.data = data;
        this.initItem(parent);

        // 显示 text 或 filename
        if (data.fileName) {
            let str = data.fileName;
            if (str.length > this.maxTextLength) {
                let index = str.lastIndexOf('.');
                if (index > 0) {
                    let ext = str.slice(index);
                    str = str.slice(0, this.maxTextLength - ext.length) + '[...]' + ext;
                } else {
                    str = str.slice(0, this.maxTextLength - 6) + '[...]' + str.slice(-6);
                }
            }
            this.txtNameOrText.textContent = str;
        } else {
            let str = data.text!;
            if (str.length > this.maxTextLength) {
                str = str.slice(0, this.maxTextLength) + '[...]';
            }
            this.txtNameOrText.textContent = str;
        }

        if (data.msgType === 'file') {
            this.btnDownload.style.display = 'block';
            this.btnCopy.style.display = 'none';
        } else {
            this.btnDownload.style.display = 'none';
            this.btnCopy.style.display = "block"
        }

        if (data.size != void 0 && data.size > 0) {
            this.txtNameOrText.setAttribute("data-tooltip", "文件大小：" + Utils.formatSize(data.size));
            this.txtNameOrText.style.borderBottom = 'none';
        } else {
            this.txtNameOrText.removeAttribute("data-tooltip");
        }

        // 显示时间戳
        this.txtDate.textContent = Utils.formatTime(data.timestamp);
    }


    clear(): void {
        this.data = null;
        this.form?.parentNode?.removeChild(this.form);
        this.removeEvent();
    }

    setMyParnet(parent: HTMLElement) {
        if (parent && this.form) {
            parent.insertBefore(this.form, parent.firstChild);
        }
    }
}