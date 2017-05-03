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

SearchSchema.methods.getMultipleCategoryIds = function (categories) {
    nums = [];
    if (categories['Music'] === true) {
        nums.push('103');
    }
    if (categories['Business & Professional'] === true) {
        nums.push('101');
    }
    if (categories['Food & Drink'] === true) {
        nums.push('110');
    }
    if (categories['Community & Culture'] === true) {
        nums.push('113');
    }
    if (categories['Performing & Visual Arts'] === true) {
        nums.push('105');
    }
    if (categories['Film, Media & Entertainment'] === true) {
        nums.push('104');
    }
    if (categories['Sports & Fitness'] === true) {
        nums.push('108');
    }
    if (categories['Health & Wellness'] === true) {
        nums.push('107');
    }
    if (categories['Science & Technology'] === true) {
        nums.push('102');
    }
    if (categories['Government & Politics'] === true) {
        nums.push('112');
    }
    if (categories['Fashion & Beauty'] === true) {
        nums.push('106');
    }
    if (categories['Home & Lifestyle'] === true) {
        nums.push('117');
    }
    if (categories['Auto, Boat & Air'] === true) {
        nums.push('118');
    }
    if (categories['Hobbies & Special Interest'] === true) {
        nums.push('119');
    }
    if (categories['Other'] === true) {
        nums.push('199');
    }
    var num_str = '';
    for (var i = 0; i < nums.length; i++) {
        num_str += nums[i];
        num_str += ','
    }
    if (num_str.length > 0) {
        num_str = num_str.substring(0, num_str.length - 1);
    }
    return num_str;
};

module.exports = mongoose.model('Search', SearchSchema);