'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    console.log('up');
    return Promise.all([
      //queryInterface.dropAllTables(),
      this.createUsersTable(queryInterface, Sequelize),
      this.createAlbumsTable(queryInterface, Sequelize),
      this.createImagesTable(queryInterface, Sequelize),
      // this.createTagsTable(queryInterface, Sequelize),
      // this.createPostsTable(queryInterface, Sequelize),
    ]).then(() => {
    });
  },
  down: function (queryInterface) {
    return new Promise((resolve, reject) => {
      resolve();
    });
  },
  createUsersTable(queryInterface, Sequelize) {
    let tableDef = {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      salt: {
        type: Sequelize.STRING,
        allowNull: false
      },
      googleId: {
        type: Sequelize.STRING,
        unique: true
      },
      facebookId: {
        type: Sequelize.STRING,
        unique: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: Sequelize.DATE
    };
    console.log('createUsersTable')
    return queryInterface.createTable('users', tableDef);
  },
  createAlbumsTable(queryInterface, Sequelize) {
    let tableDef = {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        model: 'users',
        key: 'id'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: Sequelize.DATE
    };
    tableDef = Object.assign({}, tableDef);
    return queryInterface.createTable('albums', tableDef);
  },
  createImagesTable(queryInterface, Sequelize) {
    let tableDef = {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      size: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    };
    return queryInterface.createTable('images', tableDef);
  },
  createTagsTable(queryInterface, Sequelize) {
    let tableDef = {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    };
    return queryInterface.createTable('tags', tableDef);
  },
  createPostsTable(queryInterface, Sequelize) {
    let tableDef = {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },
      album: {
        type: Sequelize.UUID,
        allowNull: false,
        model: 'albums',
        key: 'id'
      },
      image: {
        type: Sequelize.UUID,
        allowNull: false,
        model: 'images',
        key: 'id'
      },
      tag: {
        type: Sequelize.UUID,
        allowNull: false,
        model: 'tags',
        key: 'id'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    };
    tableDef = Object.assign({}, tableDef);
    return queryInterface.createTable('posts', tableDef);
  }
};
