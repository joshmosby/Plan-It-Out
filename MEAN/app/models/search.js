var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SearchSchema = new Schema({
    query: {type: String},
    location: {type: String},
    category: {type: String},
    results: {type: String}
});

SearchSchema.methods.getCategoryId = function (category) {
    const categoryList = {
        'all categories': '',
        'music': 103,
        'business & professional': 101,
        'food & drink': 110,
        'community & culture': 113,
        'performing & visual arts': 105,
        'film, media & entertainment': 104,
        'sports & fitness': 108,
        'health & wellness': 107,
        'science & technology': 102,
        'travel & outdoor': 109,
        'charity & causes': 111,
        'religion & spirituality': 114,
        'family & education': 115,
        'seasonal & holiday': 116,
        'government & politics': 112,
        'fashion & beauty': 106,
        'home & lifestyle': 117,
        'auto, boat & air': 118,
        'hobbies & special interest': 119,
        'other': 199
    };
    return categoryList[category];
};

module.exports = mongoose.model('Search', SearchSchema);