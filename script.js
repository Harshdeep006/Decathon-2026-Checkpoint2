async function sendAlert() {
    const inputField = document.getElementById('emergencyInput');
    const logDiv = document.getElementById('agentLog');
    const situation = inputField.value;

    if (!situation) return alert("Please describe an emergency first!");

    // 1. Show "Thinking" state
    logDiv.innerText = "> AI Agent is analyzing satellite data...";
    
    try {
        // 2. Send to Backend
        const response = await fetch('/api/optimize-traffic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ situation: situation })
        });

        const data = await response.json();

        // 3. Update the UI based on AI response
        updateSector('sector1', data.lights.sector1);
        updateSector('sector2', data.lights.sector2);
        updateSector('sector3', data.lights.sector3);
        updateSector('sector4', data.lights.sector4);

        // 4. Show the AI's reason
        logDiv.innerText = `> ACTION TAKEN: ${data.reason}`;

    } catch (error) {
        console.error(error);
        logDiv.innerText = "> ERROR: Connection to Agent Lost.";
    }
}

function updateSector(sectorId, color) {
    const sectorDiv = document.getElementById(sectorId);
    const lightDiv = sectorDiv.querySelector('.traffic-light');
    const textSpan = sectorDiv.querySelector('.status-text');

    // Reset classes
    lightDiv.className = 'traffic-light';
    
    // Add new color class
    if (color.toLowerCase() === 'green') {
        lightDiv.classList.add('green');
        textSpan.innerText = "GO (Emergency Corridor)";
        textSpan.style.color = "#00e676";
    } else {
        lightDiv.classList.add('red');
        textSpan.innerText = "STOP";
        textSpan.style.color = "#ff4d4d";
    }
}