import LinkFocus from "../components/link-focus";
import Image from "next/image";

async function GetLogsServerAction(formData: FormData) {
    "use server"
    // Get logs from server

    const webserver = formData.get('webserver');
    if(webserver !== 'nginx' && webserver !== 'apache') {
        throw new Error('Not a valid webserver system, please stop to trying to hack us.');
    }
    console.log(webserver);
    if(webserver === "apache"){
        // Get logs from apache server

        const { exec } = require('child_process');
        exec('cat /var/log/apache2/access.log', (err: any, stdout: any, stderr: any) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(stdout);
        });
    }
    
    const fs = require('fs');
    const path = require('path');
    const logsPath = path.join(process.cwd(), 'logs');
    console.log(logsPath);
    const files = fs.readdirSync(logsPath);
    console.log(files);
}

export default function Logs() {
    return (
        <main className="flex justify-start items-start w-full px-16 py-16">
            <section className="flex flex-col gap-y-4">
                <form className="flex flex-col gap-y-4" action={GetLogsServerAction}>
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
                    <div>
                        <button className="bg-cyber-green hover:bg-cyber-blue hover:text-cyber-green text-black font-semibold py-3 px-6 rounded-lg">
                            Confirm WebServer System
                        </button>
                    </div>
                </form>
                <div>

                </div>
            </section>

        </main>
    )
}