export default (sequelize, DataTypes) => {
  return sequelize.define('Comment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    tableName: 'comments',
    updatedAt: false,
    classMethods: {
      associate: function (db) {
        db.Comment.belongsTo(db.Image, { foreignKey: 'ImageId', allowNull: false });
        db.Comment.belongsTo(db.User, { foreignKey: 'UserId', allowNull: false });
      }
    }
  });
}
