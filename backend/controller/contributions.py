from flask import Blueprint, request, jsonify
from services.chain import build_contribute_tx
bp = Blueprint('contributions', __name__, url_prefix='/contributions')
@bp.route('/prepare', methods=['POST'])
def prepare_contribution():
data = request.get_json()
from_address = data['from_address']
campaign_id = data['campaign_id']
amount_wei = data['amount_wei']
tx = build_contribute_tx(from_address, campaign_id, amount_wei)
return jsonify({'tx': tx})
