const { Script } = require('@beemo/core');
const chalk = require('chalk');
const fs = require('fs-extra');
const glob = require('glob');
const semver = require('semver');

const RELEASE_TYPES = ['major', 'minor', 'patch'];

module.exports = class BumpPeerDepsScript extends Script {
  parse() {
    return {
      default: {
        release: 'minor',
      },
      string: ['release'],
    };
  }

  run(options, tool) {
    const { release } = options;

    if (!RELEASE_TYPES.includes(release)) {
      throw new Error('Please pass one of major, minor, or patch to --release.');
    }

    const versions = {};
    const packages = {};
    const packagePaths = {};

    tool.log('Loading packages and incrementing versions');

    glob.sync('./packages/*/package.json', { cwd: tool.options.root }).forEach(path => {
      const data = fs.readJsonSync(path);

      versions[data.name] = semver.inc(data.version, release);
      packages[data.name] = data;
      packagePaths[data.name] = path;
    });

    return Promise.all(
      Object.entries(packages).map(([name, data]) => {
        if (data.peerDependencies) {
          Object.keys(data.peerDependencies).forEach(peerName => {
            if (!versions[peerName]) {
              return;
            }

            const nextVersion = `^${versions[peerName]}`;

            tool.log(
              `Bumping ${chalk.yellow(name)} peer ${chalk.cyan(peerName)} from ${chalk.gray(data.peerDependencies[peerName])} to ${chalk.green(nextVersion)}`,
            );

            // eslint-disable-next-line no-param-reassign
            data.peerDependencies[peerName] = nextVersion;
          });
        }

        return fs.writeJson(packagePaths[name], data, { spaces: 2 });
      })
    );
  }
};