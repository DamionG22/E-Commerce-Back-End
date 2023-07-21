const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
// Finds all categories in database
router.get('/',  async (req, res) => {
  try {
    const categoryData = await Category.findAll();
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});
// FInds a specific category by its unique ID
router.get('/:id', async  (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      
      include: [{ model: Product, through: Category, as: 'product_category' }]
});
// If the ID provided does not have an active category in the database to match it
 if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});
// Creates a new category 
router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});
// Updates Category
router.put('/:id', async (req, res) => {
  const categoryId = req.params.id;
  const { newProduct } = req.body;

  try {
    
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, { Product: newProduct }, { new: true });

    if (!updatedCategory) {
      // No match found with ID
      return res.status(404).json({ error: 'Category not found' });
    }

    return res.json(updatedCategory);
  } catch (error) {
   
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Deletes category by ID
router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
