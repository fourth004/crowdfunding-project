from flask import Blueprint, request, jsonify
from models import db, CampaignRecord
from services.chain import get_campaign
bp = Blueprint('campaigns', __name__, url_prefix='/campaigns')
@bp.route('/', methods=['GET'])
def list_campaigns():
# return DB records + chain status if available
rows =
CampaignRecord.query.order_by(CampaignRecord.created_at.desc()).all()
out = []
for r in rows:
chain_data = None
try:
chain_data = get_campaign(r.contract_id)
except:
chain_data = None
out.append({
'id': r.id,
'contract_id': r.contract_id,
'title': r.title,
'description': r.description,
'creator': r.creator,
'goal': r.goal,
'deadline': r.deadline,
'approved': r.approved,
'chain': chain_data
})
return jsonify(out)
@bp.route('/create', methods=['POST'])
def create_campaign():
data = request.get_json()
# expect contract_id already created on chain; store metadata
rec = CampaignRecord(
contract_id=data['contract_id'],
title=data.get('title'),
description=data.get('description'),
creator=data.get('creator'),
goal=data.get('goal'),
deadline=data.get('deadline')
)

db.session.add(rec); db.session.commit()
return jsonify({'message':'ok','id': rec.id}), 201
