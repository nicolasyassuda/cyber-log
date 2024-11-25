import { ReportModel } from "@/models/report-model";

export function generateCSV(reports: ReportModel[]): string {
    // Achatando os dados
    const flattenedData = reports.map(report => ({
        suspicious: report.suspicious,
        type: report.type,
        ip: report.log.ip,
        date: report.log.date,
        method: report.log.method,
        path: report.log.path,
        protocol: report.log.protocol,
        status: report.log.status,
        bytes: report.log.bytes,
        referer: report.log.referer,
        agent: report.log.agent,
        webserver: report.log.webserver,
        hash: report.log.hash,
    }));

    // Extraindo os cabeçalhos
    const headers = ["suspicious", "type", "ip", "date", "method", "path", "protocol", "status", "bytes", "referer", "agent", "webserver", "hash"];
    console.log(flattenedData);
    const csvRows = [
        headers.join(','), // Cabeçalho
        ...flattenedData.map((row: { [key: string]: string | number | boolean }) => 
            headers.map(field => `"${(row[field] ?? '').toString().replace(/"/g, '""')}"`).join(',')
        ),
    ];

    return csvRows.join('\r\n');
}

// download-csv.ts

export function downloadCSV(csvContent: string, fileName: string) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Criando um link temporário para o download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);

    link.click();

    // Limpando o link temporário
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
