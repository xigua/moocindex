Template.allCourses.helpers({
    courses: function(){
        return Courses.find();
    }
});