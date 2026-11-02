module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    requireModule: ['ts-node/register'],
    require: ['hooks/**/*.ts', 'step-definitions/**/*.ts'],
    format: ['progress'],
    failFast: false,
  },
};
