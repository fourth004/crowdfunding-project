import os
from dotenv import load_dotenv
load_dotenv()
DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///crowdfunding.db')
INFURA_URL = os.getenv('INFURA_URL', 'http://127.0.0.1:8545')
6
CONTRACT_ADDRESS = os.getenv('CONTRACT_ADDRESS', '')
PRIVATE_KEY = os.getenv('PRIVATE_KEY', '')
ADMIN_ADDRESS = os.getenv('ADMIN_ADDRESS', '')
SECRET_KEY = os.getenv('SECRET_KEY', 'devsecret')