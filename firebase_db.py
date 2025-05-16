from firebase_admin import db
import datetime

def init_db():
    # Initialize the Firebase Realtime Database reference
    # Make sure the database URL is set in the Firebase Admin initialization
    try:
        # Test the connection
        ref = db.reference('/')
        return ref
    except Exception as e:
        print(f"Error initializing Firebase database: {e}")
        raise

def get_db():
    # Get the database reference
    return db.reference('/')

def save_history(history_data):
    # Save history to Firebase Realtime Database
    try:
        # Format timestamp if it's a string
        if 'timestamp' in history_data and isinstance(history_data['timestamp'], str):
            # Keep the timestamp as is, Firebase handles the storage
            pass
            
        # Create a reference to the history collection
        history_ref = db.reference('/history')
        
        # Push the new history entry (automatically generates a unique key)
        new_entry = history_ref.push(history_data)
        
        # Return the reference with the generated ID
        return new_entry
    except Exception as e:
        print(f"Error saving history to Firebase: {e}")
        raise

def get_user_history(user_id):
    # Get user's history from Firebase Realtime Database
    try:
        # Create a reference to the history collection
        history_ref = db.reference('/history')
        
        # Query history for specific user
        # Firebase Realtime Database allows querying by child value
        user_history = history_ref.order_by_child('user_id').equal_to(user_id).get()
        
        # Convert the result to a list of dictionaries with ID included
        history_list = []
        if user_history:
            for key, item in user_history.items():
                # Add the Firebase-generated key as 'id' field
                entry = dict(item)
                entry['id'] = key
                history_list.append(entry)
                
        # Sort by timestamp (newest first)
        history_list.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
        
        return history_list
    except Exception as e:
        print(f"Error retrieving user history from Firebase: {e}")
        raise