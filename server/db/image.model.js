export default (sequelize, DataTypes) => {
  return sequelize.define('Image', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'images',
    updatedAt: false,
    classMethods: {
      associate: function (db) {
        db.Image.belongsTo(db.Album, {through: db.AlbumImages});
        db.Image.belongsToMany(db.Tag, {through: db.ImageTags, foreignKey: 'ImageId'});
        db.Image.hasMany(db.Comment, { foreignKey: 'ImageId' });
        db.Image.hasMany(db.Like, { foreignKey: 'ImageId' });
      }
    }
  });
}
