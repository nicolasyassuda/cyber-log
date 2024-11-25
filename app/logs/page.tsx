import { getLogs, reloadLogs } from '@/lib/logs/logs';
import { exec } from 'child_process';
import { LogModel } from '@/models/log-model';
import { revalidatePath } from 'next/cache';
import { promisify } from 'util';
import GenerateReport from '../components/generate-report';

const execAsync = promisify(exec);

async function SetLogsServerAction(formData: FormData) {
    const webserver = formData.get('webserver');
    if (webserver && webserver !== 'nginx' && webserver !== 'apache') {
        throw new Error('Not a valid webserver system, please stop trying to hack us.');
    }
    if (!webserver) {
        throw new Error('Please select a webserver system.');
    }


    if (webserver === "apache") {
        // Processar logs do Apache
        try {
            const { stdout } = await execAsync('cat /var/log/apache2/access.log');

            const listOfLogs = stdout.split("\n");
            const regex = /^(::1|\S+) - - \[(.*?)\] "(\w+) (.*?) (HTTP\/\d\.\d)" (\d{3}) (\d+) "([^"]*)" "(.*?)"$/;

            for (const log of listOfLogs) {
                if (!log.trim()) continue;

                const match = log.match(regex);
                const logItem = new LogModel();

                if (match) {
                    logItem.ip = match[1];
                    logItem.date = match[2];
                    logItem.method = match[3];
                    logItem.path = match[4];
                    logItem.protocol = match[5];
                    logItem.status = parseInt(match[6], 10);
                    logItem.bytes = parseInt(match[7], 10);
                    logItem.referer = match[8];
                    logItem.agent = match[9];
                    logItem.webserver = 'apache';
                    await reloadLogs(logItem);
                } else {
                    console.error(`Log malformado: ${log}`);
                }
            }
        } catch (error) {
            console.error('Erro ao processar logs do Apache:', error);
            throw new Error('Failed to fetch logs from the Apache server.');
        }
    } else {
        // Processar logs do Nginx
        try {
            const { stdout } = await execAsync('cat /var/log/nginx/access.log');

            const listOfLogs = stdout.split("\n");
            const regex = /^(::1|\S+) - - \[(.*?)\] "(\w+) (.*?) (HTTP\/\d\.\d)" (\d{3}) (\d+) "([^"]*)" "(.*?)"$/;

            for (const log of listOfLogs) {
                if (!log.trim()) continue;

                const match = log.match(regex);
                const logItem = new LogModel();

                if (match) {
                    logItem.ip = match[1];
                    logItem.date = match[2];
                    logItem.method = match[3];
                    logItem.path = match[4];
                    logItem.protocol = match[5];
                    logItem.status = parseInt(match[6], 10);
                    logItem.bytes = parseInt(match[7], 10);
                    logItem.referer = match[8];
                    logItem.agent = match[9];
                    logItem.webserver = 'nginx';
                    await reloadLogs(logItem);
                } else {
                    console.error(`Log malformado: ${log}`);
                }
            }
        } catch (error) {
            console.error('Erro ao processar logs do Nginx:', error);
            throw new Error('Failed to fetch logs from the Nginx server.');
        }
    }
}

export default async function Logs() {
    const logs = await getLogs();
    async function handleSubmit(formData: FormData) {
        "use server";
        await SetLogsServerAction(formData);
        revalidatePath('/logs', "page");
    }

    return (
        <main className="flex justify-start items-start w-full px-16 py-16">
            <section className="flex flex-col gap-y-4">
                <form className="flex flex-col gap-y-4" action={handleSubmit}>
                    <h2 className="text-5xl text-left font-extrabold text-cyber-green">
                        Your Logs
                    </h2>
                    <div className="flex space-x-6">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="webserver"
                                value="nginx"
                                className="hidden peer"
                                defaultChecked
                            />
                            <div className="w-5 h-5 border-2 border-gray-400 rounded-full peer-checked:border-cyber-green peer-checked:bg-cyber-green transition"></div>
                            <span className="text-gray-700 peer-checked:text-cyber-green">Nginx</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="webserver"
                                value="apache"
                                className="hidden peer"
                            />
                            <div className="w-5 h-5 border-2 border-gray-400 rounded-full peer-checked:border-cyber-green peer-checked:bg-cyber-green transition"></div>
                            <span className="text-gray-700 peer-checked:text-cyber-green">Apache</span>
                        </label>
                    </div>
                    <div className='flex gap-x-4'>
                        <button className="bg-cyber-green hover:bg-cyber-blue hover:text-cyber-green text-black font-semibold py-3 px-6 rounded-lg">
                            Colect Logs
                        </button>
                        <GenerateReport logs={logs}></GenerateReport>
                    </div>
                </form>
                <div>
                    <h1 className='text-left text-cyber-green font-bold'>Tabela com os dados já filtrados!</h1>
                    <table className="min-w-full border-collapse border border-cyber-gray text-sm bg-cyber-green shadow-md rounded">
                        <thead className="bg-cyber-green text-cyber-gray uppercase tracking-wide border-b border-cyber-black">
                            <tr>
                                <th className="px-4 py-2 text-left">IP</th>
                                <th className="px-4 py-2 text-left">Date</th>
                                <th className="px-4 py-2 text-left">Method</th>
                                <th className="px-4 py-2 text-left">Path</th>
                                <th className="px-4 py-2 text-left">Protocol</th>
                                <th className="px-4 py-2 text-left">Status</th>
                                <th className="px-4 py-2 text-left">Bytes</th>
                                <th className="px-4 py-2 text-left">Referer</th>
                                <th className="px-4 py-2 text-left">Agent</th>
                                <th className="px-4 py-2 text-left">WebServer</th>
                                <th className="px-4 py-2 text-left">Hash</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-cyber-black">
                            {logs.length == 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center text-cyber-gray font-bold">No logs found</td>
                                </tr>
                            ) : (
                                logs.map((log, index) => (
                                    <tr
                                        key={index}
                                        className={index % 2 === 0 ? " bg-cyber-green" : " bg-cyber-aqua"}
                                    >
                                        <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{log.ip}</td>
                                        <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{log.date}</td>
                                        <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{log.method}</td>
                                        <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{log.path}</td>
                                        <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{log.protocol}</td>
                                        <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{log.status}</td>
                                        <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{log.bytes}</td>
                                        <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{log.referer}</td>
                                        <td className="px-4 py-2 text-gray-600 whitespace-nowrap overflow-scroll scrollbar max-w-xs">
                                            {log.agent}
                                        </td>
                                        <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{log.webserver}</td>
                                        <td className="px-4 py-2 text-gray-600 whitespace-nowrap text-ellipsis overflow-hidden max-w-36">{log.hash}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}
