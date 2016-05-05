# IBMi

[![Build Status](https://travis-ci.org/smokerbag/ibmi.svg?branch=master)](https://travis-ci.org/smokerbag/ibmi)
[![Coverage Status](https://coveralls.io/repos/github/smokerbag/ibmi/badge.svg?branch=master)](https://coveralls.io/github/smokerbag/ibmi?branch=master)
[![Dependency Status](https://david-dm.org/smokerbag/ibmi.svg)](https://david-dm.org/smokerbag/ibmi)

## Description

This library is an IBM i (AS400) client for [Node](https://nodejs.org). It is intended for those of you who have the unfortunate requirement to interface with the IBM i. 
It is a port of the [JTOpen](http://jt400.sourceforge.net/) for Java. There are other packages out there, but they only provide a fraction of the features and only wrap 
the Java code. This in pure Javascript.

## Implemented features

| Service     | Feature                     | Notes |
| ----------- | ----------------------------| ----- |
| Port Mapper | Locate service port by name |       |
| Signon      | Signon to system            |       |
| Data queue  | Create data queue           |       |
| Data queue  | Delete data queue           |       |
| Data queue  | Clear data queue            |       |
| Data queue  | Write to data queue         |       |

API
--------------

### IBMi class

The IBMi class is the main class of the library. It represents a remote IBMi system.

### Constructor(opts)

System options.

#### opts
Type: `Object` (required)
```js
{
  hostName: 'localhost',
  ...other IBMi options...
}
```

#### hostName
Type: `String` (required)

The host name of the remote system.

#### userId
Type: `String` (required)

The user ID.

#### password
Type: `String` (required)

The password.

#### portMapperPort
Type: `Number` (optional)
Default: `449`

The port that the port mapper service runs on. You should probably never have a need to change this.

#### useDefaultPorts
Type: `Boolean` (optional)
Default: `false`

Use the default ports for services instead of looking them up via the port mapper. This can speed up connection times if the system you 
are connecting to uses the default ports.

#### useTLS
Type: `Boolean` (optional)
Default: `false`

Use TLS secure sockets.

#### Example
```js
import IBMi from 'ibmi';

let opts = {
  opts.hostName: 'localhost',
  opts.userId: 'USER',
  opts.password: 'PASSWORD'
};

let ibmi = new IBMi(opts);
```

### signon()

Signon on to the remote system.

#### Example
```js
ibmi.signon().then((res) => {
  console.log(res);
}).catch((err) => {
  console.log('Error! %s', err);
});
```
--------------

### DataQueue class

The DataQueue class allows you to perform operations on a data queue.

### Constructor(system, path)

Remote system and data queue path.