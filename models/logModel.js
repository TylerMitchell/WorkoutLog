module.exports =  function(sequelize, DataTypes){
    return sequelize.define('log', {
        description: DataTypes.STRING,
        definition: DataTypes.STRING,
        result: DataTypes.STRING,
        owner_id: DataTypes.INTEGER
    });
};