from flask import Flask, request, jsonify
from flask_cors import CORS 
import os
import json
import openai
import numpy as np
import requests

# Load environment variables from a .env file (optional)
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)
# Set your OpenAI API key
openai_api_key = os.getenv('OPENAI_API_KEY') or 'YOUR_OPENAI_API_KEY'
openai.api_key = openai_api_key

@app.route('/')
def home():
    return 'Hello, Flask!'

@app.route('/api/data', methods=['GET'])
def data():
    try:
        # Get the full path of the JSON file
        json_path = os.path.join(os.path.dirname(__file__), 'data.json')

        # Read the JSON file
        with open(json_path, 'r') as json_file:
            file_data = json.load(json_file)

        # Return the JSON data
        return jsonify(file_data)
    except Exception as e:
        # Handle errors (e.g., file not found)
        return jsonify({"error": str(e)}), 500

# Function to get embeddings
def get_embedding(text, model="text-embedding-ada-002"):
    response = openai.Embedding.create(
        input=[text],
        model=model
    )
    return response['data'][0]['embedding']

# Function to calculate cosine similarity
def cosine_similarity(a, b):
    a = np.array(a)
    b = np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

@app.route('/recommend-majors', methods=['POST'])
def recommend_majors():
    data = request.get_json()

    # Validate input
    if not data or 'interests' not in data or 'school_name' not in data:
        return jsonify({'error': 'Invalid input. Please provide interests and school_name.'}), 400

    user_interests = data['interests']
    school_name = data['school_name']

    # Combine user interests into a single string
    user_interests_text = ', '.join(user_interests)

    # Fetch data from api/data endpoint
    try:
        json_path = os.path.join(os.path.dirname(__file__), 'data.json')
        with open(json_path, 'r') as json_file:
            file_data = json.load(json_file)  # Load JSON data
        universities_data = file_data  # Use the parsed JSON data directly
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # Ensure universities_data is a dictionary or list as expected
    if isinstance(universities_data, dict):
        if universities_data.get("school_name", "").lower() != school_name.lower():
            return jsonify({'error': 'School not found.'}), 404
        majors = universities_data.get("majors", [])
    else:
        school = next((uni for uni in universities_data if uni["school_name"].lower() == school_name.lower()), None)
        if not school:
            return jsonify({'error': 'School not found.'}), 404
        majors = school.get("majors", [])

    if not majors:
        return jsonify({'error': 'No majors found for the specified school.'}), 404

    # Compute embedding for user's interests
    try:
        user_embedding = get_embedding(user_interests_text)
    except Exception as e:
        return jsonify({'error': f'OpenAI API error: {str(e)}'}), 500

    # Compute embeddings and similarities for each major
    similarities = []
    for major in majors:
        try:
            major_name = major['name']
            major_embedding = get_embedding(major_name)
            similarity = cosine_similarity(user_embedding, major_embedding)
            similarities.append({'major': major_name, 'similarity': similarity})
        except Exception as e:
            return jsonify({'error': f'OpenAI API error: {str(e)}'}), 500

    # Sort majors based on similarity
    similarities.sort(key=lambda x: x['similarity'], reverse=True)

    # Get top 3 majors
    top_majors = [item['major'] for item in similarities[:3]]

    # Return the recommendations
    return jsonify({
        'school_name': school_name,
        'recommended_majors': top_majors
    }), 200
@app.route('/about')
def about():
    return 'This is the About page!'

if __name__ == '__main__':
    app.run(debug=True)
