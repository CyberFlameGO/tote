import { shape, string, object, objectOf, arrayOf, number } from 'prop-types';

export default {
  user: shape({
    displayName: string.isRequired,
    email: string.isRequired,
  }),
  notes: objectOf(shape({
    text: object.isRequired,
    lastModified: number.isRequired,
    tags: arrayOf(string),
  }))
};
