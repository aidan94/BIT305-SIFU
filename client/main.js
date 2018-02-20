import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';


Router.route('/profile');
Router.route('/main');
Router.route('/classpage');
Router.route('/resultpage');
/*
Router.configure({
    layoutTemplate: 'main'
});
*/

Meteor.subscribe('thePost');
Meteor.subscribe('theRequest');
Meteor.subscribe("users");

Resume = new Mongo.Collection('Resume');
postList = new Mongo.Collection('postList');
requestList=new Mongo.Collection('requestList');

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});


//Aidan's Part
Template.newClass.events({
  'submit form':function(event){
  event.preventDefault();
    var titleVar = event.target.title.value;
    var imgSource = event.target.imageSource.value;
    var priceVar = event.target.price.value;
    var audienceVar = event.target.selectAudience.value;

    //var dayVar = event.target.day.value;

    //Insert multiple select dropdown into array
    var dayVar = document.getElementById("selDay");
    var daysVal = new Array();
      for (i = 0; i < dayVar.length; i++) {
          if (dayVar .options[i].selected) daysVal.push(dayVar.options[i].value);
      }

    //var timeVar = event.target.time.value;

    //Insert multiple select dropdown into array
    var timeVar = document.getElementById("selTime");
    var timeArray = new Array();
      for (i = 0; i < timeVar.length; i++) {
          if (timeVar .options[i].selected) timeArray.push(timeVar.options[i].value);
      }
    var skillVar = event.target.selectSkill.value;
    var locationVar = event.target.location.value
    var descVar = event.target.desc.value;
    console.log(titleVar,imgSource,priceVar,audienceVar,daysVal,timeArray,skillVar,locationVar, descVar);
    if (titleVar != "",imgSource != "",priceVar!= "",audienceVar!= "",daysVal!= "",timeArray!= "",skillVar != "",locationVar!= "", descVar!= "")
    {
      Meteor.call('insertClassData', titleVar,imgSource,priceVar,audienceVar,daysVal,timeArray,skillVar, locationVar, descVar)
    }

    document.getElementById("addForm").reset();
    $('.selectpicker').selectpicker('render');

}});

Template.newClass.onRendered(function() {
  $('.selectpicker').selectpicker({
    size: 3
  });
  $('#addForm').validator();
});

Template.post.helpers({
  'postClasses': function () {
    var currentUserId = Meteor.userId();
    Session.set('selectedUserId',currentUserId);
    var selectedUserId = Session.get('selectedUserId');

    /*var selectedUser = Session.get('selectedUser');
    console.log(selectedUser);
    if(selectedUser != null){*/
    if (selectedUserId != null){
      return postList.find({createdBy:selectedUserId},{sort: {createdTime:-1}});
    }
    else
        return postList.find({},{sort: {createdTime:-1}});
  },

  'selectedClass':function(){
  var postID = this._id;
  var selectedPost = Session.get('selectedPost');
  if (postID == selectedPost)
  {
    return "selected"
  }
},
});

Template.newRequest.onRendered(function() {
  $('.selectpicker').selectpicker({
    size: 3
  });
  $('#addRForm').validator();
});

Template.newRequest.events({
  'submit form':function(event){
  event.preventDefault();
    var titleVarR = event.target.Rtitle.value;
    var imgSourceR = event.target.RimageSource.value;
    var priceVarR = event.target.Rprice.value;
    var audienceVarR = event.target.RselectAudience.value;
    var dayVarR = event.target.Rday.value;

    //var dayVar = document.getElementById("selDay");

    //Insert multiple select dropdown into array
    var dayVarR = document.getElementById("selRDay");
    var daysValR = new Array();
      for (i = 0; i < dayVarR.length; i++) {
          if (dayVarR .options[i].selected) daysValR.push(dayVarR.options[i].value);
      }

    //var timeVarR = event.target.Rtime.value;

    //Insert multiple select dropdown into array
    var timeVarR = document.getElementById("selRTime");
    var timeArrayR = new Array();
      for (i = 0; i < timeVarR.length; i++) {
          if (timeVarR .options[i].selected) timeArrayR.push(timeVarR.options[i].value);
      }
    var skillVarR = event.target.RselectSkill.value;
    var locationVarR = event.target.Rlocation.value
    var descVarR = event.target.Rdesc.value;
    console.log(titleVarR,imgSourceR,priceVarR,audienceVarR,daysValR,timeArrayR,skillVarR,locationVarR, descVarR);
    if (titleVarR != "",imgSourceR != "",priceVarR!= "",audienceVarR!= "",daysValR!= "",timeArrayR!= "",skillVarR != "",locationVarR!= "", descVarR!= "")
    {
    Meteor.call('insertRequestData', titleVarR,imgSourceR,priceVarR,audienceVarR,daysValR,timeArrayR,skillVarR,locationVarR, descVarR)
  }
    document.getElementById("addRForm").reset();
    $('.selectpicker').selectpicker('render');

}});

Template.request.helpers({
  'requestClasses': function () {
    var currentUserId = Meteor.userId();
    Session.set('selectedUserId',currentUserId);
    var selectedUserId = Session.get('selectedUserId');

    /*var selectedUser = Session.get('selectedUser');
    console.log(selectedUser);
    if(selectedUser != null){*/
    if (selectedUserId != null){
      return requestList.find({createdBy:selectedUserId},{sort: {createdTime:-1}});
    }
    else
        return requestList.find({},{sort: {createdTime:-1}});
  },

  'selectedClass':function(){
  var requestID = this._id;
  var selectedRequest = Session.get('selectedRequest');
  if (postID == selectedRequest)
  {
    return "selected"
  }
},
});


//Roushan's Part
/*NEWW*/
Template.request.events({
  'click .requestClasses': function(){
    var classID = this._id;
    Session.set('selectedRequest', classID);
    var selectedPlayer = Session.get('selectedRequest');
    console.log(selectedPlayer);
  }
});

Template.classpage.helpers({
  class: function(){
    if(Session.get('selectedRequest')){
        return requestList.findOne({"_id": Session.get('selectedRequest')});
    } else
    if(Session.get('selectedClass')){
      return postList.findOne({"_id": Session.get('selectedClass')});
    }
  }
});

Template.classpage.events({

});

Template.findCourse.events({
  'submit #search':function(event){
    event.preventDefault();
    var talentTitle = $('[name="searchCourse"]').val();
    Session.set('query',talentTitle)
    Router.go('/resultpage');

  }
});

Template.resultpage.helpers({
  searchResult:function(){
    var query=Session.get('query');
    var allPost = postList.find();
    if(query){
        return postList.find({"title": { $regex: ".*"+ query + ".*", $options: 'i' }}).fetch();
      }else
       {
        return allPost;
      }

  },
  searchCount: function() {
    var query=Session.get('query');
    var count=postList.find({"title": { $regex: ".*"+ query + ".*", $options: 'i' }}).count();
        return count;
  },
  oriQuery:function(){
    var query=Session.get('query');
    return query;
  }

});
/*END OF NEW*/

Template.updatePI.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  }
});

Template.updatePI.events({
  'submit form':function(event){
      event.preventDefault();
    var contactNo = event.target.contactNo.value;
    var dob_date = event.target.dob_date.value;
    var dob_month = event.target.dob_month.value;
    var dob_year = event.target.dob_year.value;
    var location = event.target.location.value;
    Meteor.users.update({_id: Meteor.userId()}, { $set:
    {"profile.contactNo": contactNo,
      "profile.dob_date":dob_date,
      "profile.dob_month":dob_month,
      "profile.dob_year":dob_year,
      "profile.location":location
    }
    });

    /*
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if((contactNo.match(phoneno))
          {

        };)
        else
          {
          alert("message");
          return false;
          }
          */
}});

Template.updatePI.onRendered(function(){
    $('.validate').validate({
        rules: {
            contactNo: {
                minlength: 10,
                maxlength: 13,
                digits:true,
            }
        },
        messages: {
          contactNo: {
              digits: "Please enter digits only.",
              minlength : "Phone number must be at least 10 digits.",
              maxlength: "Phone number must be less than 13 digits."
          }
        }
    });
});

Template.addTalents.onRendered(function(){
   var pattern=!/^[a-zA-Z]*$/g;
   $('.validate').validate({
       fields: {
         talentTitle: {
              regexp: {
                  regexp: /^[a-zA-Z0-9_]+$/,
                  message: 'The username can only consist of alphabetical, number and underscore'
                 }
             }
         }})



       }
   );

   Template.addAch.onRendered(function(){
       $('.validate').validate({
           rules: {
               achYear: {
                   digits:true,
               }
           },
           messages: {
             achYear: {
                 digits: "Please enter digits only.",
                 minlength : "Year must be 4 digits.",
                 maxlength: "Year must be 4 digits"
             }
           }
       });
   });

Template.updatePI.onCreated(function(){
    console.log("The 'login' template was just created.");
});


Template.updatePI.onDestroyed(function(){
    console.log("The 'login' template was just destroyed.");
});

Template.profile.helpers({
  contactNo: function() {
    return Meteor.user().profile.contactNo;
  },
  dob_date:function(){
    return Meteor.user().profile.dob_date;
  },
  dob_month:function(){
    return Meteor.user().profile.dob_month;
  },
  dob_year:function(){
    return Meteor.user().profile.dob_year;
  },
  location:function(){
    return Meteor.user().profile.location;
  },


});

Template.addTalents.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  }
});

Template.addTalents.events({
  'submit form':function(event){
    event.preventDefault();
    var talentTitle = $('[name="talentTitle"]').val();
  var alphaExp = /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/;

  //validation for alphabets
  if(talentTitle.match(alphaExp))
  {
    Meteor.users.update({_id: Meteor.userId()}, { $push:
    {'profile.talents': {title: talentTitle}}
  });
  }else{
      alert("Please enter only alphabets");
  }
}
});

Template.updateResume.helpers({
  talents: function() {
    return Meteor.user().profile.talents;
  },
  achievements: function() {
    return Meteor.user().profile.achievements;
  },
  experience: function() {
    return Meteor.user().profile.experience;
  },
});

Template.talentTab.helpers({
  talents: function() {
    return Meteor.user().profile.talents;
  },
  achievements: function() {
    return Meteor.user().profile.achievements;
  },
  experience: function() {
    return Meteor.user().profile.experience;
  },
});


Template.addAch.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  }
});

Template.addAch.events({
  'submit form':function(event){
    event.preventDefault();
    var achTitle = $('[name="achTitle"]').val();
    var achYear = $('[name="achYear"]').val();
    var alphaExp = /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/;
    var currentYear=new Date().getFullYear();

    //validation for alphabets
    if(achTitle.match(alphaExp))
    {
      if(achYear.match(/^[0-9]{4}$/) && achYear<=currentYear+1)
      {
        Meteor.users.update({_id: Meteor.userId()}, { $push:
        {'profile.achievements': {title: achTitle, year:achYear}}
        });
      }
      else {
        alert("Year must be in digits from 0000-9999")
      }

    }else{
        alert("Please enter only alphabets");
    }
}
});

Template.addExp.helpers({
  currentUpload: function () {
    return Template.instance().currentUpload.get();
  }
});

Template.addExp.events({
  'submit form':function(event){
    event.preventDefault();
    var expCom = $('[name="expCom"]').val();
    var expPos = $('[name="expPos"]').val();
    var expYear = $('[name="expYear"]').val();
    var alphaExp = /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/;
    var currentYear=new Date().getFullYear();

    //validation for alphabets
    if(expCom.match(/^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/))
    {
      if(expPos.match(alphaExp) )
      {
        if(expYear.match(/^[0-9]{4}$/) && expYear<=currentYear){

          Meteor.users.update({_id: Meteor.userId()}, { $push:
          {'profile.experience': {company: expCom, position:expPos, year: expYear}}
          });
        }else{
          alert("Year must be in digits from 0000-"+ currentYear)
        }

      }
      else {
        alert("Please enter on alphabets. [position]")
      }

    }else{
        alert("This field must contains only alphabets and numbers.[company]");
    }
}
});

/*****THIS IS FOR GOOGLE MAP-LOCATION*****/



/*****THIS IS FOR searchbox*****
Template.findCourse.events({
    "keypress #search": function (e) {
      e.preventDefault();
      Session.set("searchValue", $("#inputSearch").val());
    }
  });

  Template.findCourse.helpers({
    messages: function() {
      Meteor.subscribe("search", Session.get("searchValue"));
      if (Session.get("searchValue")) {
        return Messages.find({}, { sort: [["score", "desc"]] });
      } else {
        return Messages.find({});
      }
    }
  });
*/
