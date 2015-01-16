'use strict';

var path                = require('path');
var fs                  = require('fs');
var expect              = require('chai').expect;
var acceptance          = require('../helpers/acceptance');
var runCommand          = require('../helpers/run-command');
var createTestTargets   = acceptance.createTestTargets;
var teardownTestTargets = acceptance.teardownTestTargets;
var linkDependencies    = acceptance.linkDependencies;
var cleanupRun          = acceptance.cleanupRun;


var appName  = 'some-cool-app';

describe('Acceptance: blueprint smoke tests', function() {
  before(function() {
    this.timeout(360000);
    return createTestTargets(appName);
  });

  after(function() {
    this.timeout(15000);
    return teardownTestTargets();
  });

  beforeEach(function() {
    this.timeout(10000);
    return linkDependencies(appName);
  });

  afterEach(function() {
    this.timeout(10000);
    return cleanupRun();
  });

  it('generating an http-proxy installs packages to package.json', function() {
    this.timeout(450000);

    return runCommand(path.join('.', 'node_modules', 'ember-cli', 'bin', 'ember'), 'generate',
                      'http-proxy',
                      'api',
                      'http://localhost/api',
                      '--silent')
      .then(function() {
        var packageJsonPath = path.join(__dirname, '..', '..', 'tmp', appName, 'package.json');
        var packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        expect(!packageJson.devDependencies['http-proxy']).to.not.be.an('undefined');
        expect(!packageJson.devDependencies['morgan']).to.not.be.an('undefined');
      });
  });
});
