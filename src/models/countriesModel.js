import mongoose from 'mongoose';

const countrySchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  name_ru: {
    type: String,
    trim: true,
  },
  code: {
    type: String,
    trim: true,
  },
});

const Country = mongoose.model('Country', countrySchema);

export default Country;
