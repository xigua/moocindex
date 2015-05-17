Template.allCourses.helpers({
    courses: function(){
        return Courses.find({}, {sort: {students: -1}});
    }
});