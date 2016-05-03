'use strict';

import ObjectPath from '../../../src/qsys/object-path';

require('../../common');

describe('ObjectPath', () => {

  describe('#constructor()', () => {

    it('should create default', () => {
      new ObjectPath();
    });

    it('should fail to parse path due to invalid prefix', () => {
      expect(() => {return new ObjectPath({path: '/1/2/3'});}).to.throw(/Invalid path prefix/);
    });

    it('should fail to parse path due to library too long', () => {
      let path = '/qsys.lib/somereallylong.lib/2';
      expect(() => {return new ObjectPath({path: path});}).to.throw(/Invalid library name: Too long/);
    });

    it('should fail to parse path due to invalid library of QSYS', () => {
      let path = '/qsys.lib/qsys.lib/2';
      expect(() => {return new ObjectPath({path: path});}).to.throw(/Invalid library name of QSYS/);
    });

    it('should fail to parse path due to missing object type', () => {
      let path = '/qsys.lib/some.lib/some';
      expect(() => {return new ObjectPath({path: path});}).to.throw(/Invalid object type/);
    });

    it('should fail to parse path due to object name too long', () => {
      let path = '/qsys.lib/some.lib/somereallylong.pgm';
      expect(() => {return new ObjectPath({path: path});}).to.throw(/Invalid object name: Too long/);
    });

    it('should fail to parse with no valid library', () => {
      let path = '/qsys.lib/bad';
      expect(() => {return new ObjectPath({path: path});}).to.throw(/Invalid object type/);
      path = '/qsys.lib/.lib/';
      expect(() => {return new ObjectPath({path: path});}).to.throw(/Invalid library/);
    });

    it('should parse path with special /QSYS.LIB case', () => {
      let path = '/qsys.lib';
      let res = new ObjectPath({path: path});
      res.libraryName.should.equal('QSYS');
      res.objectType.should.equal('LIB');
      res.path.should.equal('/QSYS.LIB');
    });

    it('should parse path with special libaries', () => {
      let path = '/qsys.lib/%libl%.lib/some.pgm';
      let res = new ObjectPath({path: path});
      res.libraryName.should.equal('*LIBL');
      res.objectType.should.equal('PGM');
      res.path.should.equal('/QSYS.LIB/%LIBL%.LIB/SOME.PGM');
      path = '/qsys.lib/%curlib%.lib/some.pgm';
      res = new ObjectPath({path: path});
      res.libraryName.should.equal('*CURLIB');
      path = '/qsys.lib/%usrlibl%.lib/some.pgm';
      res = new ObjectPath({path: path});
      res.libraryName.should.equal('*USRLIBL');
      path = '/qsys.lib/%all%.lib/some.pgm';
      res = new ObjectPath({path: path});
      res.libraryName.should.equal('*ALL');
      path = '/qsys.lib/%allusr%.lib/some.pgm';
      res = new ObjectPath({path: path});
      res.libraryName.should.equal('*ALLUSR');
    });

    it('should parse path with asp', () => {
      let path = '/asp/qsys.lib/some.lib/some.pgm';
      let res = new ObjectPath({path: path});
      res.aspName.should.equal('ASP');
      res.libraryName.should.equal('SOME');
      res.objectName.should.equal('SOME');
      res.objectType.should.equal('PGM');
      res.path.should.equal('/ASP/QSYS.LIB/SOME.LIB/SOME.PGM');
    });

    it('should parse path with special object name', () => {
      let path = '/qsys.lib/some.lib/%all%.pgm';
      let res = new ObjectPath({path: path});
      res.libraryName.should.equal('SOME');
      res.objectName.should.equal('*ALL');
      res.objectType.should.equal('PGM');
    });

    it('should parse path', () => {
      let path = '/qsys.lib/some.lib/some.pgm';
      new ObjectPath({path: path});
    });

  });

  describe('#converMemberName()', () => {

    it('should handle all cases', () => {
      let res;
      res = ObjectPath.convertMemberName('SOME');
      res.should.equal('SOME');
      res = ObjectPath.convertMemberName('*FIRST');
      res.should.equal('%FIRST%');
      res = ObjectPath.convertMemberName('*LAST');
      res.should.equal('%LAST%');
      res = ObjectPath.convertMemberName('*FILE');
      res.should.equal('%FILE%');
      res = ObjectPath.convertMemberName('*ALL');
      res.should.equal('%ALL%');
      res = ObjectPath.convertMemberName('*NONE');
      res.should.equal('%NONE%');
    });

  });

  describe('#convertLibraryName()', () => {

    it('should handle all cases', () => {
      let res;
      res = ObjectPath.convertLibraryName('SOME');
      res.should.equal('SOME');
      res = ObjectPath.convertLibraryName('*LIBL');
      res.should.equal('%LIBL%');
      res = ObjectPath.convertLibraryName('*CURLIB');
      res.should.equal('%CURLIB%');
      res = ObjectPath.convertLibraryName('*USRLIBL');
      res.should.equal('%USRLIBL%');
      res = ObjectPath.convertLibraryName('*ALL');
      res.should.equal('%ALL%');
      res = ObjectPath.convertLibraryName('*ALLUSR');
      res.should.equal('%ALLUSR%');
    });

  });

  describe('#toQSYSName()', () => {

    it('should handle all cases', () => {
      let res;
      res = ObjectPath.toQSYSName('some');
      res.should.equal('SOME');
      res = ObjectPath.toQSYSName('some\"');
      res.should.equal('SOME\"');
      res = ObjectPath.toQSYSName('\u00E0some');
      res.should.equal('\u00E0SOME');
    });

  });

  describe('#buildPathName()', () => {

    it('should handle all cases', () => {
      let res;
      res = ObjectPath.buildPathName(null, null, null, null, null);
      res.should.equal('/QSYS.LIB');
      res = ObjectPath.buildPathName(null, 'LIBRARY', null, null, null);
      res.should.equal('/QSYS.LIB/LIBRARY.LIB');
      res = ObjectPath.buildPathName(null, 'LIBRARY', 'OBJECT', null, 'PGM');
      res.should.equal('/QSYS.LIB/LIBRARY.LIB/OBJECT.PGM');
      res = ObjectPath.buildPathName(null, 'LIBRARY', 'OBJECT', 'MEMBER', 'PGM');
      res.should.equal('/QSYS.LIB/LIBRARY.LIB/OBJECT.FILE/MEMBER.MBR');
      res = ObjectPath.buildPathName('ASP', 'LIBRARY', null, null, null);
      res.should.equal('/ASP/QSYS.LIB/LIBRARY.LIB');
    });

  });

});
