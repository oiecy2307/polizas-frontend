/*
 * Users Messages
 *
 * This contains all the text for the Users container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.Users';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the Users container!',
  },
});
