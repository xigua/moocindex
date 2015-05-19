SyncedCron.add({
    name: 'daily get mooc site stats',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('at 4:36 pm');
    },
    job: function() {
        updateStatsCron();
    }
});

var rawVendorsList = {
    '慕课网': 'http://menus.zmenu.com/parsehub/imooc.api.json',
    '极客学院': 'http://menus.zmenu.com/parsehub/jikexueyuan.api.json',
    '麦子学院': 'http://menus.zmenu.com/parsehub/maizi.api.json'
}

function updateStatsCron() {
    console.log('start running cron job');
    for (key in rawVendorsList) {
        var url = rawVendorsList[key];
        console.log('start fetching remote results for ' + key + ' from ' + url);
        try {
            var result = HTTP.get(url, {headers: {Accept: 'json/application', encoding: null}});
            var json = JSON.parse(result.content);
            if (json.courses !== null && json.courses !== undefined && json.courses.length > 0) {
                updateDB(json.courses, key);
            }
        } catch (e) {
            console.log('http get FAILED!');
        }
    }
}

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
        } else if (vendorname === '极客学院') {
            url = url.replace('{vendor}', 'jikexueyuan');
            console.log('start fetching remote results for jikexueyuan.com from ' + url);
            this.unblock();
            HTTP.get(url, {headers: {Accept: 'json/application', encoding: null}}, function(error, result) {
                if(error) {
                    console.log('http get FAILED!');
                } else {
                    var json = JSON.parse(result.content);
                    if (json.courses !== null && json.courses !== undefined && json.courses.length > 0) {
                        updateDB(json.courses, '极客学院');
                    }
                }
            });
        } else if (vendorname === '麦子学院') {
            url = url.replace('{vendor}', 'maizi');
            console.log('start fetching remote results for maizi.com from ' + url);
            this.unblock();
            HTTP.get(url, {headers: {Accept: 'json/application', encoding: null}}, function(error, result) {
                if(error) {
                    console.log('http get FAILED!');
                } else {
                    var json = JSON.parse(result.content);
                    if (json.category !== null && json.category !== undefined && json.category.length > 0) {
                        var allcourses = new Array();
                        _.each(json.category, function(cat, index, list) {
                            allcourses = allcourses.concat(cat.courses);
                        });
                        updateDB(allcourses, '麦子学院');
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
    var now = moment().utc();
    _.each(courses, function(element, index, list) {
        if (typeof element.students === 'string') {
            element.students = parseInt(element.students);
        }
        if (element.url === null || element.url === undefined) {
            console.log('this course has no url somehow: ' + element);
        } else {
            var existingCourse = existingCourses[element.url];
            totalStudents += parseInt(element.students);
            if (existingCourse === undefined) {
                element.vendor = vendor;
                element.createdAt = now.toDate();
                element.lastModifiedAt = now.toDate();
                Courses.insert(element);
                console.log('inserting a new record to db.');
            } else {
                Courses.update(existingCourse, {$set: {
                    students: element.students,
                    length: element.length,
                    lastModifiedAt: now.toDate(),
                    latest_update: element.latest_update
                }});
                console.log('updating a record in db.');
            }

            updateCourseHistory(element);
        }
    });

    var thisVendor = Vendors.findOne({name: vendor});
    if (thisVendor !== null && thisVendor !== undefined) {
        Vendors.update(thisVendor, {$set: {
            totalCourses: totalCourses,
            totalStudents: totalStudents,
            lastModifiedAt: now
        }});
    }

    updateVendorHistory(vendor, totalCourses, totalStudents);
}

function updateVendorHistory(vendor, totalCourses, totalStudents) {
    var now = moment().utc();
    var todaystr = now.format('YYYY-MM-DD');
    var yesterday = now.subtract(1, 'days');
    var yesterdaystr = yesterday.format('YYYY-MM-DD');

    // first try to find out the record for today, if exists, which means it's not the first time it's run today
    var existingHistory = VendorHistory.findOne({name: vendor, day: todaystr});

    // secondly try to find out yesterday's record, if exists, then we can calculate the difference
    var yesterdayHistory = VendorHistory.findOne({name: vendor, day: yesterdaystr});

    // thirdly either insert a new record in db or update the record
    var newCourses = 0, newStudents = 0;
    if (yesterdayHistory !== null && yesterdayHistory !== undefined) {
        newCourses = totalCourses - yesterdayHistory.totalCourses;
        newStudents = totalStudents - yesterdayHistory.totalStudents;
    }
    if (existingHistory === null || existingHistory === undefined) {
        VendorHistory.insert({
            name: vendor,
            createAt: now.toDate(),
            lastModifiedAt: now.toDate(),
            day: todaystr,
            totalCourses: totalCourses,
            totalStudents: totalStudents,
            newCourses: newCourses,
            newStudents: newStudents
        });
    } else {
        VendorHistory.update(existingHistory, {$set: {
            lastModifiedAt: now.toDate(),
            day: todaystr,
            totalCourses: totalCourses,
            totalStudents: totalStudents,
            newCourses: newCourses,
            newStudents: newStudents
        }})
    }
}

function updateCourseHistory(course) {
    var now = moment().utc();
    var todaystr = now.format('YYYY-MM-DD');
    var yesterday = now.subtract(1, 'days');
    var yesterdaystr = yesterday.format('YYYY-MM-DD');

    // first try to find out the record for today, if exists, which means it's not the first time it's run today
    var existingHistory = CourseHistory.findOne({url: course.url, day: todaystr});

    // secondly try to find out yesterday's record, if exists, then we can calculate the difference
    var yesterdayHistory = CourseHistory.findOne({url: course.url, day: yesterdaystr});

    // thirdly either insert a new record in db or update the record
    var newStudents = 0;
    if (yesterdayHistory !== null && yesterdayHistory !== undefined) {
        newStudents = course.students - yesterdayHistory.students;
    }
    if (existingHistory === null || existingHistory === undefined) {
        CourseHistory.insert({
            vendor: course.vendor,
            url: course.url,
            createAt: now.toDate(),
            lastModifiedAt: now.toDate(),
            day: todaystr,
            students: course.students,
            newStudents: newStudents
        });
    } else {
        CourseHistory.update(existingHistory, {$set: {
            lastModifiedAt: now.toDate(),
            day: todaystr,
            students: course.students,
            newStudents: newStudents
        }})
    }
}

SyncedCron.start();