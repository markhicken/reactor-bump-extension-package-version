# reactor-version-extension-package
A command line utility that updates the version of a zipped up Adobe Launch extension package.

### Sample usage:
```
npm install -g reactor-version-extension-package

version-reactor-extension-package [major, minor, patch] inputFile optionalOutputFile
```

If the optionalOutputFile is not included, the inputFile will be updated in place.