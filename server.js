const express = require('express');
const multer = require('multer');
const axios = require('axios');
const Tesseract = require('tesseract.js');

const app = express();
const port = 3000;

app.use(express.static('public'));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/recognize', upload.single('image'), async (req, res) => {
  try {
    const { buffer } = req.file;

    if (!buffer) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const { data: { text } } = await recognizeText(buffer);

    res.json({ text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function recognizeText(imageBuffer) {
  const worker = Tesseract.createWorker();

  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');

  const { data } = await worker.recognize(imageBuffer);
  await worker.terminate();

  return data;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
