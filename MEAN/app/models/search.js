var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SearchSchema = new Schema({
    query: {type: String},
    location: {type: String},
    category: {type: String},
    results: {type: String}
});

SearchSchema.methods.getCategoryId = function (category) {
    var categoryList = {
        'All categories': '',
        'Music': 103,
        'Business & Professional': 101,
        'Food & Drink': 110,
        'Community & Culture': 113,
        'Performing & Visual Arts': 105,
        'Film, Media & Entertainment': 104,
        'Sports & Fitness': 108,
        'Health & Wellness': 107,
        'Science & Technology': 102,
        'Travel & Outdoor': 109,
        'Charity & Causes': 111,
        'Religion & Spirituality': 114,
        'Family & Education': 115,
        'Seasonal & Holiday': 116,
        'Government & Politics': 112,
        'Fashion & Beauty': 106,
        'Home & Lifestyle': 117,
        'Auto, Boat & Air': 118,
        'Hobbies & Special Interest': 119,
        'Other': 199
    };
    return categoryList[category];
};

module.exports = mongoose.model('Search', SearchSchema);