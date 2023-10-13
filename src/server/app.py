from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import os
from utils import *
from practice_utils import * 

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase.db'
db = SQLAlchemy(app)
CORS(app)
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('text_string')

# Load the database
sentence_word_practice = SentenceWordPractice()
sentence_word_practice.load_db()

class WordDict(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    word_type = db.Column(db.String(128))
    article = db.Column(db.String(128), nullable=True)
    string_value = db.Column(db.String(128), unique=True)
    translation = db.Column(db.String(128))

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
    
class GetClosestMatches(Resource):
    def get(self):
        word = request.args.get('word')
        closest_words = get_closest_matches(re.sub(r'[.?!]', '', str.lower(word)))
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
        incoming_string = args['text_string']

        word_type, article, word, translation = process_reply(incoming_string)

        existing_entry = WordDict.query.filter_by(string_value=word).first()
        
        if existing_entry:
            return {'message': f'{word} already present in database'}

        new_entry = WordDict(
            word_type=word_type,
            article=article,
            string_value=word,
            translation=translation)
        db.session.add(new_entry)
        db.session.commit()

        return {'message': f'{word} saved correctly'}

'''
I want to pick three words from the database
Then I want to generate a sentence along with buttons for three words that could go in that space
I want an iPhone like "on" button to show the translations 
When a button is pressed, I want feedback to show if it was correct or not
'''

class SentencePractice(Resource):
    def get(self):
        practice_example = sentence_word_practice.generate_practice_example(n=3)
        return practice_example


api.add_resource(UploadAudio, '/upload')
api.add_resource(GetTranscription, '/translate')
api.add_resource(WriteTable, '/write')
api.add_resource(GetClosestMatches, '/matches')
api.add_resource(SentencePractice, '/sentence_practice')

if __name__ == '__main__':
    app.run(port=3000, host='0.0.0.0', debug=True)
