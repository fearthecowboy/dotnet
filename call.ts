#!/usr/bin/env node
import { packageJsonPath, installationPath, dotnetPackageName, basename } from './common'
// don't go for global installed stuff.
process.env["DOTNET_MULTILEVEL_LOOKUP"] = "0";

// if this is the .net runtime, try the SDK command first (if it's local).
basename === 'dotnet' ? tryDotNetSDK() : tryDotNet();
 
function tryDotNetSDK() {
  try { require("dotnet-sdk-2.0.0/dist/call.js"); } catch { tryDotNet(); }
}

function tryDotNet() {
  // try local node_modules 
  try { require(dotnetPackageName); } catch { 
    // run the dotnet package
    try { require(installationPath);  } catch {
      // inline install and try again
      require("child_process").fork(`${__dirname}/app.js`,["--force"],{silent:true}).
        on("exit",(code:number,signal:string)=> code == 0 ? require(installationPath):console.error("Unable to install/use dotnet framework."));
    }
  }
}
