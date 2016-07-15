Package.describe({
  name: 'zetoff:astronomy-field-reference-behavior',
  version: '0.1.0',
  summary: 'Adds a field to an astronomy class that references to another document.',
  git: 'https://github.com/Zetoff/astronomy-field-reference-behavior',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3.4.4');
  api.use('ecmascript');
  api.use('jagi:astronomy@2.0.1');
  api.use('stevezhu:lodash@4.6.1');
  api.mainModule('astronomy-field-reference-behavior.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('mongo');
  api.use('practicalmeteor:mocha');
  api.use('practicalmeteor:chai');
  api.use('jagi:astronomy@2.0.1');
  api.use('stevezhu:lodash@4.6.1')
  api.use('zetoff:astronomy-field-reference-behavior');
  api.mainModule('astronomy-field-reference-behavior-tests.js');
});
