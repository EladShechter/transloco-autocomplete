'use strict';
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const promiseAll = require('promise-polyfill').all;
const { RawSource } = require('webpack-sources');

const defaultOptions = {
  baseDir: 'assets/i18n',
  extFileName: '.ts',
};

class TranslationsJsonFilesPlugin {
  constructor(options) {
    this.options = {...defaultOptions, ...options};
    this.pluginName = this.constructor.name;
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(this.pluginName, compilation => {
      compilation.hooks.additionalAssets.tapAsync(this.pluginName, callback => {
          this._convertTranslationsAndAddToAssets(compilation)
            .then(callback,
              (err) => {
                this.log('failed to add translations assets');
                console.error(err);
                callback();
            });
      });
    });
  }

  _convertTranslationsAndAddToAssets(compilation) {
    return new Promise((resolve, reject) => {
      this.log('find translations type-script files');
      this._getFilesInPattern().then((files) => {
        if (files.length === 0) {
          this.log('no translations files were found');
          resolve();
          return;
        }
        this.log('convert translations type-script files to JSON');
        this._convertTsFilesToJsonFiles(files).then((jsonFilesMap) => {
          this.log('add json files to assets');
          this._addJsonFilesToAssets(compilation,jsonFilesMap);
          this.log('finished adding translation files');
          resolve();
        }, reject);
      }, reject);
    });
  }

  _getFilesInPattern() {
    const { baseDir, extFileName, contextPath } = this.options;
    const absoluteBaseDir = path.join(contextPath, baseDir);
    const pattern = `${absoluteBaseDir}\/**\/*${extFileName}`;
    return new Promise((resolve, reject) => {
      glob(pattern, (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      });
    });
  }

  _convertTsFilesToJsonFiles(files) {
    return new Promise((resolve, reject) => {
      const jsonFilesMap = new Map();
      const promises = files.map(file => this._convertTsToJson(file).then(jsonString => {
        const jsonFileName = this.getDistFullFileName(file);
        jsonFilesMap.set(jsonFileName, jsonString);
      }));

      promiseAll(promises).then(() => resolve(jsonFilesMap), err => reject(err));
    });
  }

  _convertTsToJson(tsFilePath) {
      return fs.promises.readFile(tsFilePath)
        .then(data => {
          const tsPrefix = 'export default ';
          const tsFileText = data.toString();
          if (!tsFileText.startsWith(tsPrefix)){
            throw (new Error(`file ${tsFilePath} don't starts with ${tsPrefix}`));
          }

          const obj = Function(tsFileText.replace(tsPrefix, 'return '))();
          return JSON.stringify(obj);
        });
  }

  getDistFullFileName(tsFileName) {
    const { baseDir, extFileName, contextPath } = this.options;

    const jsonFileName = `${path.basename(tsFileName, extFileName)}.json`;
    const absoluteBaseDir = path.join(contextPath, baseDir);
    const relativePathToBaseDir = path.dirname(path.relative(absoluteBaseDir, tsFileName));
    return path.join(baseDir, relativePathToBaseDir, jsonFileName);
  }

  _addJsonFilesToAssets(compilation, jsonFilesMap) {
    jsonFilesMap.forEach((jsonText, fileName) => {
      this.log(`adding translation file ${fileName} to assets`);
      compilation.assets[fileName] = new RawSource(jsonText);
    });
  }

  log(text) {
    console.log(`[${this.pluginName}] - ${text}`);
  }
}

module.exports.TranslationsJsonFilesPlugin = TranslationsJsonFilesPlugin;

