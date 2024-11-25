"use server";

import { LogModel } from "@/models/log-model";
import db from "../db";
import crypto from 'crypto';

export async function getLogs(): Promise<LogModel[]> {
    const logs = db.prepare(`SELECT *
                                FROM logs
                                WHERE ip IN (
                                    SELECT ip
                                    FROM logs
                                    GROUP BY ip
                                    HAVING COUNT(*) > 5
                                );
                            `).all() as LogModel[];
    return logs;
}

export async function deleteExistentLogs(): Promise<void> {
    const deleteOldLogs = db.prepare('DELETE FROM logs');
    deleteOldLogs.run();
    return;
}

export async function getMeanBytesOfLogs(): Promise<number> {
    const meanBytes = db.prepare('SELECT AVG(bytes) as mean FROM logs').get() as { mean: number };
    return meanBytes.mean;
}

export async function reloadLogs(log: LogModel) {
    const dateOnly = log.date;
    const dataToHash = `${log.ip}|${dateOnly}|${log.path}`;
    const hash = crypto.createHash('sha1').update(dataToHash).digest('hex');

    const stmt = db.prepare(`INSERT OR IGNORE INTO logs (
                                ip, 
                                date, 
                                method, 
                                path, 
                                protocol, 
                                status, 
                                bytes, 
                                referer, 
                                agent,
                                webserver,
                                hash
                            ) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    await stmt.run(
        log.ip,
        dateOnly,
        log.method,
        log.path,
        log.protocol,
        log.status,
        log.bytes,
        log.referer,
        log.agent,
        log.webserver,
        hash
    );
    return;
}


export async function defineSystemForFirstTime(system:string): Promise<void> {
    const deleteOldSystem = db.prepare('DELETE FROM settings');
    deleteOldSystem.run();
    const stmt = db.prepare('INSERT INTO settings (system) VALUES (?)');
    stmt.run(system);
    return;
}