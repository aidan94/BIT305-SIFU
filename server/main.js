import { Meteor } from 'meteor/meteor';

Members=new Mongo.Collection('Members');
postList=new Mongo.Collection('postList');
requestList=new Mongo.Collection('requestList');
Markers = new Mongo.Collection('markers');
dayTime = new Mongo.Collection('dayTime');
selectedSes=new Mongo.Collection ('selectedSes');
appointment=new Mongo.Collection('appointment');
transaction=new Mongo.Collection('transaction');
chatRooms = new Mongo.Collection('chatRooms');
Comments = new Mongo.Collection("comments");
admin=new Mongo.Collection('admin');
report=new Mongo.Collection('report');
famousPost=new Mongo.Collection('famousPost');

Meteor.publish("users", function() {
    return Meteor.users.find({}, {fields:{createdAt: true, profile:true, emails: true, username: true}});
});


Meteor.publish('comments', function() {
  return Comments.find();
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
  deleteUser: function (targetUserId, group) {
    var loggedInUser = Meteor.user()

    if (!loggedInUser ||
        !Roles.userIsInRole(loggedInUser,
                            ['admin'], group)) {
      throw new Meteor.Error(403, "Access denied")
    }

    // remove permissions for target group
    Roles.setUserRoles(targetUserId, [], group)

    // do other actions required when a user is removed...
  },
  updateRoles: function (targetUserId, roles, group) {
    var loggedInUser = Meteor.user()

    if (!loggedInUser ||
        !Roles.userIsInRole(loggedInUser,
                            ['manage-users'], group)) {
      throw new Meteor.Error(403, "Access denied")
    }

    Roles.setUserRoles(targetUserId, roles, group)
  },

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
          rating:0,
          owner: user,
          type: "post",
          status: "Normal",
          isread:"false"
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
          rating:0,
          owner: user,
          type: "request",
          status: "Normal",
          isread:"false"
        });
      },

      'insertDayTime':function(dayVarR, timeFromR, timeToR){
        dayTime.insert({
          day: dayVarR,
          timeFrom: timeFromR,
          timeTo: timeToR,
        });
      },

      'insertApp':function(session,classID,skillPvd,totalPrice,status, className,ispaid,currentDate,type){
        var currentUserId=this.userId;
        appointment.insert({
          session: session,
          classID: classID,
          skillPvd:skillPvd,
          skillSkr:currentUserId,
          skillSkrName:Meteor.user().username,
          totalPrice:totalPrice,
          status:status,
          title:className,
          ispaid:ispaid,
          isread:"false",
          type:type,
          createdDate:new Date()
        });
      },

      'insertReqApp':function(session,classID,skillSkr,totalPrice,status, className,ispaid,currentDate,type){
        var currentUserId=this.userId;
        appointment.insert({
          session: session,
          classID: classID,
          skillPvd:Meteor.userId(),
          skillSkr:skillSkr,
          skillPvdName:Meteor.user().username,
          totalPrice:totalPrice,
          status:status,
          title:className,
          ispaid:ispaid,
          isread:"false",
          type:type,
          createdDate:new Date()
        });
      },

      'insertTrans':function(transID,classID,paymentType,cardBrand,
    cardType,userID,amount,appointmentID,paymentDate,cardExpMonth,cardExpYear,status){
        var currentUserId=this.userId;
          var stripe = StripeAPI("sk_test_BJQdg83NbQFbFaBlcW7dEwX6");

        transaction.insert({
          transID: transID,
          classID: classID,
          paymentType:paymentType,
          cardBrand:cardBrand,
          cardType:cardType,
          userID:userID,
          amount:amount,
          appointmentID:appointmentID,
          paymentDate:paymentDate,
          cardExpMonth:cardExpMonth,
          cardExpYear:cardExpYear,
          status:status,

        });

      },

      'insertRate': function(currentUser,classID,){
        var currentUserId=this.userId;
        rating.insert({
          session: session,
          classID: classID,
          skillPvd:skillPvd,
          skillSkr:currentUserId,
          skillSkrName:Meteor.user().username,
          totalPrice:totalPrice,
          status:status,
          title:className,
          ispaid:ispaid,
          isread:"false",
          createdDate:new Date()
        });
      },

      'submitReport':function(currentUser,classType, classID,reportVal, ownerID){
        report.insert({
          reportBy:currentUser,
          classType:classType,
          classID:classID,
          reason:reportVal,
          createdDate: new Date(),
          ownerID: ownerID
        })
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
      },

      'updatePayStatus':function(appID){
        appointment.update(appID,{
          $set:{
            ispaid:"true",
          }
        })
      },

      'updateReqPayStatus':function(appID){
        appointment.update(appID,{
          $set:{
            ispaid:"true",
            status: "approved"
          }
        })
      },

      'updateread':function(appID){
        appointment.update(appID,{
          $set:{
            isread:"true",
          }
        })
      },

      'updateReadRep':function(classID){
        postList.update(classID,{
          $set:{
            isread:"true",
          }
        })
      },


      'approvedAppStatus':function(appID){
        appointment.update(appID,{
          $set:{
            status:"approved",
          }
        })
      },

      'rejectAppStatus':function(appID){
        appointment.update(appID,{
          $set:{
            status:"reject",
          }
        })
      },

      'insertComment': function(comment){
        if(!_.isEmpty(comment))
           Comments.insert(comment);
        },

      'updatePostRating':function(new_rateValue, selectedClassRequestID){
        postList.update(selectedClassRequestID,{
          $set:{
            rating: new_rateValue
          }
        })
      },

       'removeReports':function(classID){
         report.remove({classID:classID});
       },

       'hideClass':function(classID, reason){
         postList.update(classID,{
           $set:{
             status:{
               isdelete:"true",
               reason:reason
             }
           }
         })
       },
       'hideRequest':function(classID, reason){
         requestList.update(classID,{
           $set:{
             status:{
               isdelete:"true",
               reason:reason
             }
           }
         })
       }
    });
