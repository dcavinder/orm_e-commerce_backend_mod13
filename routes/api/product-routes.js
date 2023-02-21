const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// gets all products
router.get('/', async (req, res) => {
  // Product.findAll({ includes: [Tag, Category] })
  //   .then(product => { res.json(product) })
  //   .catch(error => { console.log(error) })
  try {
    const productData = await Product.findAll({
      include: [
        { model: Category },
        {
          model: Tag,
          through: ProductTag,
          as: "tags"
        }
      ]
    })
    res.status(200).json(productData)
  } catch (err) {
    res.status(500).json(err)
  }
});

// gets one product by id
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        {
          model: Tag,
          through: ProductTag,
          as: "tags"
        }
      ]
    })
    res.status(200).json(productData)
  } catch (err) {
    res.status(500).json(err)
  }
});

// creates a new product
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {
      if (req.body.tagIds.length) {
        const productTagIdArray = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArray);
      }
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// updates a product by id
router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id
    }
  })
    .then(product => {
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTags = ProductTag.findAll({
          where: { product_id: req.params.id }
        });
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        const newProductTags = req.body.tagIds
          .filter(tag_id => !productTagIds.includes(tag_id))
          .map(tag_id => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
        const deletedProductTags = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id)
        return Promise.all([
          ProductTag.destroy({ where: { id: deletedProductTags } }),
          ProductTag.bulkCreate(newProductTags)
        ]);
      }
      return res.json(product);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

//Deletes a product by id
router.delete('/:id', async (req, res) => {
  try {
    const deleteProduct = await Product.destroy({
      where: {
        id: req.params.id
      }
    })
    res.status(200).json(deleteProduct)

    if (!deleteProduct) {
      res.status(404).json({ message: 'This product does not exist.' })
    }
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;