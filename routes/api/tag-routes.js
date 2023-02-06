const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

//finds all tags
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [
        {model: Product, 
        through: ProductTag}
      ]
    })
    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err)
  }
});

//finds one tag by an id
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [
        {model: Product, 
        through: ProductTag}
      ]
    })
    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err)
  }
});

//creates a new product tag
router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body)
    res.status(200).json(newTag)
  } catch (err) {
    res.status(500).json(err)
  }
});

//updates a product tage by its id
router.put('/:id', async (req, res) => {
  try {
    const updateTag = await Tag.update(req.body, {
      where: {
        id: req.params.id
      }
    })
    
    if (!req.params.id) {
      res.status(404).json({message: 'This tag does not exist'})
    } else if (!req.body) {
      res.status(400).json({message: 'Missing data. try again.'})
    }
    res.status(200).json(updateTag)
  } catch (err) {
    res.status(500).json(err)
  }
});

//deletes a tag by its id
router.delete('/:id', async (req, res) => {
  try {
    const deleteTag = await Tag.destroy({
      where: {
        id: req.params.id
      }
    })
    res.status(200).json(deleteTag)
  } catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;