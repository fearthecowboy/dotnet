#!/usr/bin/env node
import { packageJsonPath, installationPath, dotnetPackageName, basename } from './common'
// don't go for global installed stuff.
process.env["DOTNET_MULTILEVEL_LOOKUP"] = "0";

const verbose = process.env.DEBUG; 
const debug = verbose ? console.error:(message?: any, ...optionalParams: any[])=>{};
const skipSDK =  process.env.NO_NET_SDK || basename !== 'dotnet' 

// if this is the .net runtime, try the SDK command first (if it's local).
skipSDK ? tryDotNet() :tryDotNetSDK();
 
function tryDotNetSDK() {
  debug("Trying local dotnet sdk.");
  try { require("dotnet-sdk-2.0.0/dist/call.js"); } catch { tryDotNet(); }
}

function tryDotNet() {
  // try local node_modules 
  debug(`Trying local dotnet package: ${dotnetPackageName}`);
  try { require(dotnetPackageName); } catch { 
    // run the dotnet package
    debug(`Trying user dotnet package: ${installationPath}`);
    try { require(installationPath);  } catch {
      // inline install and try again
      debug(`Installing dotnet package: ${installationPath}`);
      require("child_process").spawn(process.execPath, [`${__dirname}/app.js`,"--force"],{stdio:verbose ? [process.stdin, process.stderr, process.stderr]: 'ignore'}).
        on("exit",(code:number,signal:string)=> code == 0 ? require(installationPath):process.exit(console.error("Unable to install/use dotnet framework.")||code));
    }
  }
}
