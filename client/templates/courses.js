Template.allCourses.helpers({
    courses: function() {
        return Courses.find({}, {sort: {students: -1}});
    },

    courseCount: function() {
        return Courses.find().count();
    }
});

