if (Vendors.find().count() === 0) {
    Vendors.insert({
        name:           "慕课网",
        url:            "http://www.imooc.com",
        totalcourse:    303,
        totalstudents:  25381,
        description:    "中国最大的IT技能学习平台",
        createtime:     Date.now(),
        foundtime:      new Date(2013, 8, 1),
        ios:            true,
        android:        true,
        imageurl:       "imooc_logo_180x80.png"
    });
    Vendors.insert({
        name:           "极客学院",
        url:            "http://www.jikexueyuan.com",
        totalcourse:    303,
        totalstudents:  25381,
        description:    "中国最大的IT职业在线教育平台",
        createtime:     Date.now(),
        foundtime:      new Date(2013, 8, 1),
        ios:            true,
        android:        true,
        imageurl:       "jikexueyuan_logo_180x80.png"
    });
    Vendors.insert({
        name:           "麦子学院",
        url:            "http://www.maiziedu.com",
        totalcourse:    303,
        totalstudents:  25381,
        description:    "重塑教育，做在线哈佛",
        createtime:     Date.now(),
        foundtime:      new Date(2013, 8, 1),
        ios:            true,
        android:        true,
        imageurl:       "maizi_logo_180x80.png"
    });
}