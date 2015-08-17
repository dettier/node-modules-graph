var Module = require('module');

function getEmptyInfo () {
  return {
    dependants : [],  // modules that imported this module
    dependencies : [] // modules that was imported by this module
  };
}

function saveDependency (modulesHash, moduleFrom, moduleTo) {
  if (!modulesHash[moduleFrom]) {
    modulesHash[moduleFrom] = getEmptyInfo();
  }

  if (!modulesHash[moduleTo]) {
    modulesHash[moduleTo] = getEmptyInfo();
  }

  modulesHash[moduleFrom].dependencies.push(moduleTo);
  modulesHash[moduleTo].dependants.push(moduleFrom);
}


function ModulesGraph() {

  var newRequire;
  var self = this;
  var oldRequire = Module.prototype.require;

  this.enabled = true;
  this.modulesHash = {};

  newRequire = function (path) {
    var args = [].slice.call(arguments, 0);
    var result = oldRequire.apply(this, args);
    if (self.enabled) {
      var resolvedPath = Module._resolveFilename(path, this);
      saveDependency(self.modulesHash, this.filename, resolvedPath);
    }
    return result;
  };

  Module.prototype.require = newRequire;

  return this;
}


ModulesGraph.prototype.restore = function () {
  this.enabled = false;
  this.modulesHash = {};
};

ModulesGraph.prototype.getImmediateDependencies = function (fullpath) {
  var moduleInfo = this.modulesHash[fullpath] || {};
  return moduleInfo.dependencies || [];
};

ModulesGraph.prototype.getImmediateDependants = function (fullpath) {
  var moduleInfo = this.modulesHash[fullpath] || {};
  return moduleInfo.dependants || [];
};

var DEPENDENCIES_MODE = 0;
var DEPENDANTS_MODE = 1;

ModulesGraph.prototype._searchDeep = function (fullpath, result, mode) {
  var deps, value, i;
  if (mode === DEPENDENCIES_MODE) {
    deps = this.getImmediateDependencies(fullpath);
  } else if (mode === DEPENDANTS_MODE) {
    deps = this.getImmediateDependants(fullpath);
  } else {
    throw new Error('Unknown mode');
  }
  for (i = 0; i < deps.length; i++) {
    value = deps[i];
    if (result[value])
      continue;
    result[value] = true;
    this._searchDeep(value, result, mode);
  }
};

ModulesGraph.prototype.getDependencies = function (fullpath) {
  var result = {};
  this._searchDeep(fullpath, result, DEPENDENCIES_MODE);
  return Object.keys(result);
};

ModulesGraph.prototype.getDependants = function (fullpath) {
  var result = {};
  this._searchDeep(fullpath, result, DEPENDANTS_MODE);
  return Object.keys(result);
};

module.exports = ModulesGraph;