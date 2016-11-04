# Field reference behavior for Meteor Astronomy

You can add the `fieldReference` behavior to your project by executing the following command.

```sh
meteor add zetoff:astronomy-field-reference-behavior
```

The `fieldReference` behavior adds a field that stores a document's id.

## Options

The `fieldReference` behavior comes with following options.

```js
behaviors: {
  fieldReference: {
    singularName: 'docRef',
    pluralName: 'docRefs',
    fieldName: null,
    getSingleMethod: null,
    getMultipleMethod: null,
    setMethod: null,
    addSingleMethod: null,
    addMultipleMethod: null,
    removeSingleMethod: null,
    removeMultipleMethod: null,
    optional: false,
    multiple: false,
    unique: true,
    collection: null,
    validators: null,
  }
}
```
A more detailed explanation:

- ```singularName {String}```: singular name of referenced document. Default values for single references will be generated using this option.
- ```pluralName {String}```: plural name of referenced document.  Default values for multiple references will be generated using this option.
- ```fieldName {String}```: field name where the document ids will be stored. Defaults to ```singularName``` or ```pluralName``` depending on ```multiple``` option.
- ```getSingleMethod {String}```: getter name used to retrieve a single document. Defaults to ```singularName``` with 'get' prefix.
- ```getMultipleMethod {String}```: getter name used to retrieve multiple documents. Defaults to ```pluralName``` with 'get' prefix.
- ```setMethod {String}```: setter name used to set all references. Defaults to ```singularName``` or ```pluralName``` (depending on ```multiple``` option) with 'set' prefix.
- ```addSingleMethod {String}```: method name used to add a single document. Defaults to ```singularName``` with 'add' prefix.
- ```addMultipleMethod {String}```: method name used to add multiple documents. Defaults to ```pluralName``` with 'add' prefix.
- ```removeSingleMethod {String}```: method name used to remove a single document. Defaults to ```singularName``` with 'remove' prefix.
- ```removeMultipleMethod {String}```: method name used to remove multiple documents. Defaults to ```pluralName``` with 'remove' prefix.
- ```optional {Boolean}```: determines whether the reference is mandatory or not.
- ```multiple {Boolean}```: determines whether the reference is multiple or not.
- ```unique {Boolean}```: indicates whether the references must be unique or can be repeated.
- ```collection {String|*}```: collection or name of Astronomy class where the referenced document is stored.
- ```validators {Array}```: accepts an array of validators like any field would.
