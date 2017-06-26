import { shape, string, objectOf, arrayOf, number } from 'prop-types';

export default {
  user: shape({
    displayName: string.isRequired,
    email: string.isRequired,
  }),
  notes: objectOf(shape({
    text: string.isRequired,
    lastModified: number.isRequired,
    tags: arrayOf(string),
  }))
};
