<!--
    Note:
    - keep dotnet and dotnet-sdk documentation in sync
    - spots that differ are (to be) marked with COWBELL
-->

# .NET Core 2.0.0 Runtime<!--COWBELL-->

This package installs the .NET Core 2.0 Runtime<!--COWBELL--> for your platform and provides the `dotnet` executable.

No elevation required.

Partners with the [dotnet-sdk-2.0.0](https://www.npmjs.com/package/dotnet-sdk-2.0.0)<!--COWBELL--> package.

Usable as a standalone but also for shipping .NET based packages:

## Scenario 1: Global Installation

To make the `dotnet` command available globally, run

``` Haskell seems to provide nice highlighting
npm i -g dotnet-2.0.0      // for running dotnet apps
npm i -g dotnet-sdk-2.0.0  // for developing dotnet apps
```

## Scenario 2: Dependency

When installed as a dependency of a package, the `dotnet` command will be available to that package's `scripts`.
This enables a very simple development and shipping experience for platform-independent .NET based applications.

### Example

The following `package.json` uses both the `dotnet-sdk-2.0.0` and `dotnet-2.0.0` in order to simplify both developing and shipping the package.

``` json
{
  "name": "contoso",
  "version": "1.33.7",
  "description": "Contoso C# app",
  "scripts": {
    "build": "dotnet build src/contoso.csproj",
    "test": "dotnet test src/contoso.test.csproj",
    "start": "dotnet bin/netcoreapp2.0/contoso.dll"
  },
  "devDependencies": {
    "dotnet-sdk-2.0.0": "*"
  },
  "dependencies": {
    "dotnet-2.0.0": "*"
  }
}
```

This allows consuming the `contoso` package easily as a *standalone* using

``` Haskell seems to provide nice highlighting
npx contoso
```

or when *installed* (e.g. as a dependency of another package) using

``` Haskell seems to provide nice highlighting
npm start
```

Unsurprisingly, during *development* the following commands will work:

``` Haskell seems to provide nice highlighting
npm run build
npm run test
```

## Technical Details

### Platform Independence

We created several *platform-specific* helper packages that actually provide the promised `dotnet` installation (e.g. `dotnet-sdk-2.0.0-win`).
Such packages exist for Windows, Linux and MacOS.
Here, we will merely determine the executing platform, acquire the corresponding package and populate `.bin` with scripts forwarding any calls to the actual binaries.

### Installation Location

The *platform-specific* package (see above) is installed in a *shared location* in order to reliably deduplicate it across installations.
By default, the installation location is `~/.net/2.0.0` since it is accessible without elevation.