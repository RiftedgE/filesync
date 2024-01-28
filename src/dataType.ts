export type msgType = {
    msgType: 'file' | 'text',
    fileOrTextHash: string,
    timestamp: number,
    fileName?: string,
    text?: string,
    url?: string,
    action?: "add" | "delete" | "update"
    size?: number,
}

export type heartBeatType = { action: "heartBeat", salt: string };

export type actionType = {
    action: "delete" | "update",
    fileOrTextHash?: string,
}
export type socketInfoType = { "socketURL": string, "socketPORT": number, "version": string };

//---------------本地-------------

export type eventType = "deleteItem" | "msgSaved";

//---------------对外配置-------------

export type configType = { "ps1": string, "ps2": string, "http_port": number, "socket_port": number }