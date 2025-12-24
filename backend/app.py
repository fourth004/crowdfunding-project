from flask import Flask
from models import db
from controllers.auth import bp as auth_bp
from controllers.campaigns import bp as camp_bp
from controllers.contributions import bp as contrib_bp
from controllers.admin import bp as admin_bp
import config
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = config.DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = config.SECRET_KEY
db.init_app(app)
app.register_blueprint(auth_bp)
app.register_blueprint(camp_bp)
app.register_blueprint(contrib_bp)
app.register_blueprint(admin_bp)
@app.before_first_request
def create_tables():
db.create_all()
@app.route('/')
def index():
return {'status':'ok'}
if __name__ == '__main__':
app.run(host='0.0.0.0', port=5000, debug=True)