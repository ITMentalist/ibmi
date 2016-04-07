'use strict';

export default class DataType {

  static get ARRAY() {
    return 0;
  }

  static get BIN2() {
    return 1;
  }

  static get BIN4() {
    return 2;
  }

  static get BIN8() {
    return 3;
  }

  static get BYTE_ARRAY() {
    return 4;
  }

  static get FLOAT4() {
    return 5;
  }

  static get FLOAT8() {
    return 6;
  }

  static get PACKED() {
    return 7;
  }

  static get STRUCTURE() {
    return 8;
  }

  static get TEXT() {
    return 9;
  }

  static get UBIN2() {
    return 10;
  }

  static get UBIN4() {
    return 11;
  }

  static get ZONED() {
    return 12;
  }

}
