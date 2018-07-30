export default (sequelize, DataTypes) => {
  return sequelize.define('AlbumImages', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    }
  }, {
    tableName: 'album_images',
  });
}
