import fs from 'fs';
import path from 'path';

const dataPath = path.join(__dirname, 'data');

export const readData = <T>(fileName: string): T[] => {
    const filePath = path.join(dataPath, fileName);

    if (!fs.existsSync(filePath)) {
        return [];
    }

    const fileContent = fs.readFileSync(filePath);
    return JSON.parse(fileContent.toString());
};

export const writeData = <T>(fileName: string, data: T[]) => {
    const filePath = path.join(dataPath, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};