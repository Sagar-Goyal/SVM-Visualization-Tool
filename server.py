from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from svm import train_svm

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return render_template("index.html")

@app.route('/train-svm',methods=['POST'])
def handle_train_svm():
    dataset = request.get_json()
    result = train_svm(dataset)
    return jsonify(result)

if __name__ == '__main__':
    app.run()