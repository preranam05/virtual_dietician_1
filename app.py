from flask import Flask, request, jsonify
import requests
import re
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow CORS for all domains

# Function to validate user inputs like age, weight, height
def validate_input(input_value, input_type):
    if input_type == 'int':
        if re.match("^[0-9]+$", input_value):
            return int(input_value)
        else:
            return None
    return input_value

# Function to generate the diet and workout chart
def generate_diet_and_workout_chart(name, age, weight, height, gender, preferences, allergies, activity_level, goal):
    prompt = f"""
    You are a professional dietitian. Create a personalized diet plan for a person who is {age} years old, weighs {weight} kg, and is {height} cm tall.
They are aiming to achieve {goal}. They follow a {preferences} diet and have allergies to {allergies}. Their activity level is {activity_level}.

### **Macronutrient Breakdown Based on the Goal**:
- **Weight Loss/Fat Loss**:
  - Protein: 2g per kg of body weight.
  - Carbohydrates: 30-40% of total calories.
  - Fats: 25-30% of total calories.

- **Muscle Gain**:
  - Protein: 2-2.2g per kg of body weight.
  - Carbohydrates: 50-60% of total calories for glycogen replenishment.
  - Fats: 20-25% of total calories.

- **Maintenance**:
  - Protein: 1.5-2g per kg of body weight.
  - Carbohydrates: 45-55% of total calories.
  - Fats: 25-30% of total calories.

**Use the following structure for each meal:**
- **Breakfast** (25-30% of total daily calories): Provide 3 meal options. Each should include a protein source, complex carbohydrates, and healthy fats. Adjust protein, carbs, and fats based on the goal (e.g., higher protein for muscle gain, lower carbs for weight loss).

- **Lunch** (30-35% of total daily calories): Provide 3 meal options. Each should include lean proteins, whole grains, and vegetables. Adjust macronutrients according to their goal.

- **Dinner** (25-30% of total daily calories): Provide 3 meal options. Each should include lean proteins and vegetables, with fewer carbohydrates (especially for weight loss goals). Adjust macronutrients accordingly.

- **Snacks** (5-10% of total daily calories): Provide 3 healthy snack options that include protein and healthy fats. Keep snacks light, especially for weight loss.

### For each meal option, include:
- Total calories
- Macronutrient breakdown (protein, carbohydrates, fats).
- Specific ingredients and portion sizes (adjust based on age, weight, height, gender, and activity level to fit their calorie and macronutrient needs).


    2. For the workout plan:
       - Suggest **specific exercises** (e.g., squats, push-ups) that match their activity level ({activity_level}) and their goal ({goal}).
       - Indicate how many reps and sets they should do.
       - Give different exercises for different muscle groups, with a mix of cardio and strength training.
       - Include details for 4-5 days of exercises, with at least 5-6 distinct exercises per day.
       - If a person is less active ({activity_level}), then their workout plan should be very mild compared to someone who works out a lot.

    Do not provide code, just detailed text descriptions for the meals and exercises.
    """

    # Together AI API details
    api_url = "https://api.together.xyz/v1/completions"
    api_key = "9290412d4401cef7000c1a03aaf5a1f3438387474a803a84de49dfeae1e09db0"

    payload = {
        "prompt": prompt,
        "model": "meta-llama/llama-vision-free",  
        "max_tokens": 1500,
        "temperature": 0.6
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    response = requests.post(api_url, json=payload, headers=headers)

    if response.status_code == 200:
        return response.json()["choices"][0]["text"]
    else:
        return f"Error: {response.status_code} - {response.text}"

# Route to handle the POST request from frontend
@app.route('/generate', methods=['POST'])
def generate_plan():
    try:
        data = request.get_json()
        print(f"Received data: {data}")  # Logging incoming data

        name = data.get('name')
        age = validate_input(data.get('age'), 'int')
        weight = validate_input(data.get('weight'), 'int')
        height = validate_input(data.get('height'), 'int')
        gender = data.get('gender')
        preferences = data.get('preferences')
        allergies = data.get('allergies')
        activity_level = data.get('activity_level')
        goal = data.get('goal')

        # Generate the personalized plan
        plan = generate_diet_and_workout_chart(name, age, weight, height, gender, preferences, allergies, activity_level, goal)
        print(f"Generated plan: {plan}")  # Logging generated plan

        return jsonify({"plan": plan})
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({"error": "An error occurred"}), 500

if __name__ == '__main__':
    app.run(debug=True)
