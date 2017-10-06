import {join, normalize} from 'path';
import {platform, homedir, arch}  from 'os';
import {statSync} from 'fs';
export const basename = require("../package.json").basename;

const dotnetVersion = "2.0.0";
export const basePath = process.env.DOTNET_SHARED_HOME || normalize(`${homedir()}/.net/${dotnetVersion}`);
const architecture = process.env.DOTNET_SHARED_ARCH || detectArchitecture();

export const dotnetPackageName = `${basename}-${dotnetVersion}-${architecture}`;
export const installationPath = join(basePath, `node_modules/${dotnetPackageName}/`);
export const packageJsonPath = join(installationPath , "package.json");

export const fileExists = (path: string)=> { try{ return statSync(path).isFile(); } catch { return false; } }

function detectArchitecture(): string {
  switch (platform()) {
    case 'darwin': return 'osx';
    case 'linux': return `linux`;
    case 'win32': switch (arch()) {
        case 'x64': return 'win';
        case 'x86': 
        case 'ia32': 
          return 'win-x86';
    }
    break;
  }
  throw new Error(`Unsupported Platform: ${platform()}`);
}