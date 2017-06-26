import { shape, string } from 'prop-types';

export default {
  user: shape({
    displayName: string.isRequired,
    email: string.isRequired,
  }),
};
