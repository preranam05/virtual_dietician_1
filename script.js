document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('user-info-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        // Show a loading message when generating the plan
        const planContainer = document.getElementById('generatedPlan');
        planContainer.innerHTML = `<p class='loading-message'>Please be patient while we generate your personalized plan...</p>`;

        // Collect user input
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const weight = document.getElementById('weight').value;
        const height = document.getElementById('height').value;
        const gender = document.getElementById('gender').value;
        const preferences = document.getElementById('preferences').value;
        const allergies = document.getElementById('allergies').value;
        const activityLevel = document.getElementById('activity-level').value;
        const goal = document.getElementById('goal').value;

        // Create an object with user input
        const userData = {
            name,
            age,
            weight,
            height,
            gender,
            preferences,
            allergies,
            activity_level: activityLevel,
            goal
        };

        try {
            // Send the user data to the backend using a POST request
            const response = await fetch('http://127.0.0.1:5000/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            // Parse the response from the backend
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();

            // Format and display the generated plan
            planContainer.innerHTML = formatPlan(result.plan);
        } catch (error) {
            console.error('Error:', error);
            planContainer.innerHTML = `<p>Error generating the plan: ${error.message}</p>`;
        }
    });
});


// Function to format the plan data into HTML structure
function formatPlan(planText) {
    let formattedPlan = "<h3>This is your AI-generated Diet and Workout Plan:</h3>";
    
    // Split the text into lines and create paragraphs for each line
    const planLines = planText.split('\n').filter(line => line.trim() !== '');
    planLines.forEach(line => {
        if (line.startsWith("###")) {
            formattedPlan += `<h3>${line.replace("###", "")}</h4>`;
        } else if (line.startsWith("-")) {
            formattedPlan += `<p>${line}</p>`;
        } else {
            formattedPlan += `<p>${line}</p>`;
        }
    });

    formattedPlan += `<p>If you have any queries or require further assistance, feel free to contact us!</p>`;
    
    return formattedPlan;
}

// Function to format the plan data into HTML structure
function formatPlan(planText) {
    let formattedPlan = "<h3>Your AI-Generated Diet and Workout Plan</h3>";

    // Remove */ and replace ** with bold tags
    planText = planText.replace(/\*\*/g, '<strong>');  // Replace '**' with opening bold tag
    planText = planText.replace(/\*\*/g, '</strong>');  // Replace '**' with closing bold tag
    planText = planText.replace(/\*\//g, '');  // Remove '*/'

    // Handle "#" for headings (e.g., # Day 1: Cardio and Upper Body)
    planText = planText.replace(/#\s*(.+)/g, '<h4>$1</h4>');

    // Split the text into lines and create paragraphs for each line
    const planLines = planText.split('\n').filter(line => line.trim() !== '');
    planLines.forEach(line => {
        // Handle "- " for lists (e.g., - Protein: 2g per kg body weight)
        if (line.startsWith("-")) {
            formattedPlan += `<p>${line}</p>`;
        } 
        // Handle meal or workout options
        else if (line.match(/^\d+\.\s*/)) {
            formattedPlan += `<p><strong>${line}</strong></p>`;
        } 
        // Otherwise, wrap in paragraph
        else {
            formattedPlan += `<p>${line}</p>`;
        }
    });

    formattedPlan += `<p>If you have any queries or require further assistance, feel free to contact us!</p>`;
    
    return formattedPlan;
}

// Function to format the plan data into HTML structure
function formatPlan(planText) {
    let formattedPlan = `<h3 class='centered'>Your AI-Generated Diet and Workout Plan</h3>`;

    // Replace **text** with <strong>text</strong> for bolding, handle `#`, `##`, and remove */
    planText = planText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');  // Bold text between **
    planText = planText.replace(/\*\//g, '');  // Remove '*/'
    planText = planText.replace(/^## (.*)/gm, '<h4>$1</h4>');  // Handle `##` as <h4> for subheadings
    planText = planText.replace(/^# (.*)/gm, '<h4>$1</h4>');  // Convert `#` into <h4> for steps

    // Split the text into lines and create paragraphs for each line
    const planLines = planText.split('\n').filter(line => line.trim() !== '');
    
    // Column structure for aesthetic
    formattedPlan += `<div class="plan-columns">`; // Start a two-column layout

    // Divide into clean sections based on the content
    planLines.forEach(line => {
        if (line.startsWith("###")) {
            formattedPlan += `<h4>${line.replace("###", "")}</h4>`;
        } else if (line.startsWith("-")) {
            formattedPlan += `<p>${line}</p>`;  // Bullet points
        } else if (line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.")) {
            formattedPlan += `<p>${line}</p>`;  // Numbered lists
        } else {
            formattedPlan += `<p>${line}</p>`;  // Regular text
        }
    });

    formattedPlan += `</div>`; // Close the two-column layout

    formattedPlan += `<p>If you have any queries or require further assistance, feel free to contact us!</p>`;
    
    return formattedPlan;
}
