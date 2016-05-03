'use strict';

const debug = require('debug')('ibmi:qsys:object-path');
let error = require('debug')('ibmi:qsys:object-path:error');
error.color = 1;

export default class ObjectPath {

  /**
   * Constructor.
   * @constructor
   */
  constructor(opts) {
    opts = opts || { };
    debug('Creating a QSYS object path with opts: %j', opts);

    if (opts.path) {
      this.parse(opts.path);
    }
  }

  /**
   * Parse a path.
   */
  parse(path) {
    debug('Attempt to parse path: %s', path);

    let upperCasePath = path.toUpperCase();

    //------------------------------------------------------
    // Process the prefix.
    //------------------------------------------------------
    // Take into account possible IASP prefix to QSYS path.
    // So determine index of "/QSYS.LIB"
    let indexOfQsysLib = upperCasePath.indexOf('/QSYS.LIB');

    // Required prefix.
    if (indexOfQsysLib == -1) {
      throw new Error('Invalid path prefix');
    }

    // Extract the name of the IASP
    if (indexOfQsysLib > 0)  {
      // Assume absolute path starts with delimiter
      this.aspName = upperCasePath.substring(1, indexOfQsysLib);
      debug('ASP name: %s', this.aspName);
    }

    // Special case the "/QSYS.LIB" scenario (no other nested objects specified)
    if (upperCasePath.substring(indexOfQsysLib) == '/QSYS.LIB') {
      this.libraryName = 'QSYS';
      this.objectType = 'LIB';
      this.path = ObjectPath.buildPathName(this.aspName, null, null, null, null);
      return;
    }

    //------------------------------------------------------
    // Process library.
    //------------------------------------------------------
    // Move to start of first nested object within "/QSYS.LIB/"
    let currentOffset = 10;  // Length of "/QSYS.LIB/"
    if (!this.aspName == '') {
      currentOffset = currentOffset  + 1 + this.aspName.length;
    }

    // Find suffix after library name.
    let nextOffset = upperCasePath.indexOf('.LIB/', currentOffset);
    // If a qualifying library name was specified.
    if (nextOffset > currentOffset) {
      // If quoted, store as mixed case, else store as uppercase.
      this.libraryName = ObjectPath.toQSYSName(path.substring(currentOffset, nextOffset));
      // Disallow /QSYS.LIB/QSYS.LIB.
      if (this.libraryName == 'QSYS') {
        throw new Error('Invalid library name of QSYS');
      }
      // Possibly a "special" library name.
      if (this.libraryName[0] == '%') {
        if (this.libraryName == '%LIBL%') {
          this.libraryName = '*LIBL';
        } else if (this.libraryName == '%CURLIB%') {
          this.libraryName = '*CURLIB';
        } else if (this.libraryName == '%USRLIBL%') {
          this.libraryName = '*USRLIBL';
        } else if (this.libraryName == '%ALL%') {
          this.libraryName = '*ALL';
        } else if (this.libraryName == '%ALLUSR%') {
          this.libraryName = '*ALLUSR';
        }
      }
      // Move past ".LIB/" to the first character of object name.
      currentOffset = nextOffset + 5;
    } else if (nextOffset == -1) {
      // No qualifying library name was specified, set library name to QSYS.
      this.libraryName = 'QSYS';
    } else {
      throw new Error('Invalid library');
    }
    // If name is > 10 chars.
    if (this.libraryName.length > 10) {
      throw new Error('Invalid library name: Too long');
    }

    debug('Library set to: %s', this.libraryName);

    //------------------------------------------------------
    // Process object type.
    //------------------------------------------------------
    // Find last period in path name (object.type delimiter).
    nextOffset = upperCasePath.lastIndexOf('.');
    // If no type specified or type > 6 chars.
    if (nextOffset < currentOffset || upperCasePath.length - nextOffset - 1 > 6) {
      throw new Error('Invalid object type');
    }
    this.objectType = upperCasePath.substring(nextOffset + 1);
    debug('Object type set to %s', this.objectType);

    //------------------------------------------------------
    // Process member name.
    //------------------------------------------------------
    // Only needs to be done if the type is MBR.
    if (this.objectType == 'MBR') {
      debug('TODO');
    }

    //------------------------------------------------------
    // Process object name.
    //------------------------------------------------------
    // Check that object name is 1-10 chars.
    if (nextOffset < currentOffset || nextOffset - currentOffset > 10) {
      throw new Error('Invalid object name: Too long');
    }
    // The object name is syntactically correct.
    // If quoted, store as mixed case, else store as uppercase.
    this.objectName = ObjectPath.toQSYSName(path.substring(currentOffset, nextOffset));
    // Check for special object values.
    if (this.objectName == '%ALL%') {
      this.objectName = '*ALL';
    }
    debug('Object name set to %s', this.objectName);

    this.path = ObjectPath.buildPathName(this.aspName, this.libraryName, this.objectName, this.memberName, this.objectType);
    debug('Path set to %s', this.path);
  }

  static buildPathName(aspName, libraryName, objectName, memberName, objectType) {
    debug('Attempt to build path from %s %s %s %s %s', aspName, libraryName, objectName, memberName, objectType);
    let res = '';

    // Build without asp first then prepend if needed
    res += '/QSYS.LIB';

    if (libraryName) {
      res += '/';
      res += ObjectPath.convertLibraryName(libraryName);
      res += '.LIB';

      if (objectName) {
        res += '/';
        res += objectName;

        if (memberName) {
          res += '.FILE/';
          res += ObjectPath.convertMemberName(memberName);
          res += '.MBR';
        } else {
          res += '.';
          res += objectType;
        }
      }

    }

    if (aspName) {
      res = '/' + aspName + res;
    }

    return res;
  }

  static toQSYSName(name) {
    // Uppercase all unquoted characters _except_ the "Latin small letter 'a' with grave" (\u00E0), which for CCSID 297 (French) gets converted to EBCDIC x7C, an invariant character that is allowed in *NAME strings.
    if (name.indexOf('\u00E0') == -1 &&  // no special characters
        name.indexOf('\"') == -1) {      // and no quotes
      return name.toUpperCase();
    } else {
      let res = '';
      let inQuotes = false;
      for (let i = 0; i < name.length; i++) {
        let c = name[i];
        if (c == '\"') {
          inQuotes = !inQuotes;
        }
        if (!inQuotes && c != '\u00E0') {
          res += c.toUpperCase();
        } else {
          res += c;
        }
      }
      return res;
    }
  }

  static convertLibraryName(libraryName) {
    if (libraryName == '*LIBL') {
      return '%LIBL%';
    }
    if (libraryName == '*CURLIB') {
      return '%CURLIB%';
    }
    if (libraryName == '*USRLIBL') {
      return '%USRLIBL%';
    }
    if (libraryName == '*ALL') {
      return '%ALL%';
    }
    if (libraryName == '*ALLUSR') {
      return '%ALLUSR%';
    }
    return libraryName;
  }

  static convertMemberName(memberName) {
    if (memberName == '*FIRST') {
      return '%FIRST%';
    }
    if (memberName == '*LAST') {
      return '%LAST%';
    }
    if (memberName == '*FILE') {
      return '%FILE%';
    }
    if (memberName == '*ALL') {
      return '%ALL%';
    }
    if (memberName == '*NONE') {
      return '%NONE%';
    }
    return memberName;
  }

}
