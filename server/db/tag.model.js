export default (sequelize, DataTypes) => {
  return sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'tags',
    classMethods: {
      associate: function (db) {
        db.Tag.belongsToMany(db.Image, {through: db.ImageTags, foreignKey: 'TagName'})
      }
    }
  });
}
