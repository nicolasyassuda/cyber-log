import { LogModel } from "./log-model";

interface ReportInfo {
    suspicious: boolean;
    type: string;
    log: LogModel;
}

export class ReportModel implements ReportInfo {
    suspicious: boolean;
    type: string;
    log: LogModel;

    constructor() {
        this.suspicious = false;
        this.type = "";
        this.log = new LogModel();
    }
}