#!/usr/bin/env node

const fs = require('fs');
const semver = require('semver');
const JSZip = require('jszip');

const bumpType = process.argv[2];
const extensionPackageFilePath = process.argv[3];
const newExtensionPackageFilePath = process.argv[4] || extensionPackageFilePath;

function showUsage() {
  console.log('');
  console.log('usage: ')
  console.log('version-reactor-extension-package [major, minor, patch] <inputFile> <optionalOutputFile>');
}

function validateInput() {
  if (!bumpType || !bumpType.match(/^major$|^minor$|^patch$/)) {
    console.log('Missing semver type (major, minor, patch)');
    showUsage();
    return false;
  }
  if (!extensionPackageFilePath) {
    console.log('No package file specified');
    showUsage();
    return false;
  }
  if (!fs.existsSync(extensionPackageFilePath)) {
    console.log('Specified package file does not exist');
    showUsage();
    return false;
  }
  if (!newExtensionPackageFilePath) {
    console.log('No output file specified');
    showUsage();
    return false;
  }

  return true;
}

if (validateInput()) {
  // read a zip file
  fs.readFile(extensionPackageFilePath, function(err, data) {
    if (err) { throw err; return; }

    try {
      JSZip.loadAsync(data).then(function (zip) {
        var extensionJsonEntry = zip.file('extension.json');
        extensionJsonEntry.async("string").then((result)=>{
          if (!result) {
            console.log('The extension package is invalid: missing extension.json');
            return;
          }

          var extensionJson = JSON.parse(result);
          const initialVersion = extensionJson.version;
          const bumpedVersion = semver.inc(extensionJson.version, bumpType);

          // bump the version
          extensionJson.version = bumpedVersion;
          var output = JSON.stringify(extensionJson, null, '  ');

          // update the file in the zip
          zip.file('extension.json', output);

          // write the zip file
          zip.generateNodeStream({
            type:'nodebuffer',
            streamFiles:true
          }).pipe(
            fs.createWriteStream(newExtensionPackageFilePath)
          ).on('finish', () => {
            console.log(`${newExtensionPackageFilePath} updated`);
            console.log(`${initialVersion} => ${bumpedVersion}`);
          });
        });
      });
    } catch(err) {
      console.log(err);
    }
  });
}

