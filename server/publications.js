Meteor.publish('vendors', function() {
    return Vendors.find({}, {sort: {totalstudents: -1}});
});

Meteor.publish('searchCourses', function(searchText, limit) {
    // second paramter 'i' indicates that we want our regular expression to be case-insensitive.
    var filter = new RegExp(searchText, 'i');
    var totalCount = Courses.find({name: filter}).count();
    if (limit >= totalCount) {
        limit = 0;
    }

    return Courses.find({name: filter}, {sort: {students: -1}, limit: limit});
});