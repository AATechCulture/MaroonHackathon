from flask import Flask, request, jsonify, Response
import os
import json
import openai
import numpy as np
from collections import OrderedDict

# Load environment variables from a .env file (optional)
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

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

@app.route('/additional-resources', methods=['POST'])
def additional_resources():
    data = request.get_json()

    # Validate input
    if not data or 'major' not in data:
        return jsonify({'error': 'Invalid input. Please provide the major.'}), 400

    major_name = data['major']

    # Construct the prompt
    prompt = f"""
For the university major '{major_name}', please provide the following information in JSON format only, strictly
following the structre and order provided below. Do not include any extra text or explanations.

Here is the exaact JSON template you should follow:

{{
    "resources_intro": "You can look at some additional resources to learn more:",
    "resources": [
        // List of resources to learn more about the major (e.g., websites, online courses, YouTube channels)
        // Each resource should be formatted as "Resource Name: URL"
        "Resource Name: URL",
        "Resource Name: URL",
        "Resource Name: URL"
    ],
    "resume_tips_intro": "Here are some resume-building and interview preparation tips:",
    "resume_tips": [
        // List of resume-building and interview preparation tips specific to this major
        "Tip 1",
        "Tip 2",
        "Tip 3"
    ],
    "internships_intro": "Here are some types of internships available for this major and companies to apply to:",
    "internships": [
        // List of types of internships available for this major and companies to apply to
        "Internship Opportunity 1",
        "Internship Opportunity 2",
        "Internship Opportunity 3"

    ]
}}

Please ensure:

- The output is valid JSON.
- All fields are included and in the exact order as shown.
- Do not add or remove any fields.
- Do not include any text before or after the JSON output.
"""

    # Call OpenAI API
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that provides information about university majors."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            n=1,
            stop=None,
            temperature=0.7,
        )

        # Extract the assistant's reply
        assistant_reply = response['choices'][0]['message']['content'].strip()

        # Parse the assistant's reply as JSON
        major_info = json.loads(assistant_reply)
        print(f"Major info: {major_info}")

        # Ensure the fields are in the correct order using OrderedDict
        odered_major_info = OrderedDict()
        expected_fields = [
            "resources_intro",
            "resources",
            "resume_tips_intro",
            "resume_tips",
            "internships_intro",
            "internships"
        ]

        for field in expected_fields:
            if field in major_info:
                odered_major_info[field] = major_info[field]
            else:
                odered_major_info[field] = None # Handle missing fields as needed
        print(f"Ordered Major info: {odered_major_info}")

    except Exception as e:
        return jsonify({'error': f'Error generating information for major {major_name}: {str(e)}'}), 500

    json_response = json.dumps(odered_major_info, ensure_ascii=False)
    # Return the additional resources
    return Response(json_response, mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True)
