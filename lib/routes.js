Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    waitOn: function() {
        var searchText = Session.get('searchText');
        Meteor.subscribe('searchCourses', searchText);
    }
});

Router.route('/', {name: 'allCourses'});