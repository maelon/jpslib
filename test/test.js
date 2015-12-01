/**
* define Subscribe A class
*/
var SubA = function () {
};
jpslib._utils.extendClass(SubA, jpslib.ISubscriber);
SubA.prototype.listNotificationInterested = function () {
    return ['All', 'A', 'B2A'];
};
SubA.prototype.executeNotification = function (notification) {
    switch(notification.getName()) {
        case 'All':
            console.log('suba receive All msg', notification.getBody());
            console.log('suba unsubscribe all msg');
            jpslib.unsubscribe('All', this);
            break; 
        case 'A':
            console.log('suba receive A msg', notification.getBody());
            console.log('suba send A2B msg');
            var notificationA2B = jpslib.createNotification('A2B', { 'msg': 'A2B' });
            jpslib.publish(notificationA2B);
            break;
        case 'B2A':
            console.log('suba receive B2A msg', notification.getBody());
            break;
    }
};

/**
* define Subscriber B class
*/
var SubB = function () {
};
jpslib._utils.extendClass(SubB, jpslib.ISubscriber);
SubB.prototype.listNotificationInterested = function () {
    return ['All', 'B', 'A2B'];
};
SubB.prototype.executeNotification = function (notification) {
    switch(notification.getName()) {
        case 'All':
            console.log('subb receive All msg', notification.getBody());
            break; 
        case 'B':
            console.log('subb receive B msg', notification.getBody());
            console.log('suba send B2A msg');
            var notificationB2A = jpslib.createNotification('B2A', { 'msg': 'B2A' });
            jpslib.publish(notificationB2A);
            break;
        case 'A2B':
            console.log('subb receive A2B msg', notification.getBody());
            break;
    }
};

var suba = new SubA();
jpslib.subscribe(suba);
var subb = new SubB();
jpslib.subscribe(subb);
var notificationAll = jpslib.createNotification('All', { 'msg': 'All' });
jpslib.publish(notificationAll);
setTimeout(function () {
    jpslib.publish(notificationAll);
}, 1000);
var notificationA = jpslib.createNotification('A', { 'msg': 'A' });
jpslib.publish(notificationA);
var notificationB = jpslib.createNotification('B', { 'msg': 'B' });
jpslib.publish(notificationB);
