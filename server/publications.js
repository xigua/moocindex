Meteor.publish('vendors', function() {
    return Vendors.find({}, {sort: {totalstudents: -1}});
});

Meteor.publish('searchCourses', function(searchText) {
    // second paramter 'i' indicates that we want our regular expression to be case-insensitive.
    var filter = new RegExp(searchText, 'i');
    return Courses.find({name: filter}, {sort: {students: -1}});
});