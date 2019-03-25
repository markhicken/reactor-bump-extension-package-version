# version-reactor-extension-package
A command line utility that updates the version of an Adobe Launch extension package (zip file).

### Sample usage:
```
npm install -g version-reactor-extension-package

version-reactor-extension-package [major, minor, patch] inputFile [optionalOutputFile]
```

If the `optionalOutputFile` is not included, the `inputFile` will be updated in place.
