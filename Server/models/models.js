import sequelize from '../db.js';
import { DataTypes } from 'sequelize';

const User = sequelize.define('user', {
    id:             {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true },
    email:          {type: DataTypes.STRING, unique: true, allowNull: false},
    password:       {type: DataTypes.STRING, allowNull: false},
    name: { 
        type: DataTypes.STRING, allowNull: false, 
        validate: {
            len: [2, 50],
        },
    },
    experience:     {type: DataTypes.STRING},
    status:         {type: DataTypes.STRING},
    description:    {type: DataTypes.STRING},
    image:          {type: DataTypes.STRING, defaultValue: "path-to-default-img"},
    role:           {type: DataTypes.STRING, defaultValue: "USER"} 
});


const Recept = sequelize.define('recept', {
    id:                 {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true },
    image:              {type: DataTypes.STRING, defaultValue: "path-to-default-img"},
    title:              {type: DataTypes.STRING, allowNull: false},
    description:        {type: DataTypes.STRING, allowNull: false},
    cookingTime:        {type: DataTypes.STRING, allowNull: false},    
});


const Nationality = sequelize.define('nationality', {
    id:          {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true },
    nationality: {type: DataTypes.STRING, allowNull: false, unique: true},
    description: {type: DataTypes.TEXT, allowNull: true}
});


const Tags = sequelize.define('tags', {
    id:   {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true },
    name: {type: DataTypes.STRING, allowNull: false, unique: true},
});



const RecipeTags = sequelize.define('recipeTags', {
    id:   {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true },
    
});


const UserTags = sequelize.define('userTags', {
    id:   {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true },
    type: {type: DataTypes.STRING, allowNull: false, unique: false},

});


const Ingredient = sequelize.define('ingredient', {
    id:                 {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true },
    name:               {type: DataTypes.STRING,  allowNull: true},
    brand:              {type: DataTypes.STRING,  allowNull: true}, // brand, generic etc..

    calories:           {type: DataTypes.STRING, allowNull: true},
    fat:                {type: DataTypes.STRING, allowNull: true},
    carbs:              {type: DataTypes.STRING, allowNull: true},
    protein:            {type: DataTypes.STRING, allowNull: true},

    unit:               {type: DataTypes.STRING, allowNull: true},  // размерность типо г - граммы
    baseAmount:         {type: DataTypes.STRING, allowNull: true}, // количество размерностей типо 100
    selectedAmount:     {type: DataTypes.STRING, allowNull: true} // сколько в рецепте
});


const UniqueIngredient = sequelize.define('uniqueIngredient', {
    id:                 {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true },
    name:               {type: DataTypes.STRING,  allowNull: true},
});


const CookingStep = sequelize.define('cookingStep', {
    id:      {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true },
    number:  {type: DataTypes.INTEGER},
    title:   {type: DataTypes.STRING, allowNull: false},
    text:    {type: DataTypes.STRING},
    photo:   {type: DataTypes.STRING},
    video:   {type: DataTypes.STRING},
});


const Comment = sequelize.define('comment', {
    id:                 {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true },
    text:               {type: DataTypes.STRING},
    grade:              {type: DataTypes.INTEGER, validate: { len: [1, 5] }, allowNull: false},
});


// Категории избранного
const FavouriteCategory = sequelize.define('favouriteCategory', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false }
});

// Избранное: связка User + Recept + FavouriteCategory
const Favourite = sequelize.define('favourite', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});


Comment.belongsTo(User);
User.hasMany(Comment);

Comment.belongsTo(Recept);
Recept.hasMany(Comment);


// Связи
Favourite.belongsTo(User);
User.hasMany(Favourite);

Favourite.belongsTo(Recept);
Recept.hasMany(Favourite);

Favourite.belongsTo(FavouriteCategory);
FavouriteCategory.hasMany(Favourite);


FavouriteCategory.belongsTo(User);
User.hasMany(FavouriteCategory);


User.hasMany(Recept);
Recept.belongsTo(User);


Recept.hasMany(Ingredient , { as: "ingredients" });
Ingredient.belongsTo(Recept);



Recept.belongsToMany(Tags, { through: 'recipeTags' });
Tags.belongsToMany(Recept, { through: 'recipeTags' });
RecipeTags.belongsTo(Tags, { foreignKey: 'tagId' });


// предпочтения
User.belongsToMany(Tags, { through: 'userTags' });
Tags.belongsToMany(User, { through: 'userTags' });
UserTags.belongsTo(Tags, { foreignKey: 'tagId' });


Recept.hasMany(CookingStep, {as: "steps"});
CookingStep.belongsTo(Recept)


// Национальность
Nationality.hasMany(Recept);
Recept.belongsTo(Nationality);



export {User, Recept, Nationality, 
    Tags, Ingredient, CookingStep, Favourite, Comment, FavouriteCategory, UniqueIngredient, RecipeTags, UserTags };

