const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3005;

// CORSを有効化
app.use(cors());

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, 'build')));
app.use('/src/data', express.static(path.join(__dirname, 'src/data')));

// リファレンスファイルのAPIエンドポイント
app.get('/api/bot-references/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, 'src/data/bot_references', fileName);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    res.send(content);
  } else {
    res.status(404).send('File not found');
  }
});

// すべてのリファレンスファイルを取得するエンドポイント
app.get('/api/bot-references', (req, res) => {
  const dirPath = path.join(__dirname, 'src/data/bot_references');
  
  try {
    const files = fs.readdirSync(dirPath);
    const references = {};
    
    files.forEach(file => {
      if (file.endsWith('.txt')) {
        const content = fs.readFileSync(path.join(dirPath, file), 'utf8');
        references[file] = content;
      }
    });
    
    res.json(references);
  } catch (error) {
    console.error('Error reading reference files:', error);
    res.status(500).send('Error reading reference files');
  }
});

// SPAのルーティング
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Bot reference server running on port ${PORT}`);
});
