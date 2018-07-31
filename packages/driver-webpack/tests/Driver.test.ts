import WebpackDriver from '../src/WebpackDriver';

describe('WebpackDriver', () => {
  let driver: WebpackDriver;

  beforeEach(() => {
    driver = new WebpackDriver();
    driver.bootstrap();
  });

  it('sets options from constructor', () => {
    driver = new WebpackDriver({
      args: ['--foo', '--bar=1'],
      dependencies: ['babel'],
      env: { DEV: 'true' },
    });

    expect(driver.options).toEqual({
      args: ['--foo', '--bar=1'],
      copy: false,
      dependencies: ['babel'],
      env: { DEV: 'true' },
    });
  });

  it('sets correct metadata', () => {
    expect(driver.metadata).toEqual(
      expect.objectContaining({
        bin: 'webpack',
        configName: 'webpack.config.js',
        configOption: '--config',
        dependencies: [],
        description: 'Bundle source files with Webpack',
        filterOptions: false,
        helpOption: '--help',
        title: 'Webpack',
        useConfigOption: false,
      }),
    );
  });
});
