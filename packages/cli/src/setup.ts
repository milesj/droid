/* eslint-disable import/no-extraneous-dependencies */

import debug from 'debug';
import { Tool } from '@beemo/core';
import corePackage from '@beemo/core/package.json';
import { applyStyle, Program } from '@boost/cli';
import parseSpecialArgv from './parseSpecialArgv';

const brandName = process.env.BEEMO_BRAND_NAME || 'Beemo';
const binName = process.env.BEEMO_BRAND_BINARY || 'beemo';
const manualURL = process.env.BEEMO_MANUAL_URL || 'https://milesj.gitbook.io/beemo';

process.env.BOOSTJS_DEBUG_NAMESPACE = binName;

// Instrument our CLI for require() performance
if (process.env.TIMING) {
  // eslint-disable-next-line global-require
  require('time-require');

  // Boost doesn't enable the debugger early enough,
  // so enable it here if we encounter the debug flag.
} else if (process.argv.includes('--debug')) {
  debug.enable(`${binName}:*`);
}

export const { argv, parallelArgv } = parseSpecialArgv(process.argv.slice(2));

export const tool = new Tool({
  argv,
  projectName: binName,
});

const version = String(corePackage.version);

const footer = applyStyle(
  [tool.msg('app:cliEpilogue', { manualURL }), tool.msg('app:poweredBy', { version })].join('\n'),
  'muted',
);

export const program = new Program({
  bin: binName,
  footer,
  name: brandName,
  version,
});
