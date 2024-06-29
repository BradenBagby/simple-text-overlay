# simple-text-overlay

<!-- [![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url] -->

> Simple Text overlay

## Install

```bash
npm install simple-text-overlay
```

## Usage

```ts
import { addOverlay } from 'simple-text-overlay';

const overlays: Overlay[] = [
  { start: 0, end: 1, text: 'Hello' },
  { start: 1, end: 2, text: 'World!' },
  { start: 2, end: 3, text: 'Each' },
  { start: 3, end: 4, text: 'second' },
  { start: 4, end: 5, text: 'is' },
  { start: 5, end: 6, text: 'a' },
  { start: 6, end: 7, text: 'new' },
  { start: 7, end: 8, text: 'caption.' },
];

const config = {};

addOverlay('src.mp4', overlays, 'output.mp4', config);
```
