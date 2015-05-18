Meteor.publish('vendors', function() {
    return Vendors.find({}, {sort: {totalstudents: -1}});
});

Meteor.publish('searchCourses', function(searchText, limit) {
    if (limit > Courses.find().count()) {
        limit = 0;
    }

    // second paramter 'i' indicates that we want our regular expression to be case-insensitive.
    var filter = new RegExp(searchText, 'i');
    return Courses.find({name: filter}, {sort: {students: -1}, limit: limit});
});