#!/usr/bin/env node
import { basePath, fileExists, packageJsonPath, installationPath,dotnetPackageName } from './common'
import {spawn} from "child_process";

const force = process.argv.indexOf("--force") !== -1;
const verbose = process.argv.indexOf("--debug") !== -1 || process.env.DEBUG; 
const debug = verbose ? console.error:(message?: any, ...optionalParams: any[])=>{};

async function main() {
  if( force || !fileExists(packageJsonPath)) {
    // load node_modules from our squish'd fs file.

    try {
      if (force) {
        // force => remove folder first
        debug(`Removing installation path: ${installationPath}`);
        await new Promise<void>((res, rej) => require(`rimraf`)(installationPath, (err: any) => err ? rej(err) : res()));
      }
      // make target folder location
      debug(`Creating base path: ${basePath}`);
      await new Promise(res => require("mkdirp")(basePath, () => res()));

      // run yarn (out of proc)
      spawn(process.execPath,["/node_modules/yarn/bin/yarn.js",'add', dotnetPackageName, "--force","--silent","--no-lockfile","--json"], {stdio:verbose ? [process.stdin, process.stderr, process.stderr]:'ignore',cwd:basePath}).
        on("exit",(code:number,signal:string)=> {
           if( code ) { 
             console.error("Unable to install/use dotnet framework.");
             process.exit( code )
           }
           process.exit(0);
        } );
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }
}

main();