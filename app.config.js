
module.exports = ({ config }) => {
    const newConfig = {
        ...config,
        android : {
          ...config.android,  
          config: {
              googleMaps: {
                apiKey: process.env.EXPO_PUBLIC_ANDROID_MAPS_KEY,
              },
            },
        },
      };
    return newConfig
  };