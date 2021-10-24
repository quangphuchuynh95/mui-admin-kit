"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prePublish = void 0;
const path_1 = require("path");
const fs_1 = require("fs");
exports.prePublish = {
    command: 'pre-publish [variant]',
    describe: 'Should be run before publish',
    builder: {
        variant: {
            demandOption: false,
            choices: ['minor', 'major', 'breaking']
        }
    },
    handler({ variant = 'minor' }) {
        const jsonPath = (0, path_1.join)(__dirname, '../package.json');
        let jsonContent = (0, fs_1.readFileSync)(jsonPath, 'utf8');
        jsonContent = jsonContent.replace(/"version" *: *"[0-9]+\.[0-9]+\.[0-9]+"/, match => {
            const [, breakingVersion, majorVersion, minorVersion] = Array.from(/"version" *: *"([0-9]+)\.([0-9]+)\.([0-9]+)"/.exec(match) || []);
            switch (variant) {
                case 'minor':
                    return `"version": "${breakingVersion}.${majorVersion}.${Number(minorVersion) + 1}"`;
                case 'major':
                    return `"version": "${breakingVersion}.${Number(majorVersion) + 1}.0"`;
                case 'breaking':
                    return `"version": "${Number(breakingVersion) + 1}.0.0"`;
            }
        });
        (0, fs_1.writeFileSync)(jsonPath, jsonContent);
    }
};
