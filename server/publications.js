Meteor.publish('vendors', function() {
    return Vendors.find({}, {sort: {totalstudents: -1}});
});

Meteor.publish('courses', function() {
    return Courses.find();
});