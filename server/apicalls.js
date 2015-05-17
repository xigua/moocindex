/*Meteor.methods({
    fetchFromService: function(vendorname) {
        var url = "https://www.parsehub.com/api/v2/projects/{PROJECT_TOKEN}/last_ready_run/data";
        var api_key = 'te79WidrkOmN_Fxs2e_kNnX5';
        if (vendorname === '慕课网') {
            //url = url.replace('{PROJECT_TOKEN}', 'tQQl5Voj4BKCTCypvGibDLfu');
            url = url.replace('{PROJECT_TOKEN}', 'tbNBvhG208xhGUpecAk62V80');
            console.log('start fetching remote results for imooc.com from ' + url);
            this.unblock();
            HTTP.get(url, {params: {api_key: api_key}, headers: {Accept: 'json/application', encoding: null}}, function(error, result) {
                if(error) {
                    console.log('http get FAILED!');
                } else {
                    console.log('http get SUCCESS');
                    if (result.statusCode === 200) {
                        if (result.headers['content-encoding'] && result.headers['content-encoding'].indexOf('gzip') > -1) {
                            console.log('The response is gzipped. Now unzip it.');
                            var unzipped = gunzip(result.content);
                            console.log(unzipped);
                        }
                        //console.log(result.content);
                        //console.log(result.data);
                    }
                }
            });
            return true;
        }
    }
});*/

Meteor.methods({
    fetchFromService: function(vendorname) {
        var url = "http://menus.zmenu.com/parsehub/{vendor}.api.json";
        if (vendorname === '慕课网') {
            url = url.replace('{vendor}', 'imooc');
            console.log('start fetching remote results for imooc.com from ' + url);
            this.unblock();
            HTTP.get(url, {headers: {Accept: 'json/application', encoding: null}}, function(error, result) {
                if(error) {
                    console.log('http get FAILED!');
                } else {
                    var json = JSON.parse(result.content);
                    if (json.courses !== null && json.courses !== undefined && json.courses.length > 0) {
                        updateDB(json.courses, '慕课网');
                    }
                }
            });
        }
        return true;
    }
});

function findExistingCourseMap(vendor) {
    var courses = Courses.find({vendor: vendor});
    var result = {};
    if (courses !== null && courses !== undefined && courses.count() > 0) {
        courses.forEach(function(course) {
            result[course.url] = course;
        });
    }
    return result;
}

function updateDB(courses, vendor) {
    var existingCourses = findExistingCourseMap(vendor);
    var totalStudents = 0;
    var totalCourses = courses.length;
    _.each(courses, function(element, index, list) {
        if (element.url === null || element.url === undefined) {
            console.log('this course has no url somehow: ' + element);
        } else {
            var existingCourse = existingCourses[element.url];
            totalStudents += parseInt(element.students);
            if (existingCourse === undefined) {
                element.vendor = vendor;
                Courses.insert(element);
                console.log('inserting a new record to db.');
            } else {
                Courses.update(existingCourse, {$set: {
                    students: element.students,
                    length: element.length,
                    latest_update: element.latest_update
                }});
                console.log('updating a record in db.');
            }
        }
    });

    var thisVendor = Vendors.findOne({name: vendor});
    if (thisVendor !== null && thisVendor !== undefined) {
        Vendors.update(thisVendor, {$set: {
            totalcourse: totalCourses,
            totalstudents: totalStudents
        }});
    }
}