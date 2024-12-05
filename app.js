async function assignRoles() {
    const playerNames = document.getElementById('player-names').value.trim().split('\n').filter(name => name.trim() !== '');
    if (playerNames.length > 20) {
        alert('Please enter up to 20 player names.');
        return;
    }

    try {
        const response = await fetch('/assignRoles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ players: playerNames })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const roleOutput = document.getElementById('role-output');
        roleOutput.innerHTML = '<h2>Assigned Roles:</h2>';
        data.roles.forEach((role, index) => {
            roleOutput.innerHTML += `<p>${playerNames[index]}: ${role}</p>`;
        });
    } catch (error) {
        console.error('Error:', error);
        alert('There was a problem assigning roles. Please try again later.');
    }
}

document.getElementById('assign-roles').addEventListener('click', assignRoles);
