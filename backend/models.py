from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
db = SQLAlchemy()
class User(db.Model):
id = db.Column(db.Integer, primary_key=True)
username = db.Column(db.String(80), unique=True, nullable=False)
password_hash = db.Column(db.String(200), nullable=False)
role = db.Column(db.String(20), default='user')
class CampaignRecord(db.Model):
id = db.Column(db.Integer, primary_key=True)
contract_id = db.Column(db.Integer, nullable=False)
title = db.Column(db.String(200))
description = db.Column(db.Text)
creator = db.Column(db.String(100))
goal = db.Column(db.String(100))
deadline = db.Column(db.Integer)
approved = db.Column(db.Boolean, default=False)
created_at = db.Column(db.DateTime, default=datetime.utcnow)