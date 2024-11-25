interface LogInfo {
    ip: string;
    date: string;
    method: string;
    path: string;
    protocol: string;
    status: number;
    bytes: number;
    referer: string;
    agent: string;
    webserver: string;
    hash: string;
}

export class LogModel implements LogInfo {
    ip: string;
    date: string;
    method: string;
    path: string;
    protocol: string;
    status: number;
    bytes: number;
    referer: string;
    agent: string;
    webserver: string;
    hash: string;

    constructor() {
        this.ip = "";
        this.date =  "";
        this.method =  "";
        this.path =  "";
        this.protocol =  "";
        this.status = 0;
        this.bytes = 0;
        this.referer =  "";
        this.agent =  "";
        this.webserver = "";
        this.hash = "";
    }
}