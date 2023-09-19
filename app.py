from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Resource, Api
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
CORS(app)
api = Api(app)

class UploadAudio(Resource):
    def post(self):
        audio_file = request.files['audio']
        filename = secure_filename(audio_file.filename)
        audio_file.save(os.path.join("uploads", filename))
        return jsonify({'message': 'audio uploaded successfully'})

api.add_resource(UploadAudio, '/upload')

if __name__ == '__main__':
    app.run(port=3000, host='0.0.0.0', debug=True)
