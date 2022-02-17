const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL ||'postgres://localhost/dealers_choice_SQL_DB');
const STRING = Sequelize.DataTypes.STRING;
const express = require('express');
const app = express();
const PORT = 4040;

const Team = sequelize.define('team', {
    name: {
        allowNull: false,
        type: STRING,
        validate:{
            notEmpty: true
        }
    }
})
const Player = sequelize.define('player', {
    name: {
        allowNull: false,
        type: STRING,
        validate:{
            notEmpty: true
        }
    },
    playerNumber: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        isUnique: true,
        validate: {
            notEmpty: true
        }
    }
})

Player.belongsTo(Team);
Team.hasMany(Player);

app.get('/', (req, res, next) => {
    res.redirect('/overview');
})

app.get('/overview', async(req, res, next)=> {
    try{
        const teams = await Team.findAll();
        const html = teams.map( e => {
            return `
            <div>
                ${e.name}
                <button><a href='/team/${e.name}'>Roster</a></button>
            </div>
            `
        }).join('');
        res.send(`
        <html>
        <head>
            <title>Select NBA Team Overview</title>
        </head>
        <body>
            <div>
                <h1>NBA Team Overview</h1>
                ${html}
            </div>
        </body>
        </html>
        `);
    }
    catch(e){
        next(e);
    }
})

app.get('/team/:id', async(req, res, next) => {
    try{
        const roster = await Player.findAll()
    }
    catch(e){
        console.log(e);
    }
})

const start = async() => {
    try{
        await sequelize.sync({force: true});
        app.listen(PORT, () => {
            console.log('listening to port: ', PORT)
        })
        const mavericks = await Team.create({name: 'Mavericks'});
        const heats = await Team.create({name: 'Heats'});
        const bulls = await Team.create({name: 'Bulls'});
        await Player.create({name: 'Jalen Brunson', playerNumber: 13, teamId: mavericks.id}),
        await Player.create({name: 'Luka Doncic', playerNumber: 77, teamId: mavericks.id}),
        await Player.create({name: 'Reggie Bullocks', playerNumber: 25, teamId: mavericks.id}),
        await Player.create({name: 'Tim Hardaway Jr.', playerNumber: 11, teamId: mavericks.id}),
        await Player.create({name: 'Maxi Kieber', playerNumber: 42, teamId: mavericks.id}),
        await Player.create({name: 'Bam Adebayo', playerNumber: 13, teamId: heats.id}),
        await Player.create({name: 'Jimmy Butler', playerNumber: 22, teamId: heats.id}),
        await Player.create({name: 'Kyle Guy', playerNumber: 5, teamId: heats.id}),
        await Player.create({name: 'Kyle Lowry', playerNumber: 7, teamId: heats.id}),
        await Player.create({name: 'Caleb Martin', playerNumber: 16, teamId: heats.id}),
        await Player.create({name: 'Lonzo Ball', playerNumber: 2, teamId: bulls.id}),
        await Player.create({name: 'Tony Bradley', playerNumber: 13, teamId: bulls.id}),
        await Player.create({name: 'Troy Brown Jr.', playerNumber: 7, teamId: bulls.id}),
        await Player.create({name: 'Demar Derozan', playerNumber: 11, teamId: bulls.id}),
        await Player.create({name: 'Javonte Green', playerNumber: 24, teamId: bulls.id})
    }
    catch(e){
        console.log(e);
    }
}
start();
