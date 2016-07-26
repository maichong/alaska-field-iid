/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-07-22
 * @author Liang <liang@maichong.it>
 */

'use strict';

const alaska = require('alaska');
const NumberField = require('alaska-field-number');
const numeral = require('numeral');

class IIDField extends NumberField {

  init() {
    let field = this;
    let schema = this._schema;
    let model = this._model;
    this.underscoreMethod('format', function (format) {
      if (format) {
        return numeral(this.get(field.path)).format(format);
      }
      return this.get(field.path);
    });

    let cacheDriver = alaska.main.createCacheDriver(field.cache);
    let key = field.key || model.name + '.' + field.path;

    schema.pre('save', function (next) {
      let record = this;
      let value = record.get(field.path);
      if (value) {
        return next();
      }
      cacheDriver.inc(key).then(function (value) {
        record.set(field.path, value);
        next();
      }, function (error) {
        next(error);
      });
    });
  }
}

module.exports = IIDField;
