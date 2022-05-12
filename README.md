<p align="center">
  <a href="http://aws.com/" target="blank">
    <img src="https://gcbinvestimentos.com/_next/image?url=%2Fassets%2Fillustrations%2Flogo_gcb_color.svg&w=256&q=75" width="120" alt="SSM Logo" />
  </a>
  <a href="https://github.com/@grupo-gcb/fast-ssm" target="blank">
    <h1 align="center">@grupo-gcb/fast-ssm</h1>
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@grupo-gcb/fast-ssm" target="_blank">
    <img src="https://img.shields.io/npm/v/@grupo-gcb/fast-ssm.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/package/@grupo-gcb/fast-ssm" target="_blank">
    <img src="https://img.shields.io/npm/l/@grupo-gcb/fast-ssm.svg" alt="Package License" />
  </a>
  <a href="https://codecov.io/gh/@grupo-gcb/fast-ssm" target="_blank">
    <img src="https://codecov.io/gh/@grupo-gcb/fast-ssm/branch/master/graph/badge.svg?token=pMLNZOxXiq" alt="codecov coverage" />
  </a>
</p>

## Description

fast-ssm is a simple and lightweight lib to get parameter-score values from AWS with caching strategies.

This library internally uses [vandium-io/aws-param-store](https://github.com/vandium-io/aws-param-store).

## Installation

```sh
$ npm i --save @grupo-gcb/fast-ssm
# or
$ yarn add @grupo-gcb/fast-ssm
```

## Usage

### Simple usage

```javascript
import { getSync } from '@grupo-gcb/fast-ssm';

getSync({
  path: '/path/to/value',
});
```

### Advanced usage

```javascript
import { getSync } from '@grupo-gcb/fast-ssm';

getSync({
  path: '/adiante/microservices/adiante-cliente/host',
  default: process.env.ADIANTE_CLIENTE_URL,
  cacheTime: 10,
  logLevel: 'debug',
  region: 'us-east-2',
  throwError: false,
});
```

### Configuration

There are some optional parameters you can use, as you've seen above. Let's go to them:

| param          | type              | default   | description                                                                          |
| -------------- | ----------------- | --------- | ------------------------------------------------------------------------------------ |
| **default**    | string            | null      | value that will be used if communication with aws fails                              |
| **cacheTime**  | number            | 30        | time in minutes to use cache                                                         |
| **logLevel**   | off, error, debug | error     | defines at which level the lib should log                                            |
| **throwError** | boolean           | false     | defines if the lib throws an error if there is a failure to get the parameter in aws |
| **region**     | string            | us-east-1 | AWS region                                                                           |

---
