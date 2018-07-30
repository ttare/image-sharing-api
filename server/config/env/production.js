export default {
  env: 'production',
  port: 80,
  db: {
    name: 'image-sharing-db',
    username: 'postgress',
    password: 'root',
    options: {
      dialect: 'postgres'
    }
  },
  frontend: 'public/dist'
}
