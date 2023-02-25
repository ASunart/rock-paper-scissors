const express = require('express');
const os = require('os')
const cors = require('cors');
const serverApp = express();
const PORT = 5050;
const IPaddress = os.networkInterfaces();
const ipv4Addresses = [];

Object.keys(IPaddress).forEach(name => {
  const interfaces = IPaddress[name];
  interfaces.forEach(iface => {
    if (iface.family === 'IPv4' && !iface.internal) {
      ipv4Addresses.push(iface.address);
    }
  });
});

//---------------------------- Setting EJS
serverApp.set('view engine', 'ejs');

//---------------------------- "use" external midleware
serverApp.use(express.json());
serverApp.use(cors({
    origin: '*'
}));

//---------------------------- Server listening
serverApp.listen(PORT, (error) => {
    console.table([
        `http://${ipv4Addresses}:${PORT}/player`,
        `http://${ipv4Addresses}:${PORT}/display`
        ]);
});

//---------------------------- First serve Static resources
serverApp.use('/player', express.static('public-player'));
serverApp.use('/display', express.static('public-display'));

//---------------------------- Dinamic files
serverApp.get('/player', (request, response) => {
    response.render('player', { DNS: `http://${ipv4Addresses}:${PORT}` });
});


serverApp.get('/display', (request, response) => {
    response.render('display', { DNS: `http://${ipv4Addresses}:${PORT}` });
});


//---------------------------- Data base
let players = []; 
// player structure =  {name: ‘’, move: ‘’}

//---------------------------- API Endpoints


serverApp.get('/moves', (request, response) => {
    // send players
    const moves = sendMove(players[1]);
    response.send(moves);
});

serverApp.post('/player', (request, response) => {
    // Add a player to your Server database
    const player = request.body;
    players.push(player);
    response.send('Player added to database');
});

serverApp.put('/make-a-move', (request, response) => {

    upDatePlayerMove(request.body);
    // Validate the player exists, then upate player's move
    response.status(200).send('Player move update succesfully');


});

//---------------------------------------------- Midlewares

const doesPlayerExists = newPlayer => {
    return players.some(player => player.name == newPlayer.name);
};

const addPlayer = newPlayer => {
    // Validate player exists and add only new players

};

const findPlayer = wantedPlayer => {
    return players.find(player => player.name == wantedPlayer.name);
};

const upDatePlayerMove = targetPlayer => {
    // Validate player exists and update move
    const playerIndex = players.findIndex(player => player.name === targetPlayer.name);

    if (playerIndex != targetPlayer) {
      // Player not found, throw an error
      console.log('Player not found');
    }
  
    // Update the player's move
    players[playerIndex].move = targetPlayer.move;
  };
