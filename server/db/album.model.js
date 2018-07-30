export default (sequelize, DataTypes) => {
  return sequelize.define('Album', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Initial Album'
    }
  }, {
    tableName: 'albums',
    classMethods: {
      associate: function (db) {
        db.Album.belongsTo(db.User, {foreignKey: 'userId'});
        db.Album.belongsToMany(db.Image, {through: db.AlbumImages});
      }
    }
  });
}
