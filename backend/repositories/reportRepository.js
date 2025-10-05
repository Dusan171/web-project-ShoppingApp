import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reportsFilePath = path.join(__dirname, '..', 'data', 'reports.json');

const readReports = () => {
    try {
        const data = fs.readFileSync(reportsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) { return []; }
};

const writeReports = (reports) => {
    fs.writeFileSync(reportsFilePath, JSON.stringify(reports, null, 2), 'utf8');
};

export const save = (report) => {
    const reports = readReports();
    reports.push(report);
    writeReports(reports);
    return report;
};

export const findAll = () => readReports();

export const findById = (id) => {
    return readReports().find(r => r.id === id);
};