"use client"
import { LogModel } from "@/models/log-model";
import { verifyIfSizeOfLogsIsSuspicious, verifySuspiciousActivityInPath } from "@/utils/verifyMalicious";
import { ReportModel } from '@/models/report-model';
import { downloadCSV, generateCSV } from "@/utils/generateCsv";

export default function GenerateReport({logs}: {logs: LogModel[]}) {
        
    async function handleClick() {
        let reportObject:ReportModel[] = [];
        const resultPath = verifySuspiciousActivityInPath(logs);
        const resultHighBytes = await verifyIfSizeOfLogsIsSuspicious(logs);
        reportObject = reportObject.concat(resultPath);
        reportObject = reportObject.concat(resultHighBytes);
        const csvContent = generateCSV(reportObject);
        downloadCSV(csvContent, 'report.csv');
    }
    
    return (
        <button type="button" onClick={handleClick} className="bg-cyber-blue hover:bg-cyber-green hover:text-cyber-blue text-cyber-green border-cyber-green border font-semibold py-3 px-6 rounded-lg">
         Generate Report
        </button>
    );
}