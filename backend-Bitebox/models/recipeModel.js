// models/recipeModel.js
const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    enum: ['g', 'kg', 'ml', 'l', 'tbsp', 'tsp', 'cup', 'piece', 'slice', 'clove', 'bunch', 'pinch', 'dash', 'whole', 'can', 'jar', 'packet']
  },
  price: {
    type: Number,
    required: true,
    default: 0
  }
});

const stepSchema = new mongoose.Schema({
  stepNumber: {
    type: Number,
    required: true
  },
  instruction: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 0
  }
});

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner']
  },
  prepTime: {
    type: Number,
    required: true,
  },
  cookTime: {
    type: Number,
    required: true,
  },
  servings: {
    type: Number,
    required: true,
    default: 2
  },
  ingredients: [ingredientSchema],
  steps: [stepSchema],
  totalPrice: {
    type: Number,
    required: true,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  recipeImage: {
    type: String,
    required: false,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: false, 
  },
}, { timestamps: true });

recipeSchema.methods.calculateTotalPrice = function() {
  return this.ingredients.reduce((total, ingredient) => {
    return total + (ingredient.quantity * ingredient.price);
  }, 0);
};

recipeSchema.methods.calculatePriceForServings = function(servings) {
  const basePrice = this.calculateTotalPrice();
  const baseServings = this.servings;
  return (basePrice / baseServings) * servings;
};

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe; 