require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/product-routes');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 3001;
const URL = process.env.API_URL;

const app = express();
app.use(express.json());

// Указываем путь к папке со статическими файлами (бандл Angular-приложения)
const publicPath = path.join(__dirname, 'public');

// Разрешаем Express раздавать файлы из папки public
app.use(express.static(publicPath));

app.use(cors({
  origin: 'http://localhost:4200'
}));

// Маршруты для вашей базы данных
app.use(productRoutes);

// Обрабатываем все запросы и отправляем файл index.html (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

mongoose.connect(URL)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, (err) => {
      err ? console.log(err) : console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`DB connection error: ${err}`);
  });


// mongoose
//   .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then((res) => console.log('Connected to MongoDB'))
//   .catch((err) => console.log(`DB connection error: ${err}`));

// app.listen(PORT, (err) => {
//   err ? console.log(err) : console.log(`Listening on port ${PORT}`);
// });
