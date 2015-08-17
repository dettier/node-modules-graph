# Node modules graph [![Build Status](https://travis-ci.org/dettier/node-modules-graph.svg?branch=master)](https://travis-ci.org/dettier/node-modules-graph)
Small library to get module dependencies info during runtime.

## Installation
```
npm install modules-graph
```

## Usage
When you instantiate `ModulesGraph` object it will hook into node.js `require`
function and will log all require calls remembering which module required which.
```
var modulesGraph = new ModulesGraph();
```

After that you can call methods on `modulesGraph` object to get dependencies
and dependant modules for any module.
All methods accept `filepath` parameter that should be the absolute path to module
and return an array of absolute paths to related modules.

```
result = modulesGraph.getImmediateDependencies(filepath);
result = modulesGraph.getImmediateDependants(filepath);
result = modulesGraph.getDependencies(filepath);
result = modulesGraph.getDependants(filepath);
```

To stop logging dependencies call `restore` method.
```
modulesGraph.restore()
```

## Tests
```
npm test
```