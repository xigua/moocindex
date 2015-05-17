Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() {
        return Meteor.subscribe('courses');
    }
});

Router.route('/', {name: 'allCourses'});