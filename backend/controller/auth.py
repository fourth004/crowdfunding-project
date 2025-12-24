from flask import Blueprint, request, jsonify, current_app
from models import db, User
import bcrypt, jwt
from config import SECRET_KEY
bp = Blueprint('auth', __name__, url_prefix='/auth')
@bp.route('/signup', methods=['POST'])
def signup():
data = request.get_json()
username = data.get('username')
password = data.get('password')
if not username or not password:
return jsonify({'error': 'missing fields'}), 400
if User.query.filter_by(username=username).first():
return jsonify({'error': 'user exists'}), 400
pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
user = User(username=username, password_hash=pw_hash)
db.session.add(user); db.session.commit()
return jsonify({'message': 'created'}), 201
@bp.route('/login', methods=['POST'])
def login():
data = request.get_json()
username = data.get('username'); password = data.get('password')
user = User.query.filter_by(username=username).first()
if not user:
return jsonify({'error': 'invalid'}), 401
if not bcrypt.checkpw(password.encode(), user.password_hash.encode()):
return jsonify({'error': 'invalid'}), 401
token = jwt.encode({'user_id': user.id, 'role': user.role}, SECRET_KEY)
return jsonify({'token': token})