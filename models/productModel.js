const mongoose = require('mongoose');
const { Schema } = mongoose;

const categoryEmbeddedSchema = new Schema({
  categorie_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  categorie_name: {
    type: String,
    required: true
  }
}, { _id: false });

const productSchema = new Schema({
  name: { type: String, unique: true, required: true },
  description: String,
  quantity: { type: Number, required: true },
  categories: [categoryEmbeddedSchema],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
