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
Markers = new Mongo.Collection('markers');


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
    //var dayVar = document.getElementById("selDay");


    //var timeVar = event.target.time.value;

    //Insert multiple select dropdown into array
    //var timeVar = document.getElementById("selTime");

    var skillVar = event.target.selectSkill.value;
    var locationVar = event.target.location.value
    var descVar = event.target.desc.value;
    console.log(titleVar,imgSource,priceVar,audienceVar,skillVar,locationVar, descVar);
    if (titleVar != "",imgSource != "",priceVar!= "",audienceVar!= "",skillVar != "",locationVar!= "", descVar!= "")
    {
      Meteor.call('insertClassData', titleVar,imgSource,priceVar,audienceVar,skillVar, locationVar, descVar)
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
    //var dayVarR = event.target.Rday.value;

    //var dayVar = document.getElementById("selDay");

    //Insert multiple select dropdown into array
    //var dayVarR = document.getElementById("selRDay");
    //var daysValR = new Array();
      //for (i = 0; i < dayVarR.length; i++) {
          //if (dayVarR .options[i].selected) daysValR.push(dayVarR.options[i].value);
      //}

    //var timeVarR = event.target.Rtime.value;

    //Insert multiple select dropdown into array
    //var timeVarR = document.getElementById("selRTime");
    //var timeArrayR = new Array();
      //for (i = 0; i < timeVarR.length; i++) {
          //if (timeVarR .options[i].selected) timeArrayR.push(timeVarR.options[i].value);
      //}
    var skillVarR = event.target.RselectSkill.value;
    var locationVarR = event.target.Rlocation.value
    var descVarR = event.target.Rdesc.value;
    console.log(titleVarR,imgSourceR,priceVarR,audienceVarR,skillVarR,locationVarR, descVarR);
    if (titleVarR != "",imgSourceR != "",priceVarR!= "",audienceVarR!= "",skillVarR != "",locationVarR!= "", descVarR!= "")
    {
    Meteor.call('insertRequestData', titleVarR,imgSourceR,priceVarR,audienceVarR,skillVarR,locationVarR, descVarR)
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
/*NEWW 10 March*/
Template.post.events({
  'click .postClasses': function(){
    var classID = this._id;
    Session.set('selectedClass', classID);
    var selectedClass = Session.get('selectedClass');
    console.log(selectedClass);
  },


	'click button#editClassBtn': function(){
		var classID = this._id;
		Session.set('selectedEdClass', classID);
		var selectedEdClass = Session.get('selectedEdClass');
		console.log(selectedEdClass);
	},

  'click #removeClassBtn': function(){
    var classId = this._id;
    Session.set('selectedRemoveClass', classId);
    var selectedRemoveClass = Session.get('selectedRemoveClass');
    console.log(selectedRemoveClass);
    var answer = confirm("Do you want to delete that class?")
    if (answer == true){
      Meteor.call('removeClass', selectedRemoveClass);
    }
    else{
      console.log("cancel");
    }
  }

});

Template.editForm.events({
  'submit form':function(){
    event.preventDefault();
		var titleVarEdit = event.target.title.value;
    var imgSourceEdit = event.target.imageSource.value;
    var priceVarEdit = event.target.price.value;
    var audienceVarEdit = event.target.selectAudience.value;
    var skillVarEdit = event.target.selectSkill.value;
    var locationVarEdit = event.target.location.value
    var descVarEdit = event.target.desc.value;
		var selectedEdClass = Session.get('selectedEdClass');
    console.log(selectedEdClass, titleVarEdit,imgSourceEdit,priceVarEdit,audienceVarEdit,skillVarEdit,locationVarEdit, descVarEdit);
    if (selectedEdClass !="", titleVarEdit != "",imgSourceEdit != "",priceVarEdit!= "",audienceVarEdit!= "",skillVarEdit != "",locationVarEdit!= "", descVarEdit!= "")
    {
      Meteor.call('editClassData', selectedEdClass,titleVarEdit,imgSourceEdit,priceVarEdit,audienceVarEdit,skillVarEdit,locationVarEdit, descVarEdit)
    }

}});

Template.editForm.helpers({
  selEdClass: function(){
    return postList.findOne({"_id": Session.get('selectedEdClass')});
  },

});


Template.setMap.onCreated(function() {
  var self= this;
  var infowindow;

    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('exampleMap', function(map) {
      var markers = [];
      google.maps.event.addListener(map.instance, 'click', function(event){
        var latitude=event.latLng.lat();
        var longitude=event.latLng.lng();
        Markers.insert({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        console.log("latitude:"+latitude)
       });





      Markers.find().observe({
      added: function(document) {
        // Create a marker for this document
          var marker = new google.maps.Marker({
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(document.lat, document.lng),
          map: map.instance,
          // We store the document _id on the marker in order
          // to update the document within the 'dragend' event below.
          id: document._id
          });

          // This listener lets us drag markers on the map and update their corresponding document.
          google.maps.event.addListener(marker, 'dragend', function(event) {

          Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
          });
          // Store this marker instance within the markers object.
          markers[document._id] = marker;

          google.maps.event.addListener(marker,'dblclick', function(event){
            console.log("hello");

            Markers.remove(marker.id);

           });

      },
      changed: function(newDocument, oldDocument) {
          markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
      },
      removed: function(oldDocument) {

          // Remove the marker from the map
          markers[oldDocument._id].setMap(null);
          // Clear the event listener
          google.maps.event.clearInstanceListeners(
          markers[oldDocument._id]);
          // Remove the reference to this marker instance
          delete markers[oldDocument._id];



      }



      });


      var input = document.getElementById('pac-input');

              var autocomplete = new google.maps.places.Autocomplete(input);
              autocomplete.bindTo('bounds', map);

              map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

              var infowindow = new google.maps.InfoWindow();
              var infowindowContent = document.getElementById('infowindow-content');
              infowindow.setContent(infowindowContent);
              var marker = new google.maps.Marker({
                map: map
              });
              marker.addListener('click', function() {
                infowindow.open(map, marker);
              });

              autocomplete.addListener('place_changed', function() {
                infowindow.close();
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                  return;
                }

                if (place.geometry.viewport) {
                  map.fitBounds(place.geometry.viewport);
                } else {
                  map.setCenter(place.geometry.location);
                  map.setZoom(17);
                }

                // Set the position of the marker using the place ID and location.
                marker.setPlace({
                  placeId: place.place_id,
                  location: place.geometry.location
                });
                marker.setVisible(true);

                infowindowContent.children['place-name'].textContent = place.name;
                infowindowContent.children['place-id'].textContent = place.place_id;
                infowindowContent.children['place-address'].textContent =
                    place.formatted_address;
                infowindow.open(map, marker);
              });




    });
});

Template.setMap.events({
    'click #deleteMarker':function(){
      event.preventDefault();

      Markers.remove({});

    }
});

Template.setMap.onRendered(function() {
  GoogleMaps.load({
    key: 'AIzaSyBpBCArAIOHtvLTmSTjjLzzViT9fm366FA',
    libraries: 'places'
  });
});

Template.setMap.helpers({
  geolocationError:function(){
    var error = Geolocation.error();
    return error && error.message;
  },
  exampleMapOptions: function() {
    var latLng=Geolocation.latLng();
         // Make sure the maps API has loaded
     if (GoogleMaps.loaded() && latLng) {
       // Map initialization options
       return {
         //center: new google.maps.LatLng(4.210484, 101.975766),
         center: new google.maps.LatLng(latLng.lat, latLng.lng),
         zoom: 15,

       };
     }
   }
});


Template.topnavbar2.events({
  'submit #search':function(event){
    event.preventDefault();
    var talentTitle = $('[name="searchCourse"]').val();
    Session.set('query',talentTitle)
    Router.go('/resultpage');

  }
});

/*END OF NEW*/
Template.request.events({
  'click #moreInfo': function(){
    var classID = this._id;
    Session.set('selectedRequest', classID);
    var selectedPlayer = Session.get('selectedRequest');
    console.log(selectedPlayer);
  },

	'click #removeRequestBtn': function(){
	 var classId = this._id;
	 Session.set('selectedRemoveRequest', classId);
	 var selectedRemoveRequest = Session.get('selectedRemoveRequest');
	 console.log(selectedRemoveRequest);
	 var answer = confirm("Do you want to delete that request?")
	 if (answer == true){
		 Meteor.call('removeRequest', selectedRemoveRequest);
	 }
	 else{
		 console.log("cancel");
	 }
 },

 'click button#editRequestBtn': function(){
   var classID = this._id;
   Session.set('selectedEdRequest', classID);
   var selectedEdRequest = Session.get('selectedEdRequest');
   console.log(selectedEdRequest);
 }
});

Template.editRequestForm.helpers({
  selEdRequest: function(){
    return requestList.findOne({"_id": Session.get('selectedEdRequest')});
  },

});

Template.editRequestForm.events({
  'submit form':function(){
    event.preventDefault();
		var titleVarREdit = event.target.title.value;
    var imgSourceREdit = event.target.imageSource.value;
    var priceVarREdit = event.target.price.value;
    var audienceVarREdit = event.target.selectAudience.value;
    var skillVarREdit = event.target.selectSkill.value;
    var locationVarREdit = event.target.location.value
    var descVarREdit = event.target.desc.value;
		var selectedEdRequest = Session.get('selectedEdRequest');
    console.log(selectedEdRequest, titleVarREdit,imgSourceREdit,priceVarREdit,audienceVarREdit,skillVarREdit,locationVarREdit, descVarREdit);
    if (selectedEdRequest !="", titleVarREdit != "",imgSourceREdit != "",priceVarREdit!= "",audienceVarREdit!= "",skillVarREdit != "",locationVarREdit!= "", descVarREdit!= "")
    {
      Meteor.call('editRequestData', selectedEdRequest, titleVarREdit,imgSourceREdit,priceVarREdit,audienceVarREdit,skillVarREdit,locationVarREdit, descVarREdit)
    }

}});

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

