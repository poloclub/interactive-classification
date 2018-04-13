from PIL import Image
import numpy as np
import io
import array
import subprocess
import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import json
app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

def inpaint(img_arr, mask_arr):

    # Write RGBA array to file for C program to read
    with open('.imgbytes', 'w') as f:
        for x in img_arr:
            f.write(str(x) + " ")

    # Write 1/0 array of mask to file
    with open('.maskbytes', 'w') as f:
        for x in mask_arr:
            f.write(str(x) + " ")

    # Call the C program and read back the modified RGB array
    subprocess.call(['./prog'])
    with open('.imgbytes', 'r') as f:
        nums = [int(x) for x in f.readline().split(' ')[:-1]]

    # Clean up
    os.remove('.maskbytes')
    os.remove('.imgbytes')
    return nums

@app.route('/')
def hello_world():
    return "Hello World!"

@app.route('/inpaint', methods=['POST'])
@cross_origin()
def inpaint_req():
    if request.method == 'POST':
        data = request.get_json(force=True)
        return jsonify(inpaint(data['image'], data['mask']))
    return jsonify({"error": "Must be post request"})