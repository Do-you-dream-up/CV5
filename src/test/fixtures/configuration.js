import { mergeDeep } from '../../tools/helpers';
export const getConfigurationObject = (updates = {}) => {
  const base = {
    secondary: {
      automatic: {
        desktop: true,
        fullScreen: false,
      },
    },
    avatar: {
      response: {
        enable: false,
        image: '',
      },
    },
    interaction: {
      displayNameBot: false,
      displayNameUser: false,
      NameUser: '',
      NameBot: 'Test bot',
      loader: [400, 600],
    },
    header: {
      logo: {
        customAvatar: false,
        title: true,
        image: true,
        imageLink: {
          misunderstood: '',
          reword: '',
          understood: '',
        },
      },
    },
  };

  return mergeDeep(base, updates);
};
