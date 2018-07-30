export default {
  env: 'development',
  port: 8000,
  db: {
    name: 'null',
    username: 'null',
    password: 'null',
    options: {
      dialect: 'sqlite',
      storage: "image_sharing.sqlite"
    }
  },
  frontend: 'public/src'
}
