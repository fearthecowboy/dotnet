#!/usr/bin/env node
import { basePath, fileExists, packageJsonPath, installationPath,dotnetPackageName } from './common'
import {fork} from "child_process";

const force = process.argv.indexOf("--force") !== -1;

async function main() {
  if( force || !fileExists(packageJsonPath)) {
    // load node_modules from our squish'd fs file.

    try {
      if (force) {
        // force => remove folder first
        await new Promise<void>((res, rej) => require(`rimraf`)(installationPath, (err: any) => err ? rej(err) : res()));
      }
      // make target folder location
      await new Promise(res => require("mkdirp")(basePath, () => res()));
      console.log = console.error;

      // run yarn (out of proc)
      fork("/node_modules/yarn/bin/yarn.js",['add', dotnetPackageName, "--force","--silent","--no-lockfile","--json"], {silent:true,cwd:basePath}).
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