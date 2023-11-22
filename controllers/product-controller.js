const Product = require('../models/product');

const handleError = (res, error) => {
  res.status(500).json({ error });
}

const getProducts = (req, res) => {
  Product
  .find()
  .sort({ name: 1 })
  .then((products) => {
    res
      .status(200)
      .json(products);
  })
  .catch((err) => handleError(res, err));
};

const getProduct = (req, res) => {
  Product
  .findById(req.params.id)
  .then((product) => {
    res
      .status(200)
      .json(product);
  })
  .catch((err) => handleError(res, err));
};


const deleteProduct = (req, res) => {
  Product
  .findByIdAndDelete(req.params.id)
  .then((result) => {
    res
      .status(200)
      .json(result);
  })
  .catch((err) => handleError(res, err));
};

const addProduct = (req, res) => {
  const product = new Product(req.body);
  product
  .save()
  .then((result) => {
    res
      .status(201)
      .json(result);
  })
  .catch((err) => handleError(res, err));
};

const updateProduct = (req, res) => {
  Product
  .findByIdAndUpdate(req.params.id, req.body)
  .then((result) => {
    res
      .status(200)
      .json(result);
  })
  .catch((err) => handleError(res, err));
};


const getComments = (req, res) => {
  const productId = req.params.id;
  Product.findById(productId, (err, product) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Не удалось получить комментарии к продукту.' });
    }
    res.json(product.comments);
  });
};




module.exports = {
  getProducts,
  getProduct,
  deleteProduct,
  addProduct,
  updateProduct,
	getComments,
};
