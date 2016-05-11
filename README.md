# IBMi

[![Build Status](https://travis-ci.org/smokerbag/ibmi.svg?branch=master)](https://travis-ci.org/smokerbag/ibmi)
[![Coverage Status](https://coveralls.io/repos/github/smokerbag/ibmi/badge.svg?branch=master)](https://coveralls.io/github/smokerbag/ibmi?branch=master)
[![Dependency Status](https://david-dm.org/smokerbag/ibmi.svg)](https://david-dm.org/smokerbag/ibmi)

## Description

This library is an IBM i (AS400) client for [Node](https://nodejs.org). It is intended for those of you who have the unfortunate requirement to interface with the IBM i. 
It is a port of the [JTOpen](http://jt400.sourceforge.net/) for Java. There are other packages out there, but they only provide a fraction of the features and only wrap 
the Java code. This is in pure Javascript.

## Implemented features

| Service     | Feature                     | Notes |
| ----------- | ----------------------------| ----- |
| Port Mapper | Locate service port by name |       |
| Signon      | Signon to system            |       |
| Data queue  | Create data queue           |       |
| Data queue  | Delete data queue           |       |
| Data queue  | Clear data queue            |       |
| Data queue  | Write to data queue         |       |
| Data queue  | Read from data queue        |       |
| Data queue  | Peek into data queue        |       |

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

#### opts.hostName
Type: `String` (required)

The host name of the remote system.

#### opts.userId
Type: `String` (required)

The user ID.

#### opts.password
Type: `String` (required)

The password.

#### opts.portMapperPort
Type: `Number` (optional)
Default: `449`

The port that the port mapper service runs on. You should probably never have a need to change this.

#### opts.useDefaultPorts
Type: `Boolean` (optional)
Default: `false`

Use the default ports for services instead of looking them up via the port mapper. This can speed up connection times if the system you 
are connecting to uses the default ports.

#### opts.useTLS
Type: `Boolean` (optional)
Default: `false`

Use TLS secure sockets.

#### Example
```js
const IBMi = require('ibmi');

let opts = {
  opts.hostName: 'localhost',
  opts.userId: 'USER',
  opts.password: 'PASSWORD'
};

let ibmi = new IBMi(opts);
```
---

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

#### system
Type: `IBMi` (required)

An IBMi instance.

#### path
Type: `String` (required)

The path of the data queue.

#### Example
```js
const DataQueue = require('ibmi').DataQueue;

let dq = new DataQueue(ibmi, '/QSYS.LIB/SOME.LIB/SOME.DTAQ');
```

---

### clear(key)

Empty the data queue with optional key.

#### key
Type: `Buffer` (optional)

The optional key.

#### Example
```js
dq.clear().then((res) => {
  ...
}).catch((err) => {
  console.log('Error! %', err);
});
```

---

### create(entryLength, opts)

#### entryLength
Type: `Number` (required)

The maximum length for an entry in the data queue.

#### opts
Type: `Object` (optional)

Create options. If you specify this then all options must be set.

#### opts.authority
Type: `String` Default *LIBCRTAUT

Authority level of the data queue.

#### opts.saveSenderInfo
Type: `Boolean` Default false

Whether or not to save sender information.

#### opts.fifo
Type: `Boolean` Default true

Whether or not this should be a FIFO queue.

#### opts.keyLength
Type: `Number` Default 0

The length of the key.

#### opts.forceStorage
Type: `Boolean` Default false

Whether or no this data queue should persist to storage.

#### opts.description
Type: `String` Default Queue

Description of the data queue.

#### Example
```js
dq.create(50).then((res) => {
  ...
}).catch((err) => {
  console.log('Error! %', err);
});
```

---

### delete()

Delete the data queue.

#### Example
```js
dq.delete().then((res) => {
  ...
}).catch((err) => {
  console.log('Error! %', err);
});
```

---

### peek(wait)

Read the first entry in the data queue, but don't remove it.

#### wait
Type: `Number` (optional)

Time to wait in seconds for data to arrive in data queue. -1 indicates to wait indefinitely.

#### Example
```js
dq.peek().then((res) => {
  if (res) {
    console.log(res.data);
  }
}).catch((err) => {
  console.log('Error! %', err);
});
```

---

### read(wait)

Read the first entry in the data queue.

#### wait
Type: `Number` (optional)

Time to wait in seconds for data to arrive in data queue. -1 indicates to wait indefinitely.

#### Example
```js
dq.read().then((res) => {
  if (res) {
    console.log(res.data);
  }
}).catch((err) => {
  console.log('Error! %', err);
});
```

---

### write(data, key)

Write data to the data queue with an optional key.

#### data
Type: `Buffer` (required)

Tyhe data to write.

#### key
Type: `Buffer` (optional)

The optional key.

#### Example
```js
let data = new Buffer('DATA');

dq.write(data).then((res) => {
  ...
}).catch((err) {
  console.log('Error! %', err);  
});
```