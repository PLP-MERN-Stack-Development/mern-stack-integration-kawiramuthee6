const express = require('express');
const { body } = require('express-validator');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
} = require('../controllers/postController');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const upload = require('../middleware/upload');

const router = express.Router();

// Validation rules
const postValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),
  body('content')
    .notEmpty()
    .withMessage('Content is required'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
];

const commentValidation = [
  body('content')
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 500 })
    .withMessage('Comment cannot be more than 500 characters'),
];

// Public routes
router.get('/', getPosts);
router.get('/:id', getPost);

// Protected routes
router.post(
  '/',
  protect,
  upload.single('featuredImage'),
  postValidation,
  handleValidationErrors,
  createPost
);

router.put(
  '/:id',
  protect,
  upload.single('featuredImage'),
  postValidation,
  handleValidationErrors,
  updatePost
);

router.delete('/:id', protect, deletePost);
router.post('/:id/comments', protect, commentValidation, handleValidationErrors, addComment);

module.exports = router;