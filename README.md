# Field reference behavior for Meteor Astronomy

You can add the `fieldReference` behavior to your project by executing the following command.

```sh
meteor add zetoff:astronomy-field-reference-behavior
```

The `fieldReference` behavior adds a field that stores a document's id.

The `fieldReference` behavior comes with following options.

```js
behaviors: {
  userstamp: {
    fieldName: 'docRef',
    cacheName: null,
    getterName: null,
    optional: false,
    astroClass: null,
  }
}
```
A more detailed explanation:

- ```fieldName {String}```: field name where the document id will be stored.
- ```cacheName {String}```: transient field name where the document will be stored when it is loaded using the getter method. Defaults to the field name with '_' prefixed (for field name 'docRef', cache name will be '_docRef').
- ```getterName {String}```: getter name used to retrieve the document. Defaults to the field name with 'get' prefixed (for field name 'docRef', getter will be 'getDocRef').
- ```optional {Boolean}```: determines whether the reference is mandatory or not
- ```astroClass {String|Astro.Class}```: name or astronomy class where the referenced document is stored. 
