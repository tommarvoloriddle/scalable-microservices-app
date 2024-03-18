from flask import Flask, request, abort, jsonify
from master import Master
import time

app = Flask(__name__)

@app.route('/', methods=['GET'])
def welcome():
    return jsonify({'message': 'Welcome to the KeyValueDB service'})

@app.route('/getkey', methods=['GET'])
def get_key():
    key = request.args.get('key')
    if not key:
        abort(400, 'Key parameter is missing')

    value = master.get(key)
    if value is None:
        abort(404, 'Key not found')
    return jsonify({'key': key, 'value': value})

@app.route('/setkey', methods=['GET'])
def set_key():
    key = request.args.get('key')
    value = request.args.get('value')
    if not key or not value:
        abort(400, 'Key or value parameter is missing')

    master.set(key, value)
    return jsonify({'key': key, 'value': value})


if __name__ == '__main__':
    master = Master()
    time.sleep(5)
    app.run(host='localhost', port=5000)
