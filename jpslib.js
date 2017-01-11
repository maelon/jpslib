/*===================================================================
#    FileName: jpslib.js
#      Author: Maelon.J
#       Email: maelon.j@gmail.com
#  CreateTime: 2016-04-21 22:31
# Description: jpslib
#     Version: v1.0.2
# Updated by maelon 2017-01-11 15:21
===================================================================*/

/**
* 简单的发布订阅机制
*/
module.exports = (function jpslib() {
    var jps = {};

    /**
    * interface to subscribe notification
    */
    jps.subscribe =  function (subscriber) {
        if(subscriber.listNotificationInterested && typeof subscriber.listNotificationInterested === 'function' && subscriber.executeNotification && typeof subscriber.executeNotification === 'function') {
            var names = subscriber.listNotificationInterested();
            if(names instanceof Array) {
                //check names type
                names.forEach(function (name) {
                    if(typeof name === 'string') {
                        //do nothing
                    } else {
                        throw new Error('interested notification name must be String type');
                    }
                });
                //clear
                jps._removeSubscribersFromMap(subscriber);
                //add
                names.forEach(function (name) {
                    jps._addSubscriberToMap(name, subscriber);
                });
            } else {
                throw new Error('interface listNotificationInterested of subscriber must return Array type');
            }
        } else {
            throw new Error('subscriber must implement ISubscriber');
        }
    };

    /**
    * interface to publish notification
    */
    jps.publish = function (notification) {
        if(notification.getName && typeof notification.getName === 'function') {
            var subs = jps._getSubscribersFromMap(notification.getName()).concat();
            subs.forEach(function (ele) {
                ele.executeNotification(notification);
            });
        } else {
            throw new Error('notification must implement INotification');
        }
    };

    /**
    * interface to create new notification object
    */
    jps.createNotification = function (name, data, type) {
        if(typeof name === 'string') {
            var Notification = function (name, data, type) {
                jps.INotification.call(this, name, data, type);
            };
            jps._utils.extendClass(Notification, jps.INotification);
            return new Notification(name, data, type);
        } else {
            throw new Error('notification name must be String type');
        }
    };

    /**
    * interface to unsubscribe notification interested by subscriber
    */
    jps.unsubscribe = function (notificationname, subscriber) {
        if(subscriber.listNotificationInterested && typeof subscriber.listNotificationInterested === 'function') {
            if(typeof notificationname === 'string') {
                jps._removeSubscriberFromMap(notificationname, subscriber);
            } else {
                throw new Error('interested notification name must be String type');
            }
        } else {
            throw new Error('subscriber must implement ISubscriber');
        }
    };

    /**
    *  interface to unsubscribe all the notification interested by subscriber
    */
    jps.unsubscribeAll = function (subscriber) {
        if(subscriber.listNotificationInterested && typeof subscriber.listNotificationInterested === 'function') {
            if(typeof notificationname === 'string') {
                jps._removeSubscribersFromMap(subscriber);
            } else {
                throw new Error('interested notification name must be String type');
            }
        } else {
            throw new Error('subscriber must implement ISubscriber');
        }
    };

    /**
    * the map from notification name to subscriber
    */
    jps._notificationMap = {};
    /**
    * get the subscribers from map by the notification name
    */
    jps._getSubscribersFromMap = function (notificationname) {
        if(jps._notificationMap[notificationname] === undefined) {
            return [];
        } else {
            return jps._notificationMap[notificationname];
        } 
    };
    /**
    * get the interested names from map by the subscriber
    */
    jps._getInterestedNamesFromMap = function (subscriber) {
        var retArr = [];
        var arr;
        for(var name in jps._notificationMap) {
            arr = jps._notificationMap[name].filter(function (ele) {
                return ele === subscriber;
            });
            if(arr.length > 0) {
                retArr.push(name);
            }
        }
        return retArr;
    };
    /**
    * check the name is subscribed by the subscriber from map
    */
    jps._hasSubscriberFromMap = function (name, subscriber) {
        var names = jps._getInterestedNamesFromMap(subscriber);
        var retArr = names.filter(function (ele) {
            return ele === name;
        });
        return retArr.length > 0;
    };
    /**
    *  add the subscriber to the map
    */
    jps._addSubscriberToMap = function (name, subscriber) {
        if(jps._hasSubscriberFromMap(name, subscriber)) {
            //do nothing
        } else {
            var subs = jps._getSubscribersFromMap(name);
            if(subs.length === 0) {
                subs = jps._notificationMap[name] = [];
            }
            subs.push(subscriber);
        }
        return true;
    };
    /**
    * remove the subscriber from the map
    */
    jps._removeSubscriberFromMap = function (name, subscriber) {
        var subs = jps._getSubscribersFromMap(name);
        var idx = subs.indexOf(subscriber);
        if(idx > -1) {
            subs.splice(idx, 1);
        } else {
            //do nothing
        }
        return subs;
    };
    /**
    * remove all observed notification for the subscriber
    */
    jps._removeSubscribersFromMap = function (subscriber) {
        var subs;
        var names = jps._getInterestedNamesFromMap(subscriber);
        names.forEach(function (name) {
            var subs = jps._removeSubscriberFromMap(name, subscriber); 
            if(subs && subs.length === 0) {
                delete jps._notificationMap[name];
            }
        });
        return true;
    };

    jps._utils = {
        'extendClass': function (child, parent) {
            if(typeof child !== 'function')
                throw new TypeError('extendClass child must be function type');
            if(typeof parent !== 'function')
                throw new TypeError('extendClass parent must be function type');

            if(child === parent)
                return ;
            var Transitive = new Function();
            Transitive.prototype = parent.prototype;
            child.prototype = new Transitive();
            return child.prototype.constructor = child;
        }
    };

    /**
    * base class of subscriber
    */
    jps.ISubscriber = function () {

    };
    /**
    * must be implemented
    * interface to observe subscriber's interested notification
    */
    jps.ISubscriber.prototype.listNotificationInterested = function () {
        return [];
    };
    /**
    * must be implemented
    * interface to execute a notification interested by the subscriber
    */
    jps.ISubscriber.prototype.executeNotification = function (notification) {
        
    };

    /**
    * base class of notification
    */ 
    jps.INotification = function (name, body, type) {
        if(name === null || name === undefined) {
            throw new Error('notification must have a name');
        }
        if(typeof name !== 'string') {
            throw new TypeError('notification name must be string type');
        }
        this._name = name;
        this._body = body;
        this._type = type;
    };
    /**
    * interface to get notification's name
    */
    jps.INotification.prototype.getName = function () {
        return this._name;
    };
    /**
    * interface to get notification's body
    */
    jps.INotification.prototype.getBody = function () {
        return this._body;
    };
    /**
    * interface to get notification's type
    */
    jps.INotification.prototype.getType = function () {
        return this._type;
    };

    return jps;
})();
