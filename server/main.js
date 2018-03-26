import { Meteor } from 'meteor/meteor';

Members=new Mongo.Collection('Members');
postList=new Mongo.Collection('postList');
requestList=new Mongo.Collection('requestList');
Markers = new Mongo.Collection('markers');
dayTime = new Mongo.Collection('dayTime')


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
  'insertClassData':function(titleVar,imgSource,priceVar,audienceVar,dayTimeVar,skillVar, locationVar, descVar){
    var currentUserId=this.userId;
    var user = Meteor.user().username;
    postList.insert({
          title:titleVar,
          fileSource:imgSource,
          price:priceVar,
          audience:audienceVar,
          dayTimeVar: dayTimeVar,
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


  'insertRequestData':function(titleVarR,imgSourceR,priceVarR,audienceVarR,dayTimeVarR,skillVarR,locationVarR, descVarR){
    var currentUserId=this.userId;
    var user = Meteor.user().username;
    requestList.insert({
          title:titleVarR,
          fileSource:imgSourceR,
          price:priceVarR,
          audience:audienceVarR,
          dayTimeVar: dayTimeVarR,
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

      'insertDayTime':function(dayVarR, timeFromR, timeToR){
        dayTime.insert({
          day: dayVarR,
          timeFrom: timeFromR,
          timeTo: timeToR,
        });
      },

      'removeClass': function(selectedClass){
        postList.remove(selectedClass);
      },

      'removeRequest': function(selectedRequest){
        requestList.remove(selectedRequest);
      },

      'editClassData':function(selectedEdClass, titleVarEdit,imgSourceEdit,priceVarEdit,audienceVarEdit,dayTimeVarEdit,skillVarEdit,locationVarEdit, descVarEdit){
        postList.update(selectedEdClass, {
          $set:{
            title:titleVarEdit,
            fileSource:imgSourceEdit,
            price:priceVarEdit,
            audience:audienceVarEdit,
            skill:skillVarEdit,
            location:locationVarEdit,
            description:descVarEdit
          },
          $addToSet:{dayTimeVar:{$each:dayTimeVarEdit}},
        });
      },

      'editRequestData':function(selectedEdRequest, titleVarREdit,imgSourceREdit,priceVarREdit,audienceVarREdit,dayTimeVarREdit,skillVarREdit,locationVarREdit, descVarREdit){
        requestList.update(selectedEdRequest, {
          $set:{
            title:titleVarREdit,
            fileSource:imgSourceREdit,
            price:priceVarREdit,
            audience:audienceVarREdit,
            skill:skillVarREdit,
            location:locationVarREdit,
            description:descVarREdit
          },
          $addToSet:{dayTimeVar:{$each:dayTimeVarREdit}},
        });
      }
    });
