
module.exports = ({ config }) => {
    console.log(config.name, config.slug, config.scheme, process.env.EXPO_PUBLIC_ANDROID_MAPS_KEY)

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