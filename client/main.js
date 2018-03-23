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
dayTime = new Mongo.Collection('dayTime');


Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});


//Aidan's Part
Template.newClass.events({
  'submit #addForm':function(event){
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
    var dayTimeVar = dayTime.find().fetch();
    var skillVar = event.target.selectSkill.value;
    var locationVar = Markers.find({type:{$eq:"post"}}).fetch();
    var descVar = event.target.desc.value;
    console.log(titleVar,imgSource,priceVar,audienceVar,dayTimeVar,skillVar,locationVar, descVar);
    if (titleVar != "",imgSource != "",priceVar!= "",audienceVar!= "",dayTimeVar!="", skillVar != "",locationVar!= "", descVar!= "")
    {
      Meteor.call('insertClassData', titleVar,imgSource,priceVar,audienceVar,dayTimeVar,skillVar, locationVar, descVar)
    }
    document.getElementById("addForm").reset();
    $('#addClass').modal('hide');


},
  'click #deleteAll':function(event){
    var markerAr=Markers.find({type:{$eq:"post"}}).fetch();
    var dayTimeAr=dayTime.find().fetch();
    if(markerAr!="" || dayTimeAr!=""){
      markerAr.forEach(function(element){
        Markers.remove(element._id);
      })
      dayTimeAr.forEach(function(element){
        dayTime.remove(element._id);
      })
    }
    var classtype="post";
    Session.set('setClassType', classtype);
    console.log(Session.get('setClassType'))
  },

  'click button#saveDayTime':function(event){
    event.preventDefault();
    var dayVar = document.getElementById("selDay").value;
    var timeFrom = document.getElementById("classTimeFrom").value;
    var timeTo = document.getElementById("classTimeTo").value;
    if (dayVar != "" && timeFrom != "" && timeTo !="")
    {
      console.log(dayVar, timeFrom, timeTo);
      Meteor.call('insertDayTime', dayVar, timeFrom, timeTo);
    }
    else
      {
        console.log("Empty Values in Input Day & Time")
      }
    document.getElementById("selDay").selectedIndex = 0;
    document.getElementById("classTimeFrom").value = "";
    document.getElementById("classTimeTo").value = "";
  },

  'click button#deleteDayTime':function(event){
    event.preventDefault();
    var dayTimeId=this._id;
    dayTime.remove(dayTimeId);
  }

});

Template.newClass.onRendered(function() {
  $('.selectpicker').selectpicker({
    size: 3
  });
  $('#addForm').validator();
});

Template.newClass.helpers({
  dtOption: function() {
    var dayTimeOption= dayTime.find().fetch();
    return dayTimeOption;
    //console.log( Session.get('location'));
    //return Session.get('location');
  }
});




Template.post.helpers({
  'postClasses': function () {
    var currentUserId = Meteor.userId();
    Session.set('selectedUserId',currentUserId);
    var selectedUserId = Session.get('selectedUserId');

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
    size: 4
  });
  $('#addRForm').validator();
});

Template.newRequest.events({
  'submit #addRForm':function(event){
  event.preventDefault();
  var titleVarR = event.target.Rtitle.value;
  var imgSourceR = event.target.RimageSource.value;
  var priceVarR = event.target.Rprice.value;
  var audienceVarR = event.target.RselectAudience.value;
  //var dayVarR = event.target.Rday.value;

  //var dayVarR = document.getElementById("selDay");

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
  var dayTimeVarR = dayTime.find().fetch();
  var skillVarR = event.target.RselectSkill.value;
  var locationVarR =Markers.find({type:{$eq:"request"}}).fetch();
  var descVarR = event.target.Rdesc.value;
  var requestID = this._id;
  console.log(titleVarR,imgSourceR,priceVarR,audienceVarR, dayTimeVarR, skillVarR, locationVarR, descVarR, requestID);
  if (titleVarR != "",imgSourceR != "",priceVarR!= "",audienceVarR!= "",dayTimeVarR!="", skillVarR != "",locationVarR!= "", descVarR!= "")
  {
  Meteor.call('insertRequestData', titleVarR,imgSourceR,priceVarR,audienceVarR,dayTimeVarR,skillVarR,locationVarR, descVarR)
  }
  document.getElementById("addRForm").reset();
  $('#addRClass').modal('hide');

},

  'click #deleteAll':function(event){
    var markerAr=Markers.find({type:{$eq:"request"}}).fetch();
    var dayTimeAr=dayTime.find().fetch();
    if(markerAr!="" || dayTimeAr!=""){
      markerAr.forEach(function(element){
        Markers.remove(element._id);
      })
      dayTimeAr.forEach(function(element){
        dayTime.remove(element._id);
      })
    }

    var classtype="request";
    Session.set('setClassType', classtype);
    console.log(Session.get('setClassType'))
  },

  'click button#saveDayTimeR':function(event){
    event.preventDefault();
    var dayVarR = document.getElementById("selRDay").value;
    var timeFromR = document.getElementById("requestTimeFrom").value;
    var timeToR = document.getElementById("requestTimeTo").value;
    if (dayVarR != "" && timeFromR != "" && timeToR !="")
    {
      console.log(dayVarR, timeFromR, timeToR);
      Meteor.call('insertDayTime', dayVarR, timeFromR, timeToR);
    }
    else
      {
        console.log("Empty Values in Input Day & Time")
      }
    document.getElementById("selRDay").selectedIndex = 0;
    document.getElementById("requestTimeFrom").value = "";
    document.getElementById("requestTimeTo").value = "";
  },

  'click button#deleteDayTimeRequest':function(event){
    event.preventDefault();
    var dayTimeId=this._id;
    dayTime.remove(dayTimeId);
  }

});

Template.newRequest.helpers({
  dtRequestOption: function() {
    var dayTimeRequestOption= dayTime.find().fetch();
    return dayTimeRequestOption;

  }
});

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
  'click #moreDetails': function(){
    var classID = this._id;
    Session.set('selectedClass', classID);
    console.log(Session.get('selectedClass'))

  },


	'click button#editClassBtn': function(){
		var classID = this._id;
		Session.set('selectedEdClass', classID);
		var selectedEdClass = Session.get('selectedEdClass');
		console.log(selectedEdClass);
    var dayTimeAr=dayTime.find().fetch();
    if(dayTimeAr!=""){
      dayTimeAr.forEach(function(element){
        dayTime.remove(element._id);
      })
    }
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
  'submit #editForm':function(){
    event.preventDefault();
		var titleVarEdit = event.target.title.value;
    var imgSourceEdit = event.target.imageSource.value;
    var priceVarEdit = event.target.price.value;
    var audienceVarEdit = event.target.selectAudience.value;
    var dayTimeVarEdit = dayTime.find().fetch();
    var skillVarEdit = event.target.selectSkill.value;
    var locationVarEdit = event.target.location.value;
    var descVarEdit = event.target.desc.value;
		var selectedEdClass = Session.get('selectedEdClass');
    console.log(selectedEdClass, titleVarEdit,imgSourceEdit,priceVarEdit,audienceVarEdit,dayTimeVarEdit,skillVarEdit,locationVarEdit, descVarEdit);
    if (selectedEdClass !="", titleVarEdit != "",imgSourceEdit != "",priceVarEdit!= "",audienceVarEdit!= "",dayTimeVarEdit!="",skillVarEdit != "",locationVarEdit!= "", descVarEdit!= "")
    {
      Meteor.call('editClassData', selectedEdClass,titleVarEdit,imgSourceEdit,priceVarEdit,audienceVarEdit,dayTimeVarEdit,skillVarEdit,locationVarEdit, descVarEdit)
    }

  },

  'click button#saveDayTimeEdit':function(event){
    event.preventDefault();
    var dayVarEdit = document.getElementById("selDayEdit").value;
    var timeFromEdit = document.getElementById("classTimeFromEdit").value;
    var timeToEdit = document.getElementById("classTimeToEdit").value;
    if (dayVarEdit != "" && timeFromEdit != "" && timeToEdit !="")
    {
      console.log(dayVarEdit, timeFromEdit, timeToEdit);
      Meteor.call('insertDayTime', dayVarEdit, timeFromEdit, timeToEdit);
    }
    else
      {
        console.log("Empty Values in Input Day & Time")
      }
    document.getElementById("selDayEdit").selectedIndex = 0;
    document.getElementById("classTimeFromEdit").value = "";
    document.getElementById("classTimeToEdit").value = "";
  },

  'click button#deleteDayTimeEdit':function(event){
    event.preventDefault();
    var dayTimeId=this._id;
    console.log(dayTimeId);
    postList.update(Session.get('selectedEdClass'),{
      $pull:
      {
        dayTimeVar:{"_id":dayTimeId}
      }
    })
  },

  'click button#deleteDayTimeNewEdit':function(event){
    event.preventDefault();
    var dayTimeId=this._id;
    console.log(dayTimeId);
    dayTime.remove(dayTimeId);
  }


});

Template.editForm.helpers({
  selEdClass: function(){
    return postList.findOne({"_id": Session.get('selectedEdClass')});
  },

  dtEditOption:function(){
    return postList.findOne({"_id":Session.get('selectedEdClass')}).dayTimeVar;

  },

  dtNewEditOption: function() {
    var dayTimeOption= dayTime.find().fetch();
    return dayTimeOption;
  }

});


Template.setMap.onCreated(function() {
  var self= this;
  console.log('haha');
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('exampleMap', function(map) {
      var markers = [];
      var geocoder = new google.maps.Geocoder();
      var service = new google.maps.places.PlacesService(map.instance);
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      map.instance.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      var classType;

      google.maps.event.addListener(map.instance,'bounds_change', function() {
          searchBox.setBounds(map.getBounds());
        });

      searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();
          if (places.length == 0) {
              return ;
            }
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
              if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
              }

              if(Markers.find({'placeID':{$eq:place.place_id}}).count()>0){
                console.log('Place already exists');
              }else{
                classType=Session.get('setClassType');
                Markers.insert(
                { lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                  placeID: place.place_id,
                  name:place.name, address:place.formatted_address,
                  type:classType,
                });
              }

            });

          });

          google.maps.event.addListener(map.instance, 'click', function(event){

              var latitude=event.latLng.lat();
              var longitude=event.latLng.lng();
              var latLng = {lat: latitude, lng: longitude};

            geocoder.geocode({'location': latLng}, function(results, status) {
                if (status==='OK') {
                  if( results[0]){
                    var address=results[0].formatted_address;
                    var placeID=results[0].place_id;
                  service.getDetails({placeId: placeID}, function(result, status) {
                  console.log(result);
                  if (status === google.maps.places.PlacesServiceStatus.OK) {
                    //if place already marked then cannot mark again
                    if(Markers.find({'placeID':{$eq:placeID}}).count()>0){
                      console.log('Place already exists');
                    }else{
                      classType=Session.get('setClassType');
                      Markers.insert({lat: event.latLng.lat(), lng: event.latLng.lng(), placeID: placeID, name:result.name, address: address, type:classType});
                      }
                    }
                  });
                  }
                } else {
                  console.log('Cannot determine address at this location.');
                  }
              });// end of geocoder
            });//end of addListner


      Markers.find({type:{$eq:"post"}}).observe({
      added: function(document) {
        // Create a marker for this document
          var marker = new google.maps.Marker({
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(document.lat, document.lng),

          // We store the document _id on the marker in order
          // to update the document within the 'dragend' event below.
          map:map.instance,
          id: document._id,
          classtype:"post"
          });
          map.instance.setZoom(17);
          map.instance.panTo(marker.position);

          google.maps.event.addListener(marker,'dblclick', function(event){
            console.log("hello");
            Markers.remove(marker.id);
           });

          // This listener lets us drag markers on the map and update their corresponding document.
          google.maps.event.addListener(marker, 'dragend', function(event) {
            var latitude=event.latLng.lat();
            var longitude=event.latLng.lng();
            var latLng = {lat: latitude, lng: longitude};

            geocoder.geocode({'location': latLng}, function(results, status) {
                if (status==='OK') {
                  if( results[0]){
                    var address=results[0].formatted_address;
                    var placeID=results[0].place_id;
                  service.getDetails({placeId: placeID}, function(result, status) {
                  console.log(result);
                  if (status === google.maps.places.PlacesServiceStatus.OK) {
                    //if place already marked then cannot mark again
                    if(Markers.find({'placeID':{$eq:placeID}}).count()>0){
                      console.log('Place already exists');
                    }else{
                  Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng(), placeID:placeID, name:result.name, address:address}});

                      }
                    }
                  });
                  }
                } else {
                  console.log('Cannot determine address at this location.');
                  }
              });// end of geocoder

          });
          // Store this marker instance within the markers object.
          markers[document._id] = marker;

           //testing

           marker.addListener('click', function() {
             var markerID=this.id;
             var thisMarker=Markers.findOne({'_id':{$eq:markerID}});
             console.log(thisMarker.address);
             var contentString='<div id="content" >'+
                     '<h2>'+thisMarker.name+'</h2>'+
                     '<div id="bodyContent" >'+
                     '<p>'+thisMarker.address+'</p>'+
                     '</div>'+
                     '</div>';

             var infowindow = new google.maps.InfoWindow({
               content:contentString,
               maxWidth: 250,
             });
             console.log(markerID);
               infowindow.open(map.instance, marker);
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




    });
});

Template.setMap.events({
  'click #deleteLocation':function(){
      event.preventDefault();
      var placeID=this._id;
      Markers.remove(placeID);
  }
});

Template.setMap.onRendered(function() {

  GoogleMaps.load({
    key: 'AIzaSyBpBCArAIOHtvLTmSTjjLzzViT9fm366FA',
    libraries: 'places'
  });
});

Template.setMap.helpers({
  classType: function(){
    return Session.get('setClassType');
  },
  isPostClass:function(){
    if(Session.get('setClassType')=="post"){
      return true;
    }
  },
  isrequestClass:function(){
    if(Session.get('setClassType')=="request"){
      return true;
    }
  },
  geolocationError:function(){
    var error = Geolocation.error();
    return error && error.message;
  },
  exampleMapOptions: function() {
    /*
    navigator.geolocation.watchPosition(function(position) {
      Session.set('location',{
        lat:position.coords.latitude,
        lon:position.coords.longitude
      });
      console.log('got current position');
    },function(err) {
      console.log(err);
      console.log(positionError.message)
    },{timeout:Infinity});
    */
  // navigator.geolocation.getCurrentPosition(success,error,);
    //var latLng=Geolocation.latLng();


    if (GoogleMaps.loaded()){

     return {
       center: new google.maps.LatLng(3.1390, 101.6869),
       zoom: 15

     };
   }

   },
   places: function() {
     var placeName=Markers.find({type:{$eq:Session.get("setClassType")}}).fetch();
     return placeName;
     //console.log( Session.get('location'));
     //return Session.get('location');
   },
});

Template.setRMap.onCreated(function() {
  var self= this;
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('map', function(map) {
      var markers = [];
      var geocoder = new google.maps.Geocoder();
      var service = new google.maps.places.PlacesService(map.instance);
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      map.instance.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
      var classType;

      google.maps.event.addListener(map.instance,'bounds_change', function() {
          searchBox.setBounds(map.getBounds());
        });

      searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();
          if (places.length == 0) {
              return ;
            }
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
              if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
              }

              if(Markers.find({'placeID':{$eq:place.place_id}}).count()>0){
                console.log('Place already exists');
              }else{
                classType=Session.get('setClassType');
                Markers.insert(
                { lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                  placeID: place.place_id,
                  name:place.name, address:place.formatted_address,
                  type:classType,
                });
              }
            });
          });

          google.maps.event.addListener(map.instance, 'click', function(event){
              var latitude=event.latLng.lat();
              var longitude=event.latLng.lng();
              var latLng = {lat: latitude, lng: longitude};
            geocoder.geocode({'location': latLng}, function(results, status) {
                if (status==='OK') {
                  if( results[0]){
                    var address=results[0].formatted_address;
                    var placeID=results[0].place_id;
                  service.getDetails({placeId: placeID}, function(result, status) {
                  console.log(result);
                  if (status === google.maps.places.PlacesServiceStatus.OK) {
                    //if place already marked then cannot mark again
                    if(Markers.find({'placeID':{$eq:placeID}}).count()>0){
                      console.log('Place already exists');
                    }else{
                      classType=Session.get('setClassType');
                   Markers.insert({lat: event.latLng.lat(), lng: event.latLng.lng(), placeID: placeID, name:result.name, address: address, type:classType});
                      }
                    }
                  });
                  }
                } else {
                  console.log('Cannot determine address at this location.');
                  }
              });// end of geocoder
            });//end of addListner

      Markers.find({type:{$eq:"request"}}).observe({
      added: function(document) {
        // Create a marker for this document
          var marker = new google.maps.Marker({
          draggable: true,
          animation: google.maps.Animation.DROP,
          position: new google.maps.LatLng(document.lat, document.lng),
          // We store the document _id on the marker in order
          // to update the document within the 'dragend' event below.
          map:map.instance,
          id: document._id,
          classtype:'request',
          });
            map.instance.panTo(marker.position);
            map.instance.setZoom(17);

            marker.setMap(map.instance);

          google.maps.event.addListener(marker,'dblclick', function(event){
            console.log("hello");
            Markers.remove(marker.id);
           });

          // This listener lets us drag markers on the map and update their corresponding document.
          google.maps.event.addListener(marker, 'dragend', function(event) {
            var latitude=event.latLng.lat();
            var longitude=event.latLng.lng();
            var latLng = {lat: latitude, lng: longitude};

            geocoder.geocode({'location': latLng}, function(results, status) {
                if (status==='OK') {
                  if( results[0]){
                    var address=results[0].formatted_address;
                    var placeID=results[0].place_id;
                  service.getDetails({placeId: placeID}, function(result, status) {
                  console.log(result);
                  if (status === google.maps.places.PlacesServiceStatus.OK) {
                    //if place already marked then cannot mark again
                    if(Markers.find({'placeID':{$eq:placeID}}).count()>0){
                      console.log('Place already exists');
                    }else{
                  Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng(), placeID:placeID, name:result.name, address:address}});

                      }
                    }
                  });
                  }
                } else {
                  console.log('Cannot determine address at this location.');
                  }
              });// end of geocoder

          });
          // Store this marker instance within the markers object.
          markers[document._id] = marker;

           //testing

           marker.addListener('click', function() {
             var markerID=this.id;
             var thisMarker=Markers.findOne({'_id':{$eq:markerID}});
             console.log(thisMarker.address);
             var contentString='<div id="content" >'+
                     '<h2>'+thisMarker.name+'</h2>'+
                     '<div id="bodyContent" >'+
                     '<p>'+thisMarker.address+'</p>'+
                     '</div>'+
                     '</div>';

             var infowindow = new google.maps.InfoWindow({
               content:contentString,
               maxWidth: 250,
             });
             console.log(markerID);
               infowindow.open(map.instance, marker);
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
  });
});

Template.setRMap.events({
  'click #deleteLocation':function(){
      event.preventDefault();
      var placeID=this._id;
      Markers.remove(placeID);
  }
});

Template.setRMap.onRendered(function() {
  GoogleMaps.load();

  this.autorun(function(c) {
    if (GoogleMaps.loaded()) {
      GoogleMaps.create({
        name: 'map',
        element: document.getElementById('map'),
        options: {
          center: new google.maps.LatLng(3.1390, 101.6869),
          zoom: 15
        }
      });
      c.stop();
    }
  });
});

Template.setRMap.helpers({
  classType: function(){
    return Session.get('setClassType');
  },
  geolocationError:function(){
    var error = Geolocation.error();
    return error && error.message;
  },
   places: function() {
     var placeName=Markers.find({type:{$eq:Session.get("setClassType")}}).fetch();
     return placeName;
     //console.log( Session.get('location'));
     //return Session.get('location');
   },
});

Template.displayMap.helpers({
  location:function(){
    if(Session.get('selectedRequest')){
        return requestList.findOne({"_id": Session.get('selectedRequest')});
    } else
    if(Session.get('selectedClass')){
      return postList.findOne({"_id": Session.get('selectedClass')});
    }
  }
});

Template.displayMap.onRendered(function() {
  GoogleMaps.load( {  key: 'AIzaSyBpBCArAIOHtvLTmSTjjLzzViT9fm366FA',
    libraries: 'places'});

  this.autorun(function(c) {
    if (GoogleMaps.loaded()) {
      GoogleMaps.create({
        name: 'dismap',
        element: document.getElementById('dismap'),
        options: {
          center: new google.maps.LatLng(3.1390, 101.6869),
          zoom: 15
        }
      });
      c.stop();
    }
  });
});

Template.displayMap.onCreated(function(){
  var self=this;
  console.log(Session.get('selectedClass'));
    GoogleMaps.ready('dismap', function(map) {
      function getMarker(places){
        for (var j in places)
        {
          for (var p in places[j]){
            for (var i=0; i<places[j][p].length; i++){
              var coords=places[j][p][i];
               var latlng=new google.maps.LatLng(coords);
               marker = new google.maps.Marker({
                  position: latlng,
                  map: map.instance,
              });
              map.instance.panTo(marker.position);
              map.instance.setZoom(15);
            }
          }
        }
      }

      if(Session.get('selectedRequest')){
              var places= requestList.find({"_id": Session.get('selectedRequest')},{fields: {"_id":0,"location.lat":1,"location.lng":1}}).fetch();
              getMarker(places);

            } else if(Session.get('selectedClass')){
              var places= postList.find({"_id": Session.get('selectedClass')},{fields: {"_id":0,"location.lat":1,"location.lng":1}}).fetch();
              getMarker(places);
          }
        })
});


Template.topnavbar2.events({
  'submit #search':function(event){
    event.preventDefault();
    var talentTitle = $('[name="searchCourse"]').val();
    Session.set('query',talentTitle)
    Router.go('/resultpage');

  }
});

Template.resultpage.events({
  'click #moreInfo': function(){
    var classID = this._id;
    Session.set('selectedClass', classID);

  },
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
   var dayTimeAr=dayTime.find().fetch();
    if(dayTimeAr!=""){
      dayTimeAr.forEach(function(element){
        dayTime.remove(element._id);
      })
    }
  }
});

Template.editRequestForm.helpers({
  selEdRequest: function(){
    return requestList.findOne({"_id": Session.get('selectedEdRequest')});
  },

  dtREditOption:function(){
  return requestList.findOne({"_id":Session.get('selectedEdRequest')}).dayTimeVar;

  },

  dtNewREditOption: function() {
    var dayTimeOption= dayTime.find().fetch();
    return dayTimeOption;
  }

});

Template.editRequestForm.events({
  'submit #editRForm':function(){
    event.preventDefault();
		var titleVarREdit = event.target.title.value;
    var imgSourceREdit = event.target.imageSource.value;
    var priceVarREdit = event.target.price.value;
    var audienceVarREdit = event.target.selectAudience.value;
    var dayTimeVarREdit = dayTime.find().fetch();
    var skillVarREdit = event.target.selectSkill.value;
    var locationVarREdit = event.target.location.value
    var descVarREdit = event.target.desc.value;
		var selectedEdRequest = Session.get('selectedEdRequest');
    console.log(selectedEdRequest, titleVarREdit,imgSourceREdit,priceVarREdit,audienceVarREdit,dayTimeVarREdit,skillVarREdit,locationVarREdit, descVarREdit);
    if (selectedEdRequest !="", titleVarREdit != "",imgSourceREdit != "",priceVarREdit!= "",audienceVarREdit!= "",dayTimeVarREdit!="",skillVarREdit != "",locationVarREdit!= "", descVarREdit!= "")
    {
      Meteor.call('editRequestData', selectedEdRequest, titleVarREdit,imgSourceREdit,priceVarREdit,audienceVarREdit,dayTimeVarREdit,skillVarREdit,locationVarREdit, descVarREdit)
    }
  


  },
  'click button#saveDayTimeREdit':function(event){
    event.preventDefault();
    var dayVarREdit = document.getElementById("selREditDay").value;
    var timeFromREdit = document.getElementById("requestTimeFromEdit").value;
    var timeToREdit = document.getElementById("requestTimeToEdit").value;
    if (dayVarREdit != "" && timeFromREdit != "" && timeToREdit !="")
    {
      console.log(dayVarREdit, timeFromREdit, timeToREdit);
      Meteor.call('insertDayTime', dayVarREdit, timeFromREdit, timeToREdit);
    }
    else
      {
        console.log("Empty Values in Input Day & Time")
      }
    document.getElementById("selREditDay").selectedIndex = 0;
    document.getElementById("requestTimeFromEdit").value = "";
    document.getElementById("requestTimeToEdit").value = "";
  },
  'click button#deleteDayTimeEdit':function(event){
    event.preventDefault();
    var dayTimeId=this._id;
    console.log(dayTimeId);
    requestList.update(Session.get('selectedEdRequest'),{
      $pull:
      {
        dayTimeVar:{"_id":dayTimeId}
      }
    })
  },

  'click button#deleteDayTimeNewREdit':function(event){
    event.preventDefault();
    var dayTimeId=this._id;
    console.log(dayTimeId);
    dayTime.remove(dayTimeId);
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
  },
  'selectedClass':function(){
  var classID = this._id;
  var selectedPost = Session.get('selectedClass');
  if (classID == selectedPost)
  {
    return "selected"
  }
},

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
