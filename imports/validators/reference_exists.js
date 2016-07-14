import { check } from 'meteor/check';
import { Class as AstroClass, Validator } from 'meteor/jagi:astronomy';

export default Validator.create({
  name: 'referenceExists',
  parseParam({param}) {
    check(param, AstroClass);
  },
  isValid({value, param}) {
    debugger;
    const referencedDoc = param.findOne({
      _id: value,
    });
    return !!referencedDoc;
  },
  resolveError({ name, value, param }) {
    return `Could not assign "${name}" because no ${param.astroClass} was found with id "${value}"`;
  }
});
