export default (sequelize, DataTypes) => {
  return sequelize.define('ImageTags', {
    ImageId: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    TagName: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  }, {
    tableName: 'image_tags',
    indexes: [
      {
        unique: true,
        fields: ['ImageId', 'TagName']
      }
    ]
  });
}
