import { Meteor } from 'meteor/meteor';

Members=new Mongo.Collection('Members');
postList=new Mongo.Collection('postList');
requestList=new Mongo.Collection('requestList');


Meteor.publish("users", function() {
    return Meteor.users.find({}, {fields:{createdAt: true, profile:true, emails: true, username: true}});
});

Accounts.onCreateUser(function(options, user) {
  // We're enforcing at least an empty profile object to avoid needing to check
  // for its existence later.
  user.profile = options.profile ? options.profile : {};
  user.profile.gender="none";
  user.profile.dob_date="0";
  user.profile.dob_month="0";
  user.profile.dob_year="0";
  user.profile.contactNo="0";
  user.profile.location="none";
  user.profile.talents=[];
  user.profile.achievements=[];
  user.profile.experience=[];
  user.profile.talents.title="";
  user.profile.achievements.title="";
  user.profile.achievements.year="";



  return user;
});
Meteor.publish('thePost',function(){
  var currentUserId= this.userId;
  return postList.find({createdBy:currentUserId})
});

Meteor.publish('theRequest',function(){
  var currentUserId= this.userId;
  return requestList.find({createdBy:currentUserId})
});

Meteor.methods({
  'insertClassData':function(titleVar,imgSource,priceVar,audienceVar,skillVar, locationVar, descVar){
    var currentUserId=this.userId;
    var user = Meteor.user().username;
    postList.insert({
          title:titleVar,
          fileSource:imgSource,
          price:priceVar,
          audience:audienceVar,

          skill:skillVar,
          location:locationVar,
          description:descVar,
          createdBy:currentUserId,
          createdTime: new Date(),
          rating:null,
          owner: user,
          type: "post"
        });
      },

  'insertRequestData':function(titleVarR,imgSourceR,priceVarR,audienceVarR,skillVarR,locationVarR, descVarR){
    var currentUserId=this.userId;
    var user = Meteor.user().username;
    requestList.insert({
          title:titleVarR,
          fileSource:imgSourceR,
          price:priceVarR,
          audience:audienceVarR,

          skill:skillVarR,
          location:locationVarR,
          description:descVarR,
          createdBy:currentUserId,
          createdTime: new Date(),
          rating:null,
          owner: user,
          type: "request"
        });
      },

      'removeClass': function(selectedClass){
        postList.remove(selectedClass);
      },

      'removeRequest': function(selectedRequest){
        requestList.remove(selectedRequest);
      }
    });

