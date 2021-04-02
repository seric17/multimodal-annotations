import os
import wave
from flask import Flask, render_template, send_file, request, abort, request, redirect, url_for
from werkzeug.utils import secure_filename
app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 10240 * 10240
app.config['UPLOAD_EXTENSIONS'] = ['.webm', '.json', '.txt']
app.config['UPLOAD_PATH'] = 'uploads'

@app.route("/")
def home():
    return render_template("index.html", fileName = "images/bus.jpg")

@app.route("/images/<imageId>")
def sendImage(imageId):
    return render_template("index.html", fileName = "images/" + imageId)

# @app.route("/", methods=["POST"])
# def uploadFiles():
#     # uploadedFile = request.files['audio_data']
#     uploadedFile = request.files["audio_data"]
#     print(list(request.files.keys()))
#     filename = secure_filename(uploadedFile.filename)
#     print("filename", filename, "uploadedFile.filename", uploadedFile.filename)
#     print("in uploadFiles")
#     if filename != '':
#         fileExt = os.path.splitext(filename)[1]
#         print("fileExt", fileExt)
#         # if fileExt not in app.config['UPLOAD_EXTENSIONS']:
#         #     print(fileExt)
#         #     print("in abort")
#         #     abort(400)
#         uploadedFile.save(os.path.join(app.config['UPLOAD_PATH'], filename))
#     # f = open('./file.wav', 'wb')
#     # f.write(request.data)
#     # f.close()
#     return redirect(url_for("home"))

@app.route("/", methods=["POST"])
def uploadFiles():
    uniqueName = ""
    names = ["audioData", "imageSrc", "coordJSON"]
    for name in names:
        uploadedFile = request.files[name]
        filename = secure_filename(uploadedFile.filename)
        if uniqueName == "":
            uniqueName = filename
        # print("filename", filename, "uploadedFile.filename", uploadedFile.filename)
        if filename != '':
            fileExt = os.path.splitext(filename)[1]
            if fileExt not in app.config['UPLOAD_EXTENSIONS']:
                abort(400)
            if name != "audioData":
                filename = uniqueName + filename
            uploadedFile.save(os.path.join(app.config['UPLOAD_PATH'], filename))
        # f = open('./file.wav', 'wb')
        # f.write(request.data)
        # f.close()
    return redirect(url_for("home"))


