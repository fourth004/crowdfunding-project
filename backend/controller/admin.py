from flask import Blueprint, request, jsonify
from models import db, CampaignRecord
bp = Blueprint('admin', __name__, url_prefix='/admin')
@bp.route('/approve', methods=['POST'])
def approve():
data = request.get_json()
rec =
CampaignRecord.query.filter_by(contract_id=data['contract_id']).first()
if not rec:
return jsonify({'error':'not found'}), 404
rec.approved = True
db.session.commit()
return jsonify({'message':'approved'})