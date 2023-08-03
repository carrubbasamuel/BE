const mongoose = require('mongoose');


const SchemaResources = new mongoose.Schema(
    {
        index: Number,
        guid: String,
        isActive: Boolean,
        balance: String,
        picture: String,
        age: Number,
        eyeColor: String,
        name: {
          first: String,
          last: String
        },
        company: String,
        email: String,
        phone: String,
        address: String,
        about: String,
        registered: Date,
        latitude: String,
        longitude: String,
        tags: [String],
        range: [Number],
        friends: [
          {
            id: Number,
            name: String
          }
        ],
        greeting: String,
        favoriteFruit: String
      }      
)

module.exports = mongoose.model('SchemaResources', SchemaResources, 'resources');