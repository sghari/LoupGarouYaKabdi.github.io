class RoleAssigner {
    constructor() {
        // Performance optimization: Predefined roles configuration
        this.rolesConfig = Object.freeze([
            { name: 'Loup-Garou', max: null, current: 0 },
            { name: 'Voyante', max: 1, current: 0 },
            { name: 'Sorcière', max: 1, current: 0 },
            { name: 'Chasseur', max: 1, current: 0 },
            { name: 'Cupidon', max: 1, current: 0 },
            { name: 'Alien', max: 1, current: 0 },
            { name: 'Ours', max: 1, current: 0 },
            { name: 'L\'Ancien', max: 1, current: 0 },
            { name: 'Corbeau', max: 1, current: 0 },
            { name: 'Barbie', max: 1, current: 0 },
            { name: 'Berger', max: 1, current: 0 }
        ]);
    }

    // Improved error handling and input validation
    validatePlayers(players) {
        console.log('Validating players:', players); // Debugging log

        if (!Array.isArray(players)) {
            console.error('Input is not an array:', players);
            throw new TypeError('Players must be an array');
        }

        const sanitizedPlayers = players
            .map(player => player.trim())
            .filter(player => player.length > 0);

        console.log('Sanitized players:', sanitizedPlayers); // Debugging log

        if (sanitizedPlayers.length === 0) {
            console.error('No valid player names');
            throw new Error('No valid player names provided');
        }

        if (sanitizedPlayers.length > 20) {
            console.error('Too many players:', sanitizedPlayers.length);
            throw new Error('Maximum 20 players allowed');
        }

        // Check for duplicate names
        const uniquePlayers = new Set(sanitizedPlayers);
        if (uniquePlayers.size !== sanitizedPlayers.length) {
            console.error('Duplicate player names detected');
            throw new Error('Duplicate player names are not allowed');
        }

        return sanitizedPlayers;
    }

    assignRoles(players) {
        try {
            console.log('Starting role assignment for players:', players); // Debugging log

            // Validate and sanitize input
            const validPlayers = this.validatePlayers(players);

            // Deep clone roles to prevent mutation
            const availableRoles = JSON.parse(JSON.stringify(this.rolesConfig));
            const playerRoles = {};

            // Deterministic role assignment with controlled randomness
            const shuffledPlayers = this.shuffleArray([...validPlayers]);

            console.log('Shuffled players:', shuffledPlayers); // Debugging log

            // First pass: Assign unique roles
            for (let player of shuffledPlayers) {
                const uniqueRoleIndex = availableRoles.findIndex(
                    role => role.max === 1 && role.current === 0
                );

                if (uniqueRoleIndex !== -1) {
                    const selectedRole = availableRoles[uniqueRoleIndex];
                    playerRoles[player] = selectedRole.name;
                    selectedRole.current++;
                }
            }

            console.log('Roles after first pass:', playerRoles); // Debugging log

            // Second pass: Assign remaining players as Werewolves
            for (let player of shuffledPlayers) {
                if (!playerRoles[player]) {
                    const werewolfRole = availableRoles.find(role => role.name === 'Loup-Garou');

                    if (werewolfRole.max === null) {
                        playerRoles[player] = 'Loup-Garou';
                        werewolfRole.current++;
                    }
                }
            }

            // If there are still unassigned players, throw an error
            const unassignedPlayers = shuffledPlayers.filter(player => !playerRoles[player]);
            if (unassignedPlayers.length > 0) {
                throw new Error(`Not enough roles for all players. Unassigned: ${unassignedPlayers.join(', ')}`);
            }

            console.log('Final player roles:', playerRoles); // Debugging log

            return playerRoles;
        } catch (error) {
            console.error('Role Assignment Error:', error);
            throw error;
        }
    }

    // Fisher-Yates shuffle algorithm for fair randomization
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// Enhanced Frontend Interaction with Performance and Accessibility
document.addEventListener('DOMContentLoaded', () => {
    const playerForm = document.getElementById('player-form');
    const playerNamesTextarea = document.getElementById('player-names');
    const assignRolesButton = document.getElementById('assign-roles');
    const roleOutputDiv = document.getElementById('role-output');
    const roleAssigner = new RoleAssigner();

    // Debounce function to prevent rapid, unnecessary processing
    function debounce(func, delay) {
        let timeoutId;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(context, args), delay);
        };
    }

    // Accessibility: Add ARIA attributes
    assignRolesButton.setAttribute('aria-label', 'Assign Game Roles');
    playerNamesTextarea.setAttribute('aria-describedby', 'player-names-hint');

    const assignRolesHandler = debounce(() => {
        try {
            // Clear previous output with fade animation
            roleOutputDiv.innerHTML = '';
            roleOutputDiv.classList.add('animate-entry');

            const players = playerNamesTextarea.value
                .split('\n')
                .map(name => name.trim())
                .filter(name => name !== '');

            console.log('Input players:', players); // Debugging log

            const assignedRoles = roleAssigner.assignRoles(players);

            // Accessibility: Add role output title
            const titleElement = document.createElement('h2');
            titleElement.textContent = 'Assigned Roles';
            titleElement.setAttribute('aria-live', 'polite');
            roleOutputDiv.appendChild(titleElement);

            // Performance: Use DocumentFragment for batch DOM updates
            const fragment = document.createDocumentFragment();
            Object.entries(assignedRoles).forEach(([player, role]) => {
                const roleElement = document.createElement('p');
                roleElement.textContent = `${player}: ${role}`;
                roleElement.setAttribute('role', 'status');
                fragment.appendChild(roleElement);
            });

            roleOutputDiv.appendChild(fragment);
        } catch (error) {
            console.error('Frontend Error:', error); // Detailed error logging
            roleOutputDiv.innerHTML = `
                <h2 role="alert" aria-live="assertive">Error</h2>
                <p style="color: red;">${error.message || 'Unexpected error occurred'}</p>
            `;
        }
    }, 300);

    // Event Listeners with Passive Mode for Performance
    assignRolesButton.addEventListener('click', assignRolesHandler, { passive: true });
});
