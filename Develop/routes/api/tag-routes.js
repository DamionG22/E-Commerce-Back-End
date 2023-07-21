const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
// Pulls up all tags in Database
router.get('/',  async (req, res) => {
  try {
    const tagData = await Tag.findAll();
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});
// Searches database for a tag matching the ID
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      // JOIN with locations, using the Trip through table
      include: [{ model: Product, through: Tag, as: 'product_tag' }]
    });
// Error message if no tag matches ID provided
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});
// Creates new tag
router.post('/', async (req, res) => {
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});
// updates existing tag
router.put('/:id', async (req, res) => {
  const tagId = req.params.id;
  const { newName } = req.body;

  try {
    
    const updatedTag = await Tag.findByIdAndUpdate(tagId, { name: newName }, { new: true });

    if (!updatedTag) {
      // No match found with ID
      return res.status(404).json({ error: 'Tag not found' });
    }

    return res.json(updatedTag);
  } catch (error) {
   
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// deletes tag by ID
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });
// if no tag match is found 
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
