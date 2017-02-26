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
    referencedField: '_id',
    referenceExistsValueQuery: value => value,
    validators: null,
  }
}
```

A more detailed explanation:

- ```singularName {String}```: singular name of referenced document. 
Default values for single references will be generated using this option.
- ```pluralName {String}```: plural name of referenced document.  
Default values for multiple references will be generated using this option.
- ```fieldName {String}```: field name where the document ids will be stored. 
Defaults to ```singularName``` or ```pluralName``` depending on 
```multiple``` option.
- ```getSingleMethod {String}```: getter name used to retrieve a single 
document. Defaults to ```singularName``` with 'get' prefix.
- ```getMultipleMethod {String}```: getter name used to retrieve multiple 
documents. Defaults to ```pluralName``` with 'get' prefix.
- ```setMethod {String}```: setter name used to set all references. 
Defaults to ```singularName``` or ```pluralName``` (depending on ```multiple```
 option) with 'set' prefix.
- ```addSingleMethod {String}```: method name used to add a single document. 
Defaults to ```singularName``` with 'add' prefix.
- ```addMultipleMethod {String}```: method name used to add multiple documents. 
Defaults to ```pluralName``` with 'add' prefix.
- ```removeSingleMethod {String}```: method name used to remove a single 
document. Defaults to ```singularName``` with 'remove' prefix.
- ```removeMultipleMethod {String}```: method name used to remove multiple 
documents. Defaults to ```pluralName``` with 'remove' prefix.
- ```optional {Boolean}```: determines whether the reference is mandatory or 
not.
- ```multiple {Boolean}```: determines whether the reference is multiple or not.
- ```unique {Boolean}```: indicates whether the references must be unique or 
can be repeated.
- ```collection {String|*}```: collection or name of Astronomy class where the 
referenced document is stored.
- ```referencedField {String}```: name of the referenced field. Defaults to 
'_id'.
- ```referenceExistsValueQuery {Function}```: callback used to generate the 
value part of the query on the `referencesExist` validator. The function will
 be called for each stored value in the field. Defaults to `value => value`.
- ```validators {Array}```: accepts an array of validators like any field would.

##Examples

####1. Simple references

We will create a Post class that must have one category and can have up to 5 
tags.

```js
// Post.js
import { Class } from 'meteor/jagi:astronomy';
import { behaviorName as fieldReference } from 'meteor/zetoff:astronomy-field-reference-behavior';

import Category from './Category';
import Tag from './Tag';

const Post = Class.create({
  name: 'Post',
  behaviors: {
    [fieldReference]: [
      {
        // defines a mandatory `category` field with only one value and
        // adds `setCategory` and `getCategory` helpers
        singularName: 'category',
        collection: Category,
      },
      {
        // defines an optional 'tags' field with a maximum of 5 values and 
        // adds `setTags`, `getTags`, `addTag` and `removeTag` helpers
        singularName: 'tag',
        pluralName: 'tags',
        multiple: true,
        optional: true,
        collection: Tag,
        validators: [{
          name: 'maxLength',
          param: 5,
        }],
      },
    ]
  },
});
```

####2. Own reference

A field of the same Class can also be referenced. We will create a Category 
class that allows a simple hierarchy by adding a `parentCategory` field that 
references another category.

```js
// Category.js
import { Class } from 'meteor/jagi:astronomy';
import { behaviorName as fieldReference } from 'meteor/zetoff:astronomy-field-reference-behavior';

export default Class.create({
  name: 'Category',
  behaviors: {
    [fieldReference]: {
      // defines an optional `parentCategory` field with only one value and
      // adds `setParentCategory` and `getParentCategory` helpers
      singularName: 'parentCategory',
      optional: true,
      // Category does not exist in this scope, but it will once the field 
      // reference is created, so it will loaded by name using Class.get()
      collection: 'Category',
      validators: [
        // in this specific case, a custom validator should be implemented to 
        // prevent a category from referencing itself 
      ],
    },
  },
});
```
