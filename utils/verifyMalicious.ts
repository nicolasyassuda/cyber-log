import { getMeanBytesOfLogs } from "@/lib/logs/logs";
import { LogModel } from "@/models/log-model";
import { ReportModel } from "@/models/report-model";

export function verifySuspiciousActivityInPath(logs:LogModel[]): ReportModel[] {
    let suspiciousActivity = false;
    let fator = '';
    let suspiciousLogs:ReportModel[] = [];
    const patterns = [
        { type: 'SQL Injection', regex: /(UNION\s+SELECT|SELECT\s+\*|DROP\s+TABLE)/i },
        { type: 'XSS Attack', regex: /(<script>|%3Cscript%3E)/i },
        { type: 'Directory Traversal', regex: /(\.\.\/|\.\.\\)/i },
        { type: 'Brute Force', regex: /(login|admin)/i },
        { type: 'File Inclusion', regex: /(etc\/passwd|boot\.ini)/i },
    ];

    for (const log of logs) {
        for (const pattern of patterns) {
            if (log.path.match(pattern.regex)) {
                suspiciousLogs.push({suspicious:true,type:pattern.type,log:log});
                break;
            }
        }
    }

    return suspiciousLogs;
}

export async function verifyIfSizeOfLogsIsSuspicious(logs:LogModel[]): Promise<ReportModel[]> {
    let suspiciousActivity = false;
    let fator = '';
    let suspiciousLogs:ReportModel[] = [];
    let medianBytesOfWebsite = await getMeanBytesOfLogs();
    for (const log of logs) {
        if (log.bytes > medianBytesOfWebsite) {
            suspiciousLogs.push({suspicious:true,type:'Large Bytes Buffer',log:log});
        }
    }

    return suspiciousLogs;
}