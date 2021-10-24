import { join } from 'path';
import { spawnSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { CommandModule } from 'yargs';

export const prePublish: CommandModule<any, { variant?: 'minor' | 'major' | 'breaking' }> = {
  command: 'pre-publish [variant]',
  describe: 'Should be run before publish',
  builder: {
    variant: {
      demandOption: false,
      choices: ['minor', 'major', 'breaking']
    }
  },
  handler({ variant = 'minor' }): void {
    const jsonPath = join(__dirname, '../package.json');
    let jsonContent = readFileSync(jsonPath, 'utf8')
    jsonContent = jsonContent.replace(/"version" *: *"[0-9]+\.[0-9]+\.[0-9]+"/, match => {
      const [, breakingVersion, majorVersion, minorVersion] = Array.from(
        /"version" *: *"([0-9]+)\.([0-9]+)\.([0-9]+)"/.exec(match) || []
      );
      switch (variant) {
        case 'minor':
          return `"version": "${breakingVersion}.${majorVersion}.${Number(minorVersion) + 1}"`
        case 'major':
          return `"version": "${breakingVersion}.${Number(majorVersion) + 1}.0"`
        case 'breaking':
          return `"version": "${Number(breakingVersion) + 1}.0.0"`
      }
    })
    writeFileSync(jsonPath, jsonContent);
  }
}
