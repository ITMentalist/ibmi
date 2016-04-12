'use strict';

import Packet from '../../../src/packet/packet';

require('../../common');

describe('Packet', () => {

  describe('#constructor()', () => {

    it('should fail due to invalid parameters', () => {
      expect(() => {return new Packet();}).to.throw(/Data or size is invalid/);
      expect(() => {return new Packet('1234');}).to.throw(/Data or size is invalid/);
      expect(() => {return new Packet({});}).to.throw(/Data or size is invalid/);
    });

    it('should create new instance', () => {
      let p = new Packet(20);
      let expected = new Buffer(20);
      expected.fill(0);
      expect(p.data.equals(expected)).to.equal(true);
      p.length = 20;
      p.length.should.equal(20);
      p.templateLength = 1;
      p.templateLength.should.equal(1);
      p.requestResponseId = 2;
      p.requestResponseId.should.equal(2);
      p.serviceId = 3;
      p.serviceId.should.equal(3);
      p.correlationId = 4;
      p.correlationId.should.equal(4);
      expected.fill(0xFF);
      p = new Packet(expected);
      expect(p.data.equals(expected)).to.equal(true);
    });

  });

  describe('#getField()', () => {

    it('should fail', () => {
      let p = new Packet(32);
      expect(p.getField(0x1001)).to.equal(null);
    });

    it('should get field', () => {
      let p = new Packet(52);
      let expected = new Buffer([0xFF, 0xEE]);
      p.set32Bit(10,20);
      p.set16Bit(0x1002,24);
      p.set32Bit(8,30);
      p.set16Bit(0x1001,34);
      p.set16Bit(0xFFEE, 36);
      expect(p.getField(0x1001).equals(expected)).to.equal(true);
    });

  });

  describe('#setField()', () => {

    it('should fail', () => {
      let p = new Packet(52);
      let expected = new Buffer([0xFF, 0xEE]);
      p.setField(null, 0x1001, 20, 8);
      expect(p.getField(0x1001).equals(expected)).to.equal(false);
    });

    it('should set field', () => {
      let p = new Packet(52);
      let expected = new Buffer([0xFF, 0xEE]);
      p.setField(expected, 0x1001, 20, 8);
      expect(p.getField(0x1001).equals(expected)).to.equal(true);
    });

  });

  describe('#getDate()', () => {

    it('should fail', () => {
      let p = new Packet(52);
      expect(p.getDate(0x1001)).to.equal(null);
    });

    it('should get date', () => {
      let p = new Packet(52);
      p.setDate(new Date(), 0x1001, 20);
      p.getDate(0x1001).should.be.instanceof(Date);
    });

  });

  describe('#setDate()', () => {

    it('should set empty date', () => {
      let p = new Packet(52);
      p.setDate(null, 0x1001, 20);
      p.getDate(0x1001).should.be.instanceof(Date);
    });

    it('should set date', () => {
      let p = new Packet(52);
      p.setDate(new Date(), 0x1001, 20);
      p.getDate(0x1001).should.be.instanceof(Date);
    });

  });

});
