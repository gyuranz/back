export default () => ({
    googleCloudConfig: {
      // projectId: 'quantum-age-393411',
      // keyFilename: 'C:/Users/YDG/Documents/STT_API_KEY/quantum-age-393411-fc246ef7d9ef.json',
      projectId: process.env.PROJECT_ID,
      keyFilename: process.env.KEY_FILE_NAME
    },
  });