import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

import 'bootstrap/dist/css/bootstrap.min.css';

const ImageRecognition = () => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [recognizedText, setRecognizedText] = useState('');

  const readText = async (file) => {
    const { createWorker } = Tesseract;
    const worker = createWorker();

    try {
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      const { data: { text } } = await worker.recognize(file);
      setRecognizedText(text);

      await worker.terminate();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      readText(file);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <img id="preview" src={previewUrl} className="img-thumbnail img-preview" alt="Preview" />
          <input type="file" id="imageInput" accept="image/*" className="form-control mt-3" onChange={handleFileChange} />
          <button className="btn btn-primary mt-3" onClick={() => readText()}>Read Text</button>
        </div>
      </div>

      <div className="card mt-4 text-white bg-dark">
        <div className="card-body">
          <h4 className="card-title">Recognized text</h4>
          <div id="result">{recognizedText}</div>
        </div>
      </div>
    </div>
  );
};

export default ImageRecognition;
