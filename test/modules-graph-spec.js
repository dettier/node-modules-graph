/*global describe, it, before, after */

var assert = require('chai').assert;

var ModulesGraph = require('../lib/modules-graph');

describe('modules-graph', function () {

  var moduleAFilename;
  var moduleBFilename;
  var moduleCFilename;

  before(function () {
    this.modulesGraph = new ModulesGraph();
    require('./../test-modules/test-module-a');
    require('./../test-modules/test-module-b');
    require('./../test-modules/test-module-c');
    moduleAFilename = require.resolve('./../test-modules/test-module-a');
    moduleBFilename = require.resolve('./../test-modules/test-module-b');
    moduleCFilename = require.resolve('./../test-modules/test-module-c');
  });

  after(function () {
    this.modulesGraph.restore();
  });

  describe('getImmediateDependants', function () {

    it('should return right dependant modules for test module A', function () {
      var result = this.modulesGraph.getImmediateDependants(moduleAFilename);
      assert.notInclude(result, moduleAFilename);
      assert.notInclude(result, moduleBFilename);
      assert.notInclude(result, moduleCFilename);
    });

    it('should return right dependant modules for test module B', function () {
      var result = this.modulesGraph.getImmediateDependants(moduleBFilename);
      assert.include(result, moduleAFilename);
      assert.notInclude(result, moduleBFilename);
      assert.include(result, moduleCFilename);
    });

  });

  describe('getImmediateDependencies', function () {

    it('should return right dependencies for test module A', function () {
      var result = this.modulesGraph.getImmediateDependencies(moduleAFilename);
      assert.notInclude(result, moduleAFilename);
      assert.include(result, moduleBFilename);
      assert.notInclude(result, moduleCFilename);
    });

    it('should return right dependencies for test module B', function () {
      var result = this.modulesGraph.getImmediateDependencies(moduleBFilename);
      assert.notInclude(result, moduleAFilename);
      assert.notInclude(result, moduleBFilename);
      assert.include(result, moduleCFilename);
    });

  });


  describe('getDependants', function () {

    it('should return right dependant modules for test module A', function () {
      var result = this.modulesGraph.getDependants(moduleAFilename);
      assert.notInclude(result, moduleAFilename);
      assert.notInclude(result, moduleBFilename);
      assert.notInclude(result, moduleCFilename);
    });

    it('should return right dependant modules for test module B', function () {
      var result = this.modulesGraph.getDependants(moduleBFilename);
      assert.include(result, moduleAFilename);
      assert.include(result, moduleBFilename);
      assert.include(result, moduleCFilename);
    });

    it('should return right dependant modules for test module C', function () {
      var result = this.modulesGraph.getDependants(moduleCFilename);
      assert.include(result, moduleAFilename);
      assert.include(result, moduleBFilename);
      assert.include(result, moduleCFilename);
    });

  });


  describe('getDependencies', function () {

    it('should return right dependencies for test module A', function () {
      var result = this.modulesGraph.getDependencies(moduleAFilename);
      assert.notInclude(result, moduleAFilename);
      assert.include(result, moduleBFilename);
      assert.include(result, moduleCFilename);
    });

    it('should return right dependencies for test module B', function () {
      var result = this.modulesGraph.getDependencies(moduleBFilename);
      assert.notInclude(result, moduleAFilename);
      assert.include(result, moduleBFilename);
      assert.include(result, moduleCFilename);
    });

    it('should return right dependencies for test module C', function () {
      var result = this.modulesGraph.getDependencies(moduleCFilename);
      assert.notInclude(result, moduleAFilename);
      assert.include(result, moduleBFilename);
      assert.include(result, moduleCFilename);
    });

  });

});