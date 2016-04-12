'use strict';

const debug = require('debug')('ibmi:packet:packet');

export default class Packet {

  /**
   * Constructor.
   */
  constructor(dataOrSize) {
    if (Buffer.isBuffer(dataOrSize)) {
      this.data = dataOrSize;
      this.length = dataOrSize.length;
      debug('New packet with length of %d from %s', this.length, this.data.toString('hex'));
    } else if (typeof(dataOrSize) == 'number') {
      this.data = new Buffer(dataOrSize);
      this.data.fill(0);
      debug('Empty packet created with size of %d', dataOrSize);
    } else {
      throw new Error('Data or size is invalid');
    }
  }

  /**
   * Get a date from the specified field id.
   * @param {number} id - The id.
   */
  getDate(id) {
    let b = this.getField(id);
    if (!b) {
      return null;
    }
    let year = b.readUInt16BE(0);
    let month = b[2] - 1;
    let day = b[3];
    let hour = b[4];
    let minute = b[5];
    let second = b[6];
    let d = new Date(year, month, day, hour, minute, second, 0);
    return d;
  }

  /**
   * Set a date with the specified id a the specified offset.
   * @param {Date} date - The date.
   * @param {number} id - The ID.
   * @param {number} offset - The offset.
   */
  setDate(date, id, offset) {
    this.set32Bit(14, offset);
    this.set16Bit(id, offset + 4);
    if (date) {
      this.data.writeUInt16BE(date.getFullYear(), offset + 6);
      this.data[offset + 8] = date.getMonth() + 1;
      this.data[offset + 9] = date.getDate();
      this.data[offset + 10] = date.getHours();
      this.data[offset + 11] = date.getMinutes();
      this.data[offset + 12] = date.getSeconds();
    }
  }

  /**
   * Get the field value by ID in the payload and return the buffer.
   * @param {number} id - The id of the field.
   * @return {Buffer} The buffer
   */
  getField(id) {
    let self = this;
    let offset = this.templateLength + 20;
    let length = 0;
    let prevOffset = offset;
    while (offset < self.data.length - 1) {
      prevOffset = offset;
      length = self.get32Bit(offset);
      if (self.get16Bit(offset + 4) == id) {
        break;
      }
      offset += length;
      if (offset == prevOffset) {
        offset = self.data.length;
      }
    }
    if (offset == self.data.length) {
      return null;
    }
    let start = offset + 6;
    let end = start + (length - 6);
    return self.data.slice(start, end);
  }

  /**
   * Set the field value by ID at the specified offset, length, and value.
   */
  setField(val, id, offset, length) {
    let self = this;
    self.set32Bit(length, offset);
    self.set16Bit(id, offset + 4);
    if (val) {
      val.copy(this.data, offset+6, 0, val.length);
    }
  }

  /**
   * Get 16 bit value at offset.
   * @param {number} offset - The offset.
   * @return {Buffer} The value.
   */
  get16Bit(offset) {
    return this.data.readUInt16BE(offset);
  }

  /**
   * Set 16 bit value at offet.
   * @param {number} val - The value.
   * @param {number} offset - The offset.
   */
  set16Bit(val, offset) {
    this.data.writeUInt16BE(val, offset);
  }

  /**
   * Get 32 bit value at offset.
   * @param {number} offset - The offset.
   * @return {Buffer} The value.
   */
  get32Bit(offset) {
    return this.data.readUInt32BE(offset);
  }

  /**
   * Set 32 bit value at offet.
   * @param {number} val - The value.
   * @param {number} offset - The offset.
   */
  set32Bit(val, offset) {
    this.data.writeUInt32BE(val, offset);
  }

  /**
   * Get the packet length.
   * @return {number} The length.
   */
  get length() {
    return this.get32Bit(0);
  }

  /**
   * Set the packet length.
   * @param {number} val - The value.
   */
  set length(val) {
    this.set32Bit(val, 0);
  }

  /**
   * Get the service ID.
   * @return {number} The ID.
   */
  get serviceId() {
    return this.get16Bit(6);
  }

  /**
   * Set the service ID.
   * @param {number} val - The value.
   */
  set serviceId(val) {
    this.set16Bit(val, 6);
  }

  /**
   * Get the template length.
   * @return {number} The length.
   */
  get templateLength() {
    return this.get16Bit(16);
  }

  /**
   * Set the template length.
   * @param {number} val - The value.
   */
  set templateLength(val) {
    this.set16Bit(val, 16);
  }

  /**
   * Get the request response ID.
   * @return {number} The ID.
   */
  get requestResponseId() {
    return this.get16Bit(18);
  }

  /**
   * Set the request response ID.
   * @param {number} val - The value.
   */
  set requestResponseId(val) {
    this.set16Bit(val, 18);
  }

  /**
   * Get the correlation ID.
   * @return {number} The ID.
   */
  get correlationId() {
    return this.get32Bit(12);
  }

  /**
   * Set the correlation ID.
   * @return {number} The ID.
   */
  set correlationId(val) {
    this.set32Bit(val, 12);
  }
}
