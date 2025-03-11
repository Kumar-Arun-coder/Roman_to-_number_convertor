from flask import Flask, render_template, jsonify, request
import os
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

# Conversion functions
def roman_to_int(roman):
    values = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}
    prev_value, total = 0, 0
    for char in reversed(roman):
        curr_value = values[char]
        total += curr_value if curr_value >= prev_value else -curr_value
        prev_value = curr_value
    return total

def int_to_roman(num):
    Val = [(1000, 'M'), (900, 'CM'), (500, 'D'), (400, 'CD'),
           (100, 'C'), (90, 'XC'), (50, 'L'), (40, 'XL'),
           (10, 'X'), (9, 'IX'), (5, 'V'), (4, 'IV'), (1, 'I')]
    result = ''
    for val, symbol in Val:
        while num >= val:
            result += symbol
            num -= val
    return result

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/convert', methods=['POST'])
def convert():
    try:
        data = request.get_json()
        num = int(data.get('number', 0))
        if num < 1 or num > 3999:
            return jsonify({'error': 'Please enter a number between 1 and 3999'}), 400
        return jsonify({'result': int_to_roman(num)})
    except ValueError:
        return jsonify({'error': 'Invalid number format'}), 400

@app.route('/convert_roman', methods=['POST'])
def convert_roman():
    try:
        data = request.get_json()
        roman = data.get('roman', '').upper()
        valid_chars = {'I', 'V', 'X', 'L', 'C', 'D', 'M'}
        if not all(c in valid_chars for c in roman):
            return jsonify({'error': 'Invalid Roman numeral format'}), 400
        return jsonify({'result': roman_to_int(roman)})
    except Exception:
        return jsonify({'error': 'An unexpected error occurred'}), 500

if __name__ == '__main__':
    app.run(debug=True)
