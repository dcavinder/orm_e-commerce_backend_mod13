const router = require('express').Router();
const { Category, Product } = require('../../models');


router.get('/', async (req, res) => {
  // finds all of the categories
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }]
    })
    res.status(200).json(categoryData)
  } catch (err) {
    res.status(500).json(err)
  }
});

router.get('/:id', async (req, res) => {
  // finds a single category by id
  try {
   const categoryData = await Category.findByPk(req.params.id, {
    include: [{ model: Product }]
  })
  res.status(200).json(categoryData)
} catch (err) {
    res.status(500).json(err)
  }
});

// creates a new category
router.post('/', async (req, res) => {
  try {
    const newCategoryData = await Category.create(req.body);
    res.status(200).json(newCategoryData)
  } catch (err) {
    res.status(500).json(err)
  }
});

//updates the category by its id
router.put('/:id', async (req, res) => {
  try {
    const updateCategory = await Category.update(req.body, {
      where: {
        id: req.params.id
      }
    })
    res.status(200).json(updateCategory)
  } catch (err) {
    res.status(500).json(err)
  }
});

//deletes a category by its id
router.delete('/:id', async (req, res) => {
  try {
    const deleteCategoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    })
    res.status(200).json(deleteCategoryData)

    if (!delCatData) {
      res.status(404).json({message: 'This category does not exist'})
    }
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;
