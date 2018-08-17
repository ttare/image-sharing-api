export default (sequelize, DataTypes) => {
  return sequelize.define('Like', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    value: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'likes',
    updatedAt: false,
    indexes: [
      {
        unique: true,
        fields: ['ImageId', 'UserId']
      }
    ],
    classMethods: {
      associate: function (db) {
        db.Like.belongsTo(db.Image, { foreignKey: 'ImageId', allowNull: false });
        db.Like.belongsTo(db.User, { foreignKey: 'UserId', allowNull: false });
      }
    }
  });
}
