from flask import Flask, jsonify, request, send_from_directory, Response
from flask_cors import CORS
from datetime import datetime
import os
import csv
from io import StringIO

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# In-memory storage
users = []
skills = []
swap_requests = []
platform_messages = []

# Demo skills data
demo_skills = [
    {
        'id': 1,
        'user_id': 1,
        'title': 'Python Programming',
        'description': 'Expert in Python development, web frameworks, and data analysis',
        'category': 'Programming',
        'proficiency_level': 'Expert',
        'hourly_rate': 25,
        'location': 'Demo City',
        'availability': 'Weekends',
        'tags': ['Python', 'Django', 'Flask', 'Data Analysis'],
        'created_at': datetime.utcnow().isoformat()
    },
    {
        'id': 2,
        'user_id': 1,
        'title': 'Web Design',
        'description': 'Creative web design with modern UI/UX principles',
        'category': 'Design',
        'proficiency_level': 'Intermediate',
        'hourly_rate': 20,
        'location': 'Demo City',
        'availability': 'Evenings',
        'tags': ['HTML', 'CSS', 'JavaScript', 'UI/UX'],
        'created_at': datetime.utcnow().isoformat()
    },
    {
        'id': 3,
        'user_id': 2,
        'title': 'Graphic Design',
        'description': 'Professional graphic design for logos, branding, and marketing materials',
        'category': 'Design',
        'proficiency_level': 'Expert',
        'hourly_rate': 30,
        'location': 'Design City',
        'availability': 'Weekdays',
        'tags': ['Photoshop', 'Illustrator', 'Branding', 'Logo Design'],
        'created_at': datetime.utcnow().isoformat()
    },
    {
        'id': 4,
        'user_id': 3,
        'title': 'Excel & Data Analysis',
        'description': 'Advanced Excel skills, data modeling, and business intelligence',
        'category': 'Business',
        'proficiency_level': 'Expert',
        'hourly_rate': 35,
        'location': 'Business City',
        'availability': 'Flexible',
        'tags': ['Excel', 'VBA', 'Data Analysis', 'Business Intelligence'],
        'created_at': datetime.utcnow().isoformat()
    },
    {
        'id': 5,
        'user_id': 4,
        'title': 'Spanish Language Tutoring',
        'description': 'Native Spanish speaker offering conversational and academic tutoring',
        'category': 'Language',
        'proficiency_level': 'Native',
        'hourly_rate': 15,
        'location': 'Language City',
        'availability': 'Weekends',
        'tags': ['Spanish', 'Tutoring', 'Conversation', 'Grammar'],
        'created_at': datetime.utcnow().isoformat()
    }
]

# Add demo users with skills
demo_users = [
    {
        'id': 1,
        'username': 'admin',
        'email': 'admin@example.com',
        'first_name': 'Admin',
        'last_name': 'User',
        'bio': 'Platform administrator',
        'location': 'HQ',
        'profile_photo': '',
        'availability': 'always',
        'is_public': True,
        'skills_offered': ['Python', 'Management'],
        'skills_wanted': ['Design'],
        'created_at': datetime.utcnow().isoformat(),
        'is_admin': True,
        'banned': False
    },
    {
        'id': 2,
        'username': 'designer',
        'email': 'designer@example.com',
        'first_name': 'Sarah',
        'last_name': 'Designer',
        'bio': 'Professional graphic designer with 5+ years experience',
        'location': 'Design City',
        'profile_photo': '',
        'availability': 'weekdays',
        'is_public': True,
        'skills_offered': ['Graphic Design', 'Photoshop'],
        'skills_wanted': ['Web Development', 'Python'],
        'created_at': datetime.utcnow().isoformat()
    },
    {
        'id': 3,
        'username': 'analyst',
        'email': 'analyst@example.com',
        'first_name': 'Mike',
        'last_name': 'Analyst',
        'bio': 'Data analyst specializing in business intelligence',
        'location': 'Business City',
        'profile_photo': '',
        'availability': 'flexible',
        'is_public': True,
        'skills_offered': ['Excel', 'Data Analysis'],
        'skills_wanted': ['Graphic Design', 'Spanish'],
        'created_at': datetime.utcnow().isoformat()
    },
    {
        'id': 4,
        'username': 'tutor',
        'email': 'tutor@example.com',
        'first_name': 'Maria',
        'last_name': 'Garcia',
        'bio': 'Native Spanish speaker and experienced language tutor',
        'location': 'Language City',
        'profile_photo': '',
        'availability': 'weekends',
        'is_public': True,
        'skills_offered': ['Spanish', 'Language Tutoring'],
        'skills_wanted': ['Web Design', 'Data Analysis'],
        'created_at': datetime.utcnow().isoformat()
    }
]

@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'Skill Swap Platform API is running',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not all(key in data for key in ['username', 'email', 'password', 'first_name', 'last_name']):
        return jsonify({'error': 'Missing required fields'}), 400
    if any(user['username'] == data['username'] for user in users):
        return jsonify({'error': 'Username already exists'}), 400
    user = {
        'id': len(users) + 1,
        'username': data['username'],
        'email': data['email'],
        'first_name': data['first_name'],
        'last_name': data['last_name'],
        'bio': data.get('bio', ''),
        'location': data.get('location', ''),
        'profile_photo': data.get('profile_photo', ''),
        'availability': data.get('availability', ''),
        'is_public': data.get('is_public', True),
        'skills_offered': data.get('skills_offered', []),
        'skills_wanted': data.get('skills_wanted', []),
        'created_at': datetime.utcnow().isoformat(),
        'is_admin': data.get('is_admin', False),
        'banned': data.get('banned', False)
    }
    users.append(user)
    return jsonify({
        'message': 'User registered successfully',
        'user': user,
        'access_token': 'demo-token-' + str(user['id'])
    }), 201

@app.route('/api/auth/profile', methods=['GET', 'PUT'])
def profile():
    # For demo, use the first user as the logged-in user
    if not users:
        return jsonify({'error': 'No user found'}), 404
    user = users[0]
    if request.method == 'GET':
        return jsonify(user)
    data = request.get_json()
    for field in ['first_name', 'last_name', 'bio', 'location', 'profile_photo', 'availability', 'is_public', 'skills_offered', 'skills_wanted']:
        if field in data:
            user[field] = data[field]
    return jsonify({'message': 'Profile updated successfully', 'user': user})

@app.route('/api/auth/profile/photo', methods=['POST'])
def upload_profile_photo():
    if not users:
        return jsonify({'error': 'No user found'}), 404
    user = users[0]
    if 'photo' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['photo']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    filename = f"user_{user['id']}_profile_{datetime.utcnow().timestamp()}_{file.filename}"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    user['profile_photo'] = f'/api/uploads/{filename}'
    return jsonify({'message': 'Profile photo uploaded', 'profile_photo': user['profile_photo']})

@app.route('/api/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Username and password required'}), 400
    # For demo, just check username exists (no real password check)
    user = next((u for u in users if u['username'] == data['username']), None)
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    return jsonify({
        'message': 'Login successful',
        'user': user,
        'access_token': 'demo-token-' + str(user['id'])
    })

@app.route('/api/skills', methods=['GET'])
def get_skills():
    """Get all available skills with optional filtering"""
    category = request.args.get('category')
    level = request.args.get('level')
    location = request.args.get('location')
    search = request.args.get('search')
    
    filtered_skills = skills.copy()
    
    if category:
        filtered_skills = [s for s in filtered_skills if s['category'].lower() == category.lower()]
    if level:
        filtered_skills = [s for s in filtered_skills if s['proficiency_level'].lower() == level.lower()]
    if location:
        filtered_skills = [s for s in filtered_skills if location.lower() in s['location'].lower()]
    if search:
        search_lower = search.lower()
        filtered_skills = [s for s in filtered_skills if 
                          search_lower in s['title'].lower() or 
                          search_lower in s['description'].lower() or
                          any(search_lower in tag.lower() for tag in s['tags'])]
    
    # Add user information to each skill
    for skill in filtered_skills:
        user = next((u for u in users if u['id'] == skill['user_id']), None)
        if user:
            skill['user'] = {
                'id': user['id'],
                'first_name': user['first_name'],
                'last_name': user['last_name'],
                'location': user['location'],
                'profile_photo': user['profile_photo']
            }
    
    return jsonify(filtered_skills)

@app.route('/api/skills/categories', methods=['GET'])
def get_categories():
    """Get all available skill categories"""
    categories = list(set(skill['category'] for skill in skills))
    return jsonify(categories)

@app.route('/api/skills/levels', methods=['GET'])
def get_levels():
    """Get all available proficiency levels"""
    levels = list(set(skill['proficiency_level'] for skill in skills))
    return jsonify(levels)

@app.route('/api/skills/<int:skill_id>', methods=['GET'])
def get_skill(skill_id):
    """Get a specific skill by ID"""
    skill = next((s for s in skills if s['id'] == skill_id), None)
    if not skill:
        return jsonify({'error': 'Skill not found'}), 404
    
    # Add user information
    user = next((u for u in users if u['id'] == skill['user_id']), None)
    if user:
        skill['user'] = {
            'id': user['id'],
            'first_name': user['first_name'],
            'last_name': user['last_name'],
            'location': user['location'],
            'profile_photo': user['profile_photo'],
            'bio': user['bio'],
            'availability': user['availability']
        }
    
    return jsonify(skill)

@app.route('/api/skills', methods=['POST'])
def create_skill():
    """Create a new skill offering"""
    if not users:
        return jsonify({'error': 'No user found'}), 404
    
    data = request.get_json()
    user = users[0]  # Current user
    
    skill = {
        'id': len(skills) + 1,
        'user_id': user['id'],
        'title': data['title'],
        'description': data['description'],
        'category': data['category'],
        'proficiency_level': data['proficiency_level'],
        'hourly_rate': data.get('hourly_rate', 0),
        'location': data.get('location', user['location']),
        'availability': data.get('availability', user['availability']),
        'tags': data.get('tags', []),
        'created_at': datetime.utcnow().isoformat()
    }
    
    skills.append(skill)
    return jsonify({'message': 'Skill created successfully', 'skill': skill}), 201

@app.route('/api/swap-requests', methods=['POST'])
def create_swap_request():
    """Create a new swap request"""
    if not users:
        return jsonify({'error': 'No user found'}), 404
    
    data = request.get_json()
    user = users[0]  # Current user
    
    request_data = {
        'id': len(swap_requests) + 1,
        'from_user_id': user['id'],
        'to_user_id': data['to_user_id'],
        'skill_id': data['skill_id'],
        'message': data.get('message', ''),
        'status': 'pending',  # pending, accepted, rejected, completed
        'created_at': datetime.utcnow().isoformat()
    }
    
    swap_requests.append(request_data)
    return jsonify({'message': 'Swap request sent successfully', 'request': request_data}), 201

@app.route('/api/swap-requests', methods=['GET'])
def get_swap_requests():
    """Get swap requests for current user"""
    if not users:
        return jsonify({'error': 'No user found'}), 404
    
    user = users[0]
    user_requests = [r for r in swap_requests if r['to_user_id'] == user['id'] or r['from_user_id'] == user['id']]
    
    # Add user and skill information
    for req in user_requests:
        from_user = next((u for u in users if u['id'] == req['from_user_id']), None)
        to_user = next((u for u in users if u['id'] == req['to_user_id']), None)
        skill = next((s for s in skills if s['id'] == req['skill_id']), None)
        
        if from_user:
            req['from_user'] = {'first_name': from_user['first_name'], 'last_name': from_user['last_name']}
        if to_user:
            req['to_user'] = {'first_name': to_user['first_name'], 'last_name': to_user['last_name']}
        if skill:
            req['skill'] = {'title': skill['title'], 'category': skill['category']}
    
    return jsonify(user_requests)

@app.route('/api/swap-requests/<int:request_id>/accept', methods=['POST'])
def accept_swap_request(request_id):
    req = next((r for r in swap_requests if r['id'] == request_id), None)
    if not req:
        return jsonify({'error': 'Request not found'}), 404
    req['status'] = 'accepted'
    return jsonify({'message': 'Swap request accepted', 'request': req})

@app.route('/api/swap-requests/<int:request_id>/reject', methods=['POST'])
def reject_swap_request(request_id):
    req = next((r for r in swap_requests if r['id'] == request_id), None)
    if not req:
        return jsonify({'error': 'Request not found'}), 404
    req['status'] = 'rejected'
    return jsonify({'message': 'Swap request rejected', 'request': req})

@app.route('/api/swap-requests/<int:request_id>', methods=['DELETE'])
def delete_swap_request(request_id):
    global swap_requests
    before = len(swap_requests)
    swap_requests = [r for r in swap_requests if r['id'] != request_id]
    after = len(swap_requests)
    if before == after:
        return jsonify({'error': 'Request not found'}), 404
    return jsonify({'message': 'Swap request deleted'})

@app.route('/api/swap-requests/<int:request_id>/feedback', methods=['POST'])
def leave_feedback(request_id):
    req = next((r for r in swap_requests if r['id'] == request_id), None)
    if not req:
        return jsonify({'error': 'Request not found'}), 404
    data = request.get_json()
    req['feedback'] = data.get('feedback', '')
    req['rating'] = data.get('rating', None)
    req['status'] = 'completed'
    return jsonify({'message': 'Feedback submitted', 'request': req})

@app.route('/api/users/search', methods=['GET'])
def search_users():
    """Search public users by skills offered/wanted, availability, and location"""
    skill = request.args.get('skill', '').lower()
    wanted = request.args.get('wanted', '').lower()
    offered = request.args.get('offered', '').lower()
    availability = request.args.get('availability', '').lower()
    location = request.args.get('location', '').lower()

    results = []
    for user in users:
        if not user.get('is_public', True):
            continue
        # Filter by skill (offered or wanted)
        if skill:
            if not (any(skill in s.lower() for s in user.get('skills_offered', [])) or any(skill in s.lower() for s in user.get('skills_wanted', []))):
                continue
        if offered:
            if not any(offered in s.lower() for s in user.get('skills_offered', [])):
                continue
        if wanted:
            if not any(wanted in s.lower() for s in user.get('skills_wanted', [])):
                continue
        if availability:
            if availability not in user.get('availability', '').lower():
                continue
        if location:
            if location not in user.get('location', '').lower():
                continue
        # Only return public info
        results.append({
            'id': user['id'],
            'first_name': user['first_name'],
            'last_name': user['last_name'],
            'location': user['location'],
            'profile_photo': user['profile_photo'],
            'availability': user['availability'],
            'skills_offered': user['skills_offered'],
            'skills_wanted': user['skills_wanted'],
            'bio': user['bio'],
            'is_public': user['is_public']
        })
    return jsonify(results)

@app.route('/api/admin/skills', methods=['GET'])
def admin_list_skills():
    # Only allow admin (for demo, user 1 is admin)
    if not users or not users[0].get('is_admin'):
        return jsonify({'error': 'Admin only'}), 403
    return jsonify(skills)

@app.route('/api/admin/skills/<int:skill_id>/reject', methods=['POST'])
def admin_reject_skill(skill_id):
    if not users or not users[0].get('is_admin'):
        return jsonify({'error': 'Admin only'}), 403
    global skills
    before = len(skills)
    skills = [s for s in skills if s['id'] != skill_id]
    after = len(skills)
    if before == after:
        return jsonify({'error': 'Skill not found'}), 404
    return jsonify({'message': 'Skill rejected/deleted'})

@app.route('/api/admin/users', methods=['GET'])
def admin_list_users():
    if not users or not users[0].get('is_admin'):
        return jsonify({'error': 'Admin only'}), 403
    return jsonify(users)

@app.route('/api/admin/users/<int:user_id>/ban', methods=['POST'])
def admin_ban_user(user_id):
    if not users or not users[0].get('is_admin'):
        return jsonify({'error': 'Admin only'}), 403
    user = next((u for u in users if u['id'] == user_id), None)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    user['banned'] = True
    return jsonify({'message': 'User banned'})

@app.route('/api/admin/users/<int:user_id>/unban', methods=['POST'])
def admin_unban_user(user_id):
    if not users or not users[0].get('is_admin'):
        return jsonify({'error': 'Admin only'}), 403
    user = next((u for u in users if u['id'] == user_id), None)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    user['banned'] = False
    return jsonify({'message': 'User unbanned'})

@app.route('/api/admin/swaps', methods=['GET'])
def admin_list_swaps():
    if not users or not users[0].get('is_admin'):
        return jsonify({'error': 'Admin only'}), 403
    return jsonify(swap_requests)

@app.route('/api/admin/messages', methods=['POST'])
def admin_send_message():
    if not users or not users[0].get('is_admin'):
        return jsonify({'error': 'Admin only'}), 403
    data = request.get_json()
    msg = {
        'id': len(platform_messages) + 1,
        'message': data.get('message', ''),
        'created_at': datetime.utcnow().isoformat()
    }
    platform_messages.append(msg)
    return jsonify({'message': 'Platform message sent', 'msg': msg})

@app.route('/api/admin/messages', methods=['GET'])
def admin_get_messages():
    if not users or not users[0].get('is_admin'):
        return jsonify({'error': 'Admin only'}), 403
    return jsonify(platform_messages)

@app.route('/api/admin/report/users', methods=['GET'])
def admin_report_users():
    if not users or not users[0].get('is_admin'):
        return jsonify({'error': 'Admin only'}), 403
    si = StringIO()
    writer = csv.DictWriter(si, fieldnames=list(users[0].keys()))
    writer.writeheader()
    for u in users:
        writer.writerow(u)
    output = si.getvalue()
    return Response(output, mimetype='text/csv', headers={'Content-Disposition': 'attachment;filename=users_report.csv'})

@app.route('/api/admin/report/feedback', methods=['GET'])
def admin_report_feedback():
    if not users or not users[0].get('is_admin'):
        return jsonify({'error': 'Admin only'}), 403
    si = StringIO()
    writer = csv.DictWriter(si, fieldnames=['id','from_user_id','to_user_id','skill_id','feedback','rating','created_at'])
    writer.writeheader()
    for r in swap_requests:
        if r.get('feedback'):
            writer.writerow({
                'id': r['id'],
                'from_user_id': r['from_user_id'],
                'to_user_id': r['to_user_id'],
                'skill_id': r['skill_id'],
                'feedback': r.get('feedback',''),
                'rating': r.get('rating',''),
                'created_at': r['created_at']
            })
    output = si.getvalue()
    return Response(output, mimetype='text/csv', headers={'Content-Disposition': 'attachment;filename=feedback_report.csv'})

@app.route('/api/admin/report/swaps', methods=['GET'])
def admin_report_swaps():
    if not users or not users[0].get('is_admin'):
        return jsonify({'error': 'Admin only'}), 403
    si = StringIO()
    writer = csv.DictWriter(si, fieldnames=list(swap_requests[0].keys()) if swap_requests else ['id','from_user_id','to_user_id','skill_id','status','created_at'])
    writer.writeheader()
    for r in swap_requests:
        writer.writerow(r)
    output = si.getvalue()
    return Response(output, mimetype='text/csv', headers={'Content-Disposition': 'attachment;filename=swaps_report.csv'})

if __name__ == '__main__':
    # Add demo users and skills for testing
    users.extend(demo_users)
    skills.extend(demo_skills)
    # Add demo swap requests for testing
    swap_requests.append({
        'id': 1,
        'from_user_id': 2,  # Sarah Designer
        'to_user_id': 1,    # Demo User
        'skill_id': 1,      # Python Programming
        'message': 'Can we swap Python for Photoshop?',
        'status': 'pending',
        'created_at': datetime.utcnow().isoformat()
    })
    swap_requests.append({
        'id': 2,
        'from_user_id': 3,  # Mike Analyst
        'to_user_id': 1,    # Demo User
        'skill_id': 2,      # Web Design
        'message': 'Interested in a web design/data analysis swap?',
        'status': 'accepted',
        'created_at': datetime.utcnow().isoformat()
    })
    print("🚀 Backend running at http://localhost:5000")
    print(f"📊 Loaded {len(users)} users and {len(skills)} skills")
    app.run(debug=True, host='0.0.0.0', port=5000) 