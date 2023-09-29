from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import os
from utils import *

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
db = SQLAlchemy(app)
CORS(app)
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('new_word')

class WordDict(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    string_value = db.Column(db.String(128), unique=True)

with app.app_context():
    db.create_all()

class UploadAudio(Resource):
    def post(self):
        audio_file = request.files['audio']
        filename = secure_filename(audio_file.filename)
        audio_file.save(os.path.join("../../uploads", filename))

        # Get the transcription
        closest_words = transcribe_audio()
        return jsonify({'matches': closest_words})
    
class GetTranscription(Resource):
    def get(self):
        word = request.args.get('word')
        # Get the transcription
        translation = chat_gpt_translation(word)
        return jsonify({'translation': translation})
    
class WriteTable(Resource):
    def post(self):
        args = parser.parse_args()
        incoming_word = args['new_word']

        existing_entry = WordDict.query.filter_by(string_value=incoming_word).first()
        if existing_entry:
            return {'message': f'{incoming_word} already present in database'}

        new_entry = WordDict(string_value=incoming_word)
        db.session.add(new_entry)
        db.session.commit()

        return {'message': f'{incoming_word} saved corretly'}

api.add_resource(UploadAudio, '/upload')
api.add_resource(GetTranscription, '/translate')
api.add_resource(WriteTable, '/write')

if __name__ == '__main__':
    app.run(port=3000, host='0.0.0.0', debug=True)
