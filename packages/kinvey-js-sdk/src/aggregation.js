import isArray from 'lodash/isArray';
import Query from './query';

/**
 * This class represents an aggregation that can be used to group data.
 */
export default class Aggregation {
  constructor(aggregation) {
    const config = Object.assign({
      query: null,
      initial: {},
      fields: [],
      reduceFn: () => null
    }, aggregation);

    this.query = config.query;
    this.initial = config.initial;
    this.fields = config.fields;
    this.reduceFn = config.reduceFn;
  }

  get query() {
    return this._query;
  }

  set query(query) {
    if (query && !(query instanceof Query)) {
      throw new Error('Query must be an instance of Query class.');
    }

    this._query = query;
  }

  get fields() {
    return this._fields;
  }

  set fields(fields) {
    if (!isArray(fields)) {
      throw new Error('Please provide a valid fields. Fields must be an array of strings.');
    }

    this._fields = fields;
  }

  /**
   * Adds the filed to the array of fields.
   *
   * @param {string} field
   * @returns {Aggregation} Aggregation
   */
  by(field) {
    this.fields.push(field);
    return this;
  }
}

/**
 * Creates an aggregation that will return the count for a field on an array of data.
 *
 * @param {string} field Field
 * @returns {Aggregation} Aggregation
 */
export function count(field = '') {
  const aggregation = new Aggregation({
    fields: [field],
    reduceFn: (result, doc, key) => {
      const val = doc[key];
      if (val) {
        // eslint-disable-next-line no-param-reassign
        result[val] = typeof result[val] === 'undefined' ? 1 : result[val] + 1;
      }
      return result;
    }
  });
  return aggregation;
}

/**
 * Creates an aggregation that will return the sum for a field on an array of data.
 *
 * @param {string} field Field
 * @returns {Aggregation} Aggregation
 */
export function sum(field = '') {
  const aggregation = new Aggregation({
    initial: { sum: 0 },
    fields: [field],
    reduceFn: (result, doc, key) => {
      // eslint-disable-next-line no-param-reassign
      result.sum += doc[key];
      return result;
    }
  });
  return aggregation;
}

/**
 * Creates an aggregation that will return the min value for a field on an array of data.
 *
 * @param {string} field Field
 * @returns {Aggregation} Aggregation
 */
export function min(field = '') {
  const aggregation = new Aggregation({
    initial: { min: Infinity },
    fields: [field],
    reduceFn: (result, doc, key) => {
      // eslint-disable-next-line no-param-reassign
      result.min = Math.min(result.min, doc[key]);
      return result;
    }
  });
  return aggregation;
}

/**
 * Creates an aggregation that will return the max value for a field on an array of data.
 *
 * @param {string} field Field
 * @returns {Aggregation} Aggregation
 */
export function max(field = '') {
  const aggregation = new Aggregation({
    initial: { max: -Infinity },
    fields: [field],
    reduceFn: (result, doc, key) => {
      // eslint-disable-next-line no-param-reassign
      result.max = Math.max(result.max, doc[key]);
      return result;
    }
  });
  return aggregation;
}

/**
 * Creates an aggregation that will return the average value for a field on an array of data.
 *
 * @param {string} field Field
 * @returns {Aggregation} Aggregation
 */
export function average(field = '') {
  const aggregation = new Aggregation({
    initial: { count: 0, average: 0 },
    fields: [field],
    reduceFn: (result, doc, key) => {
      // eslint-disable-next-line no-param-reassign
      result.average = ((result.average * result.count) + doc[key]) / (result.count + 1);
      // eslint-disable-next-line no-param-reassign
      result.count += 1;
      return result;
    }
  });
  return aggregation;
}