from flask import Flask, request, jsonify,send_file
from flask_cors import CORS
import json

from pypdf_strreplace import process
import os

app = Flask(__name__)
CORS(app)

@app.route('/upload-pdf', methods=['POST'])
def upload_pdf():
    # Check if the POST request has a file part
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    replacements= request.form["replacements"]
    output_filename = request.form["output_filename"] 
    if not output_filename:
        output_filename="output.pdf"
    # replacements = dict(replacements)
    replacements=json.loads(replacements)
    replacementsObj={}
    for item in replacements:
        replacementsObj[item["search"]]=item["replace"]

    print(replacementsObj)



    # If the user does not select a file, the browser submits an empty file without a filename
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Check if the file is a PDF
    if file and file.filename.endswith('.pdf'):
        # Save the uploaded PDF file
        file.save(file.filename)
        process(file.filename, replacementsObj,output_filename)
        file.close()
        # delete the file
        os.remove(file.filename)
        try:
            return send_file(output_filename, as_attachment=True)
        finally:
            # Delete the processed PDF file
            os.remove(output_filename)

    else:
        return jsonify({'error': 'Uploaded file is not a PDF'})

if __name__ == '__main__':
    app.run(debug=True,port=80,host="0.0.0.0")
