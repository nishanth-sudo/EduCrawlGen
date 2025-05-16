from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from retrival.retriver import retrieve_passages
from generation.generator import generate_answer
import os
import firebase_admin
from firebase_admin import credentials, auth, exceptions
from firebase_db import init_db, save_history, get_user_history
import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='frontend/dist')
CORS(app)

# Init Firebase Admin with Realtime Database
if not firebase_admin._apps:
    cred = credentials.Certificate("qa-answer-generator-firebase-adminsdk-fbsvc-1f7dd11952.json")
    # Initialize with database URL
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://qa-answer-generator-default-rtdb.firebaseio.com/'
    })

# Initialize database
init_db()

# Serve frontend static files
@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

# Serve src directory files
@app.route('/src/<path:path>')
def serve_src(path):
    return send_from_directory(os.path.join('frontend', 'src'), path)

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

# API endpoints
@app.route('/answer', methods=['POST'])
def get_answer():
    data = request.json
    question = data.get('question', '').strip()
    user_id = data.get('user_id', '').strip()
    
    if not question:
        return jsonify({'error': 'Question cannot be empty'}), 400
    
    try:
        # Get relevant documents
        docs = retrieve_passages(question)
        
        # Generate response
        answer = generate_answer(question, docs)
        
        return jsonify({
            'answer': answer
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def verify_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split('Bearer ')[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token['uid']
    except exceptions.FirebaseError:
        return None

@app.route('/history', methods=['POST'])
def save_chat_history():
    user_id = verify_token()
    if not user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.json
    if not all(key in data for key in ['question', 'answer', 'user_id']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    history_data = {
        'question': data['question'],
        'answer': data['answer'],
        'user_id': data['user_id'],
        'timestamp': str(datetime.datetime.now())
    }
    
    try:
        result = save_history(history_data)
        return jsonify({'message': 'History saved', 'id': result.key})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/history/<user_id>', methods=['GET'])
def get_history_by_path(user_id):
    auth_user_id = verify_token()
    if not auth_user_id:
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        history_list = get_user_history(user_id)
        return jsonify(history_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    try:
        # Verify authentication token
        auth_user_id = verify_token()
        if not auth_user_id:
            return jsonify({'error': 'Unauthorized'}), 401
            
        # Extract user ID from the request
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400

        # Fetch user history from Firebase
        history = get_user_history(user_id)
        return jsonify(history), 200
    except Exception as e:
        print(f"Error fetching history: {e}")
        return jsonify({'error': 'Failed to fetch history'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)