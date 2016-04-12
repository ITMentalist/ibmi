import Packet from './packet';
import Signon from '../service/signon';
import crypto from 'crypto';

/**
 * Signon seed exchange request.
 */
export class SignonSeedExchangeRequest extends Packet {

  /**
   * Constructor.
   */
  constructor(socket) {
    super(52, socket);

    this.length = 52;
    this.serviceId = Signon.SERVICE.id;
    this.requestResponseId = SignonSeedExchangeRequest.ID;
    this.templateLength = 0;

    this.clientId = 1;
    this.clientDataStreamLevel = 5;
    this.clientSeed = crypto.randomBytes(8);
  }

  /**
   * Get the client ID.
   * @return {number} The ID.
   */
  get clientId() {
    let b = this.getField(SignonSeedExchangeRequest.CLIENT_ID);
    return b.readUInt32BE(0);
  }

  /**
   * Set the client ID.
   * @param {number} val - The value.
   */
  set clientId(val) {
    this.set32Bit(10, 20);
    this.set16Bit(SignonSeedExchangeRequest.CLIENT_ID, 24);
    this.set32Bit(val, 26);
  }

  /**
   * Get the client data stream level.
   * @return {number} The level.
   */
  get clientDataStreamLevel() {
    let b = this.getField(SignonSeedExchangeRequest.CLIENT_DATA_STREAM_LEVEL);
    return b.readUInt16BE(0);
  }

  /**
   * Set the client data stream level.
   * @param {number} val - The value.
   */
  set clientDataStreamLevel(val) {
    this.set32Bit(8, 30);
    this.set16Bit(SignonSeedExchangeRequest.CLIENT_DATA_STREAM_LEVEL, 34);
    this.set16Bit(val, 36);
  }

  /**
   * Get the client seed.
   * @return {Buffer} The seed.
   */
  get clientSeed() {
    return this.getField(SignonSeedExchangeRequest.CLIENT_SEED);
  }

  /**
   * Set the client seed.
   * @param {Buffer} val - The value.
   */
  set clientSeed(val) {
    this.set32Bit(14, 38);
    this.set16Bit(SignonSeedExchangeRequest.CLIENT_SEED, 42);
    val.copy(this.data, 44, 0, 8);
  }

  /**
   * Return the ID for the client ID field.
   * @return {number} The ID.
   */
  static get CLIENT_ID() {
    return 0x1101;
  }

  /**
   * Return the ID for the client data stream level field.
   * @return {number} The ID.
   */
  static get CLIENT_DATA_STREAM_LEVEL() {
    return 0x1102;
  }

  /**
   * Return the ID for the client seed.
   * @return {number} The ID.
   */
  static get CLIENT_SEED() {
    return 0x1103;
  }

  static get ID() {
    return 0x7003;
  }

}

/**
 * Signon seed exchange response.
 */
export class SignonSeedExchangeResponse extends Packet {

  constructor(dataOrSize) {
    if (!dataOrSize) {
      super(94);
    } else {
      super(dataOrSize);
    }

    if(!dataOrSize) {
      // Initialize fields
      this.length = 94;
      this.templateLength = 4;
      this.requestResponseId = SignonSeedExchangeResponse.ID;
      this.serviceId = Signon.SERVICE.id;
      this.serverVersion = 0;
      this.serverLevel = 0;
      this.passwordLevel = 0;
      this.serverSeed = null;
      this.jobName = null;
    }
  }

  /**
   * Get the return code.
   * @return {number} The code.
   */
  get rc() {
    return this.get32Bit(20);
  }

  /**
   * Set the return code.
   * @param {number} val - The value.
   */
  set rc(val) {
    this.set32Bit(val, 20);
  }

  /**
   * Get server version.
   * @return {number} The version.
   */
  get serverVersion() {
    return this.getField(SignonSeedExchangeResponse.SERVER_VERSION).readUInt32BE(0);
  }

  /**
   * Set server version.
   * @param {number} val - The value.
   */
  set serverVersion(val) {
    this.set32Bit(10, 24);
    this.set16Bit(SignonSeedExchangeResponse.SERVER_VERSION, 28);
    this.set32Bit(val, 30);
  }

  /**
   * Get server level.
   * @return {number} The level.
   */
  get serverLevel() {
    return this.getField(SignonSeedExchangeResponse.SERVER_LEVEL).readUInt16BE(0);
  }

  /**
   * Set server level.
   * @param {number} val - The value.
   */
  set serverLevel(val) {
    this.set32Bit(8, 34);
    this.set16Bit(SignonSeedExchangeResponse.SERVER_LEVEL, 38);
    this.set16Bit(val, 40);
  }

  /**
   * Get the server seed.
   * @return {Buffer} The server seed.
   */
  get serverSeed() {
    return this.getField(SignonSeedExchangeResponse.SERVER_SEED);
  }

  /**
   * Set the server seed.
   * @param {Buffer} val - The value.
   */
  set serverSeed(val) {
    this.set32Bit(14, 42);
    this.set16Bit(SignonSeedExchangeResponse.SERVER_SEED, 46);
    if (val) {
      val.copy(this.data, 48, 0, 8);
    }
  }

  /**
   * Get the password level.
   * @return {number} The level.
   */
  get passwordLevel() {
    return this.getField(SignonSeedExchangeResponse.PASSWORD_LEVEL)[0];
  }

  /**
   * Set the password level.
   * @param {number} The level.
   */
  set passwordLevel(val) {
    this.set32Bit(7, 56);
    this.set16Bit(SignonSeedExchangeResponse.PASSWORD_LEVEL, 60);
    this.data[62] = val;
  }

  /**
   * Get the job name.
   * @return {Buffer} The job name.
   */
  get jobName() {
    return this.getField(SignonSeedExchangeResponse.JOB_NAME);
  }

  /**
   * Set the job name.
   * @param {Buffer} val - The value.
   */
  set jobName(val) {
    this.set32Bit(0x1F, 63);
    this.set16Bit(SignonSeedExchangeResponse.JOB_NAME, 67);
    if (val) {
      val.copy(this.data, 69, 0, 25);
    }
  }

  /*************
   * Field IDs *
   *************/

  /**
   * Return the ID for the server version field.
   * @return {number} The ID.
   */
  static get SERVER_VERSION() {
    return 0x1101;
  }

  /**
   * Return the ID for the server level field.
   * @return {number} The ID.
   */
  static get SERVER_LEVEL() {
    return 0x1102;
  }

  /**
   * Return the ID for the server seed field.
   * @return {number} The ID.
   */
  static get SERVER_SEED() {
    return 0x1103;
  }

  /**
   * Return the ID for the password level field.
   * @return {number} The ID.
   */
  static get PASSWORD_LEVEL() {
    return 0x1119;
  }

  /**
   * Return the ID for the job name field.
   * @return {number} The ID.
   */
  static get JOB_NAME() {
    return 0x111F;
  }

  static get ID() {
    return 0xF003;
  }

}
