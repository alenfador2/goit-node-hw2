const mongoose = require('mongoose');
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

contactSchema.index({ name: 1, favorite: -1 });

contactSchema.statics.getAll = function () {
  return Contact.find().lean();
};

const Contact = mongoose.model('db_contacts', contactSchema, 'contacts');

module.exports = Contact;
