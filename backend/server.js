const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('../frontend'));

const roles = [
    'Loup-Garou', 'Villageois', 'Voyante', 'Sorcière', 'Chasseur',
    'Cupidon', 'Alien', 'Ours', 'L\'Ancien', 'Corbeau',
    'Barbie', 'Berger'
];

app.post('/assignRoles', (req, res) => {
    const players = req.body.players;
    const assignedRoles = assignRoles(players.length);
    res.json({ roles: assignedRoles });
});

function assignRoles(playerCount) {
    let assignedRoles = [];
    const availableRoles = [...roles];

    // Add multiple Loup-Garou if needed
    const loupGarouCount = Math.floor(playerCount / 4);
    for (let i = 0; i < loupGarouCount; i++) {
        assignedRoles.push('Loup-Garou');
    }

    // Shuffle and assign remaining roles
    while (assignedRoles.length < playerCount) {
        const randomIndex = Math.floor(Math.random() * availableRoles.length);
        assignedRoles.push(availableRoles.splice(randomIndex, 1)[0]);
    }

    return assignedRoles;
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
