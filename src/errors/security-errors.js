'use strict';

export default class SecurityErrors {

  static get RANDOM_SEED_EXCHANGE_INVALID() {
    return {
      id: 0x00010001,
      msg: 'Invalid random seed exchange'
    };
  }

  static get SERVICE_ID_NOT_VALID() {
    return {
      id: 0x00010002,
      msg: 'Service ID is not valid'
    };
  }

  static get REQUEST_ID_NOT_VALID() {
    return {
      id: 0x00010003,
      msg: 'Request ID is not valid'
    };
  }

  static get RANDOM_SEED_INVALID() {
    return {
      id: 0x00010004,
      msg: 'Invalid random seed'
    };
  }

  static get RANDOM_SEED_REQUIRED() {
    return {
      id: 0x00010005,
      msg: 'Random seed required'
    };
  }

  static get PASSWORD_ENCRYPT_INVALID() {
    return {
      id: 0x00010006,
      msg: 'Password encrypt invalid'
    };
  }

  static get USERID_LENGTH_NOT_VALID() {
    return {
      id: 0x00010007,
      msg: 'User ID length not valid'
    };
  }

  static get PASSWORD_LENGTH_NOT_VALID() {
    return {
      id: 0x00010008,
      msg: 'Password length not valid'
    };
  }

  static get REQUEST_DATA_ERROR() {
    return {
      id: 0x00010009,
      id2: 0x0001000A,
      msg: 'Request data error'
    };
  }

  static get SIGNON_REQUEST_NOT_VALID() {
    return {
      id: 0x0001000B,
      msg: 'Signon request not valid'
    };
  }

  static get PASSWORD_CHANGE_REQUEST_NOT_VALID() {
    return {
      id: 0x0001000C,
      msg: 'Password change request not valid'
    };
  }

  static get PASSWORD_OLD_NOT_VALID() {
    return {
      id: 0x0001000D,
      msg: 'Old password not valid'
    };
  }

  static get PASSWORD_NEW_NOT_VALID() {
    return {
      id: 0x0001000E,
      msg: 'New password not valid'
    };
  }

  static get TOKEN_TYPE_NOT_VALID() {
    return {
      id: 0x0001000F,
      msg: 'Token type not valid'
    };
  }

  static get GENERATE_TOKEN_REQUEST_NOT_VALID() {
    return {
      id: 0x00010010,
      id2: 0x00010012,
      msg: 'Generate token request not valid'
    };
  }

  static get TOKEN_LENGTH_NOT_VALID() {
    return {
      id: 0x00010011,
      msg: 'Token length not valid'
    };
  }

  static get USERID_UNKNOWN() {
    return {
      id: 0x00020001,
      msg: 'Unknown user ID'
    };
  }

  static get USERID_DISABLED() {
    return {
      id: 0x00020002,
      msg: 'User ID is disabled'
    };
  }

  static get USERID_MISMATCH() {
    return {
      id: 0x00020003,
      msg: 'Profile mismatch'
    };
  }

  static get PASSWORD_NEW_TOO_LONG() {
    return {
      id: 0x00030001,
      msg: 'New password too long'
    };
  }

  static get PASSWORD_NEW_TOO_SHORT() {
    return {
      id: 0x00030002,
      msg: 'New password too short'
    };
  }

  static get PASSWORD_NEW_REPEAT_CHARACTER() {
    return {
      id: 0x00030003,
      msg: 'New password has repeating characters'
    };
  }

  static get PASSWORD_NEW_ADJACENT_DIGITS() {
    return {
      id: 0x00030004,
      msg: 'New password has adjacent digits'
    };
  }

  static get PASSWORD_NEW_CONSECUTIVE_REPEAT_CHARACTER() {
    return {
      id: 0x00030005,
      msg: 'New password has consecutively repeating characters'
    };
  }

  static get PASSWORD_NEW_PREVIOUSLY_USED() {
    return {
      id: 0x00030006,
      msg: 'New password previously used'
    };
  }

  static get PASSWORD_NEW_NO_NUMERIC() {
    return {
      id: 0x00030007,
      msg: 'New password does not contain any digits'
    };
  }

  static get PASSWORD_NEW_INVALID_CHARACTER() {
    return {
      id: 0x00030008,
      msg: 'New password contains an invalid character'
    };
  }

  static get PASSWORD_NEW_DISALLOWED() {
    return {
      id: 0x00030009,
      msg: 'New password is not allowed'
    };
  }

  static get PASSWORD_NEW_USERID() {
    return {
      id: 0x0003000A,
      msg: 'New password contains user ID'
    };
  }

  static get PASSWORD_INCORRECT() {
    return {
      id: 0x0003000B,
      msg: 'Incorrect password'
    };
  }

  static get PASSWORD_INCORRECT_DISABLE() {
    return {
      id: 0x0003000C,
      msg: 'Incorrect password, user ID will be disabled on the next incorrect password'
    };
  }

  static get PASSWORD_EXPIRED() {
    return {
      id: 0x0003000D,
      msg: 'Password expired'
    };
  }

  static get PASSWORD_PRE_V2R2() {
    return {
      id: 0x0003000E,
      msg: 'Encryped password is pre V2R2'
    };
  }

  static get PASSWORD_NEW_SAME_POSITION() {
    return {
      id: 0x0003000F,
      msg: 'New password has character in same position as old'
    };
  }

  static get PASSWORD_NONE() {
    return {
      id: 0x00030010,
      msg: 'Password is *NONE'
    };
  }

  static get PASSWORD_NEW_VALIDATION_PROGRAM() {
    return {
      id: 0x00030011,
      msg: 'New password failed validation'
    };
  }

  static get PASSWORD_CHANGE_NOT_ALLOWED() {
    return {
      id: 0x00030012,
      msg: 'Password change not allowed'
    };
  }

  static get PASSWORD_VALUE_NOT_VALID() {
    return {
      id: 0x00030013,
      msg: 'Password value is not valid'
    };
  }

  static get SECURITY_GENERAL() {
    return {
      id: 0x00040000,
      msg: 'General security error'
    };
  }

  static get CONNECTION_NOT_PASSED_LENGTH() {
    return {
      id: 0x00040001,
      msg: 'Function not performed due to data length'
    };
  }

  static get CONNECTION_NOT_PASSED_TIMEOUT() {
    return {
      id: 0x00040002,
      msg: 'Function not performed due to server job timeout'
    };
  }

  static get CONNECTION_NOT_PASSED_SERVER_NOT_STARTED() {
    return {
      id: 0x00040003,
      msg: 'Function not performed due to server job not started'
    };
  }

  static get CONNECTION_NOT_PASSED_PRESTART_NOT_STARTED() {
    return {
      id: 0x00040004,
      msg: 'Function not performed due to server prestart job not started'
    };
  }

  static get CONNECTION_NOT_PASSED_SUBSYSTEM() {
    return {
      id: 0x00040005,
      msg: 'Function not performed due to sub-system error'
    };
  }

  static get CONNECTION_NOT_PASSED_SERVER_ENDING() {
    return {
      id: 0x00040006,
      msg: 'Function not performe due to server job ending'
    };
  }

  static get CONNECTION_NOT_PASSED_RECEIVER_AREA() {
    return {
      id: 0x00040007,
      msg: 'Function not performed due to receiver area too small'
    };
  }

  static get CONNECTION_NOT_PASSED_UNKNOWN() {
    return {
      id: 0x00040008,
      msg: 'Function not performed due to unknown error'
    };
  }

  static get CONNECTION_NOT_PASSED_PROFILE() {
    return {
      id: 0x00040009,
      msg: 'Function not performed, user profile does not exist for the server job'
    };
  }

  static get CONNECTION_NOT_PASSED_AUTHORITY() {
    return {
      id: 0x0004000A,
      msg: 'Function not performed due to authority issues for the server job'
    };
  }

  static get CONNECTION_NOT_PASSED_PROGRAM_NOT_FOUND() {
    return {
      id: 0x0004000B,
      msg: 'Function not performed due to server job program not found'
    };
  }

  static get CONNECTION_NOT_PASSED_LIBRARY_AUTHORITY() {
    return {
      id: 0x0004000C,
      msg: 'Function not performed because the daemon job is not authorized to use the library that contains the server job'
    };
  }

  static get CONNECTION_NOT_PASSED_PROGRAM_AUTHORITY() {
    return {
      id: 0x0004000D,
      msg: 'Function not performed because the daemon job is not authorized to the server job program'
    };
  }

  static get GENERATE_TOKEN_AUTHORITY_INSUFFICIENT() {
    return {
      id: 0x0004000E,
      msg: 'Function not performed because user not authorized to generate token for another user'
    };
  }

  static get SERVER_NO_MEMORY() {
    return {
      id: 0x0004000F,
      msg: 'Function not performed due to lack of memory for authorization'
    };
  }

  static get SERVER_CONVERSION_ERROR() {
    return {
      id: 0x00040010,
      msg: 'Function not performed due to codepage conversion error'
    };
  }

  static get SERVER_EIM_ERROR() {
    return {
      id: 0x00040011,
      msg: 'Function not performed due to EIM interface error'
    };
  }

  static get SERVER_CRYPTO_ERROR() {
    return {
      id: 0x00040012,
      msg: 'Function not performed due to cryptographic error'
    };
  }

  static get SERVER_TOKEN_VERSION() {
    return {
      id: 0x00040013,
      msg: 'Function not performed due to token version error'
    };
  }

  static get SERVER_KEY_NOT_FOUND() {
    return {
      id: 0x00040014,
      msg: 'Function not performed due to public key not found'
    };
  }

  static get EXIT_POINT_PROCESSING_ERROR() {
    return {
      id: 0x00050001,
      msg: 'Error processing exit point'
    };
  }

  static get EXIT_PROGRAM_RESOLVE_ERROR() {
    return {
      id: 0x00050002,
      msg: 'Resolving to exit point'
    };
  }

  static get EXIT_PROGRAM_CALL_ERROR() {
    return {
      id: 0x00050003,
      msg: 'Exit program call error'
    };
  }

  static get EXIT_PROGRAM_DENIED_REQUEST() {
    return {
      id: 0x00050004,
      msg: 'Error program denied request'
    };
  }

  static get PROFILE_TOKEN_NOT_VALID() {
    return {
      id: 0x00060001,
      msg: 'Profile token not valid'
    };
  }

  static get PROFILE_TOKEN_NOT_VALID_MAXIMUM() {
    return {
      id: 0x00060002,
      msg: 'Maximum number of profile tokens reached'
    };
  }

  static get PROFILE_TOKEN_NOT_VALID_TIMEOUT_NOT_VALID() {
    return {
      id: 0x00060003,
      msg: 'Profile token timeout not valid'
    };
  }

  static get PROFILE_TOKEN_NOT_VALID_TYPE_NOT_VALID() {
    return {
      id: 0x00060004,
      msg: 'Profile token type not valid'
    };
  }

  static get PROFILE_TOKEN_NOT_VALID_NOT_REGENERABLE() {
    return {
      id: 0x00060005,
      msg: 'Profile token not regenerable'
    };
  }

  static get KERBEROS_TICKET_NOT_VALID_CONSISTENCY() {
    return {
      id: 0x00060006,
      id2: 0x0006000B,
      msg: 'Kerberos ticket not consistent'
    };
  }

  static get KERBEROS_TICKET_NOT_VALID_MECHANISM() {
    return {
      id: 0x00060007,
      msg: 'Invalid mechanism for kerberos ticket'
    };
  }

  static get KERBEROS_TICKET_NOT_VALID_CREDENTIAL_NOT_VALID() {
    return {
      id: 0x00060008,
      msg: 'Invalid credentials for kerberos ticket'
    };
  }

  static get KERBEROS_TICKET_NOT_VALID_SIGNATURE() {
    return {
      id: 0x00060009,
      msg: 'Invalid signature for kerberos ticket'
    };
  }

  static get KERBEROS_TICKET_NOT_VALID_CREDENTIAL_NO_LONGER_VALID() {
    return {
      id: 0x0006000A,
      msg: 'Credentials no longer valid for kerberos ticket'
    };
  }

  static get KERBEROS_TICKET_NOT_VALID_VERIFICATION() {
    return {
      id: 0x0006000C,
      msg: 'Verification failed for kerberos ticket'
    };
  }

  static get KERBEROS_TICKET_NOT_VALID_EIM() {
    return {
      id: 0x0006000D,
      msg: 'Invlid EMI identifier for kerberos ticket'
    };
  }

  static get KERBEROS_TICKET_NOT_VALID_SYSTEM_PROFILE() {
    return {
      id: 0x0006000E,
      msg: 'Kerberos ticket invalid due to invalid system profile'
    };
  }

  static get KERBEROS_TICKET_NOT_VALID_MULTIPLE_PROFILES() {
    return {
      id: 0x0006000F,
      msg: 'Kerberos ticket invalid due to due multiple profiles mapped'
    };
  }

  static get GENERATE_TOKEN_CAN_NOT_CONNECT() {
    return {
      id: 0x00070001,
      msg: 'Can not connect to EMI system domain'
    };
  }

  static get GENERATE_TOKEN_CAN_NOT_CHANGE_CCSID() {
    return {
      id: 0x00070002,
      msg: 'Can not change the CCSID for EMI request'
    };
  }

  static get GENERATE_TOKEN_CAN_NOT_OBTAIN_NAME() {
    return {
      id: 0x00070003,
      msg: 'Can not obtain the EMI registry name'
    };
  }

  static get GENERATE_TOKEN_NO_MAPPING() {
    return {
      id: 0x00070004,
      msg: 'Can not map token'
    };
  }

  /**
   * Get message for id. Bizarre implementation to simplify code. No idea how
   * brittle this is...
   */
  static get(id) {
    let msg = 'Unknown error';
    for (let prop of Object.getOwnPropertyNames(SecurityErrors)) {
      if (typeof(SecurityErrors[prop]) == 'object' && prop != 'prototype') {
        let obj = SecurityErrors[prop];
        if (obj.id == id || obj.id2 == id) {
          msg = obj.msg;
        }
      }
    }
    return msg;
  }

  /*static get1(id) {
    let msg = 'Unknown error';
    switch(id) {
    case SecurityErrors.RANDOM_SEED_EXCHANGE_INVALID.id: msg = SecurityErrors.RANDOM_SEED_EXCHANGE_INVALID.msg; break;
    case SecurityErrors.SERVICE_ID_NOT_VALID.id: msg = SecurityErrors.SERVICE_ID_NOT_VALID.msg; break;
    case SecurityErrors.REQUEST_ID_NOT_VALID.id: msg = SecurityErrors.REQUEST_ID_NOT_VALID.msg; break;
    case SecurityErrors.RANDOM_SEED_INVALID.id: msg = SecurityErrors.RANDOM_SEED_INVALID.msg; break;
    case SecurityErrors.RANDOM_SEED_REQUIRED.id: msg = SecurityErrors.RANDOM_SEED_REQUIRED.msg; break;
    case SecurityErrors.PASSWORD_ENCRYPT_INVALID.id: msg = SecurityErrors.PASSWORD_ENCRYPT_INVALID.msg; break;
    case SecurityErrors.USERID_LENGTH_NOT_VALID.id: msg = SecurityErrors.USERID_LENGTH_NOT_VALID.msg; break;
    case SecurityErrors.PASSWORD_LENGTH_NOT_VALID.id: msg = SecurityErrors.PASSWORD_LENGTH_NOT_VALID.msg; break;
    case SecurityErrors.REQUEST_DATA_ERROR.id: msg = SecurityErrors.REQUEST_DATA_ERROR.msg; break;
    case SecurityErrors.REQUEST_DATA_ERROR.id2: msg = SecurityErrors.REQUEST_DATA_ERROR.msg; break;
    case SecurityErrors.SIGNON_REQUEST_NOT_VALID.id: msg = SecurityErrors.SIGNON_REQUEST_NOT_VALID.msg; break;
    case SecurityErrors.PASSWORD_CHANGE_REQUEST_NOT_VALID.id: msg = SecurityErrors.PASSWORD_CHANGE_REQUEST_NOT_VALID.msg; break;
    case SecurityErrors.PASSWORD_OLD_NOT_VALID.id: msg = SecurityErrors.PASSWORD_OLD_NOT_VALID.msg; break;
    case SecurityErrors.PASSWORD_NEW_NOT_VALID.id: msg = SecurityErrors.PASSWORD_NEW_NOT_VALID.msg; break;
    case SecurityErrors.TOKEN_TYPE_NOT_VALID.id: msg = SecurityErrors.TOKEN_TYPE_NOT_VALID.msg; break;
    case SecurityErrors.GENERATE_TOKEN_REQUEST_NOT_VALID.id: msg = SecurityErrors.GENERATE_TOKEN_REQUEST_NOT_VALID.msg; break;
    case SecurityErrors.GENERATE_TOKEN_REQUEST_NOT_VALID.id2: msg = SecurityErrors.GENERATE_TOKEN_REQUEST_NOT_VALID.msg; break;
    case SecurityErrors.TOKEN_LENGTH_NOT_VALID.id: msg = SecurityErrors.TOKEN_LENGTH_NOT_VALID.msg; break;

    case SecurityErrors.USERID_UNKNOWN.id: msg = SecurityErrors.USERID_UNKNOWN.msg; break;
    case SecurityErrors.USERID_DISABLED.id: msg = SecurityErrors.USERID_DISABLED.msg; break;
    case SecurityErrors.USERID_MISMATCH.id: msg = SecurityErrors.USERID_MISMATCH.msg; break;

    case SecurityErrors.PASSWORD_INCORRECT.id: msg = SecurityErrors.PASSWORD_INCORRECT.msg; break;
    case SecurityErrors.PASSWORD_INCORRECT_DISABLE.id: msg = SecurityErrors.PASSWORD_INCORRECT_DISABLE.msg; break;
    default: break;
    }
    return msg;
  }*/

}
