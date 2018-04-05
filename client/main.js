import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';


Router.route('/profile');
Router.route('/main');
Router.route('/classpage');
Router.route('/resultpage');
Router.route('/messaging');


Meteor.subscribe("chatRooms", {
  onReady: function () {
    scrollToBottom();
    autoScrollingIsActive = true;
  }
});

Meteor.subscribe('thePost');
Meteor.subscribe('theRequest');
Meteor.subscribe("users");



Resume = new Mongo.Collection('Resume');
postList = new Mongo.Collection('postList');
requestList=new Mongo.Collection('requestList');
Markers = new Mongo.Collection('markers');
dayTime = new Mongo.Collection('dayTime');
selectedSes=new Mongo.Collection ('selectedSes');
appointment = new Mongo.Collection('appointment');
transaction = new Mongo.Collection('transaction');
chatRooms = new Mongo.Collection('chatRooms');

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

isUser = new ReactiveVar(true);
autoScrollingIsActive = false;
thereAreUnreadMessages = new ReactiveVar(false);
scrollToBottom = function scrollToBottom (duration) {
  var messageWindow = $(".vcenter");
  var scrollHeight = messageWindow.prop("scrollHeight");
  messageWindow.stop().animate({scrollTop: scrollHeight}, duration || 0);
};

//Aidan's Part
Template.newClass.events({
  'submit #addForm':function(event){
  event.preventDefault();
  $("textarea").keydown(function(e) {
        if(e.keyCode === 9) { // tab was pressed
            // get caret position/selection
            var start = this.selectionStart;
            var end = this.selectionEnd;

            var $this = $(this);
            var value = $this.val();

            // set textarea value to: text before caret + tab + text after caret
            $this.val(value.substring(0, start)
                        + "\t"
                        + value.substring(end));

            // put caret at right position again (add one for the tab)
            this.selectionStart = this.selectionEnd = start + 1;

            // prevent the focus lose
            e.preventDefault();
        }
    });
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
    delete Session.keys['selectedRequest'];
    console.log(Session.get('selectedClass'));

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
    var classID=Session.get('selectedEdClass');
    var locationInfo=postList.findOne({"_id":classID}).location;
    locationInfo.forEach(function(element){
      console.log(element);
      Markers.insert({ownerClassID: classID,
                      id:element._id,
                      lat:element.lat,
                      lng:element.lng,
                      placeId:element.placeID,
                      name: element.name,
                      address: element.address});
    })
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

Template.post.onCreated(function(){
  $(document).ready(function(){
    $("#editClass").on('hidden.bs.modal', function () {
      var markerAr=Markers.find({ownerClassID:Session.get('selectedEdClass')}).fetch();

        markerAr.forEach(function(element){
          Markers.remove(element._id);
        })

    });
});
});

Template.request.onCreated(function(){
  $(document).ready(function(){
    $("#editRequest").on('hidden.bs.modal', function () {
      var markerAr=Markers.find({ownerClassID:Session.get('selectedEdRequest')}).fetch();

        markerAr.forEach(function(element){
          Markers.remove(element._id);
        })

    });
});
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
    var locationVarEdit = Markers.find({ownerClassID:Session.get('selectedEdClass')}).fetch();
    var descVarEdit = event.target.desc.value;
		var selectedEdClass = Session.get('selectedEdClass');
    console.log(selectedEdClass, titleVarEdit,imgSourceEdit,priceVarEdit,audienceVarEdit,dayTimeVarEdit,skillVarEdit,locationVarEdit, descVarEdit);
    if (selectedEdClass !="", titleVarEdit != "",imgSourceEdit != "",priceVarEdit!= "",audienceVarEdit!= "",dayTimeVarEdit!="",skillVarEdit != "",locationVarEdit!= "", descVarEdit!= "")
    {
      Meteor.call('editClassData', selectedEdClass,titleVarEdit,imgSourceEdit,priceVarEdit,audienceVarEdit,dayTimeVarEdit,skillVarEdit,locationVarEdit, descVarEdit)
    }
    $('#editClass').modal('hide');
    var markerAr=Markers.find({ownerClassID:Session.get('selectedEdClass')}).fetch();
      markerAr.forEach(function(element){
      Markers.remove(element._id);
    })

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
    if(Session.get('selectedClass')){
      var place= postList.findOne({"_id": Session.get('selectedClass')}).location;
      return place;
    }
    else if(Session.get('selectedRequest')){
      var place= requestList.findOne({"_id": Session.get('selectedRequest')}).location;
      return place;
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
  var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var labelIndex = 0;

    GoogleMaps.ready('dismap', function(map) {
        var markers=[];
        postList.find({'_id':Session.get('selectedClass')}, {fields:{location:1}}).observe({
        added: function(document) {
          var marker;
          var locationAr=postList.findOne({'_id':Session.get('selectedClass')}, {fields:{location:1}}).location// Create a marker for this document
          locationAr.forEach(function(element){

            marker = new google.maps.Marker({
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(element.lat, element.lng),
            map:map.instance,
            id: document._id,
            label: labels[labelIndex++ % labels.length],

            });
          })
          map.instance.panTo(marker.position);
          markers[document._id] = marker;
        },
      })
    })
});

Template.editMap.helpers({
  place: function() {
    return Markers.find({"ownerClassID":Session.get('selectedEdClass')}).fetch();
  },
});

Template.editMap.onRendered(function() {
  GoogleMaps.load({
    key: 'AIzaSyBpBCArAIOHtvLTmSTjjLzzViT9fm366FA',
    libraries: 'places'});

  this.autorun(function(c) {
    if (GoogleMaps.loaded()) {
      GoogleMaps.create({
        name: 'editmap',
        element: document.getElementById('editmap'),
        options: {
          center: new google.maps.LatLng(3.1390, 101.6869),
          zoom: 15
        }
      });
      c.stop();
    }
  });
});

Template.editMap.onCreated(function(){
  var self=this;
  var classID=Session.get('selectedEdClass');
  console.log(classID);
  var locationInfo=postList.findOne({"_id":classID}).location;

    GoogleMaps.ready('editmap', function(map) {

      var markers = [];
      var geocoder = new google.maps.Geocoder();
      var service = new google.maps.places.PlacesService(map.instance);
      var input = document.getElementById('map-input');
      var searchBox = new google.maps.places.SearchBox(input);
      //map.instance.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
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
                { ownerClassID:classID,
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                  placeID: place.place_id,
                  name:place.name,
                  address:place.formatted_address,
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
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                //if place already marked then cannot mark again
                if(Markers.find({'placeID':{$eq:placeID}}).count()>0){
                  console.log('Place already exists');
                }else{
                  classType=Session.get('setClassType');
               Markers.insert({ownerClassID: Session.get('selectedEdClass'),lat: event.latLng.lat(), lng: event.latLng.lng(), placeID: placeID, name:result.name, address: address, type:classType});
                  }
                }
              });
              }
            } else {
              console.log('Cannot determine address at this location.');
              }
          });// end of geocoder
        });//end of addListner
      Markers.find({"ownerClassID":classID}).observe({
         added: function(document) {
           var marker;
             marker = new google.maps.Marker({
             draggable: true,
             animation: google.maps.Animation.DROP,
             position: new google.maps.LatLng(document.lat, document.lng),
             map:map.instance,
             id: document._id,
             });

             map.instance.panTo(marker.position);
           google.maps.event.addListener(marker,'dblclick', function(event){
             Markers.remove(marker.id);
            });

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
       })
})
})

Template.editMap.events({
  'click #deleteLocation':function(){
      event.preventDefault();
      var placeID=this._id;
      Markers.remove(placeID);
  }
})

/*edit request map*/
Template.editREMap.helpers({
  place: function() {
    return Markers.find({"ownerClassID":Session.get('selectedEdRequest')}).fetch();
  },
});

Template.editREMap.onRendered(function() {
  GoogleMaps.load({
    key: 'AIzaSyBpBCArAIOHtvLTmSTjjLzzViT9fm366FA',
    libraries: 'places'});

  this.autorun(function(c) {
    if (GoogleMaps.loaded()) {
      GoogleMaps.create({
        name: 'editREmap',
        element: document.getElementById('editREmap'),
        options: {
          center: new google.maps.LatLng(3.1390, 101.6869),
          zoom: 15
        }
      });
      c.stop();
    }
  });
});

Template.editREMap.onCreated(function(){
  var self=this;
  var classID=Session.get('selectedEdRequest');
  console.log(classID);
  var locationInfo=requestList.findOne({"_id":classID}).location;

    GoogleMaps.ready('editREmap', function(map) {

      var markers = [];
      var geocoder = new google.maps.Geocoder();
      var service = new google.maps.places.PlacesService(map.instance);
      var input = document.getElementById('map-input');
      var searchBox = new google.maps.places.SearchBox(input);
      //map.instance.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
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
                { ownerClassID:Session.get('selectedEdRequest'),
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                  placeID: place.place_id,
                  name:place.name,
                  address:place.formatted_address,
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
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                //if place already marked then cannot mark again
                if(Markers.find({'placeID':{$eq:placeID}}).count()>0){
                  console.log('Place already exists');
                }else{
                  classType=Session.get('setClassType');
               Markers.insert({ownerClassID: Session.get('selectedEdRequest'),lat: event.latLng.lat(), lng: event.latLng.lng(), placeID: placeID, name:result.name, address: address, type:classType});
                  }
                }
              });
              }
            } else {
              console.log('Cannot determine address at this location.');
              }
          });// end of geocoder
        });//end of addListner
      Markers.find({"ownerClassID":Session.get('selectedEdRequest')}).observe({
         added: function(document) {
           var marker;
             marker = new google.maps.Marker({
             draggable: true,
             animation: google.maps.Animation.DROP,
             position: new google.maps.LatLng(document.lat, document.lng),
             map:map.instance,
             id: document._id,
             });

             map.instance.panTo(marker.position);
           google.maps.event.addListener(marker,'dblclick', function(event){
             Markers.remove(marker.id);
            });

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
       })
})
})

Template.editREMap.events({
  'click #deleteLocation':function(){
      event.preventDefault();
      var placeID=this._id;
      Markers.remove(placeID);
  }
});

Template.payment.onRendered(function() {
  Stripe.setPublishableKey('pk_test_y3Qb096sbp39phssCP308roZ');
  var handler = StripeCheckout.configure({
        key: 'pk_test_y3Qb096sbp39phssCP308roZ',
        token: function(token) {
      console.log(token);
    }
    });
})

Template.payment.events({
    'click button': function(e) {
        e.preventDefault();
        var user_ID=Meteor.userId();
        var createdTime = new Date();
        var app=appointment.findOne({classID:Session.get('selectBookClass'),skillSkr:user_ID});
        var amount=app.totalPrice*100;
        StripeCheckout.open({
            key: 'pk_test_y3Qb096sbp39phssCP308roZ',
            amount: amount,
            name: 'SIFU',
            currency:'MYR',
            description: 'Total amount : RM'+app.totalPrice,
            panelLabel: 'Pay Now',
            token: function(res) {
              var transID=res.id;
              var classID=app.classID;
              var paymentType=res.type;
              var cardBrand=res.card.brand;
              var cardType=res.card.funding;
              var userID=user_ID;
              var amount=app.totalPrice;
              var appointmentID=app._id;
              var paymentDate=createdTime;
              var cardExpMonth=res.card.exp_month;
              var cardExpYear=res.card.exp_year;
              var status="incoming"
              if(res.card.cvc_check=="pass"){
                Meteor.call('insertTrans',transID,classID,paymentType,cardBrand,
              cardType,userID,amount,appointmentID,paymentDate,cardExpMonth,cardExpYear,status);
              Meteor.call('updatePayStatus',app._id);
              }
                console.info(res);
            }
        });
        $('#progTab li:eq(4) a').tab('show');
        document.getElementById("pills-payment-tab").style.backgroundColor="#5bc0de";
        document.getElementById("pills-success-tab").style.backgroundColor="#5bc0de";
        document.getElementById("pills-success-tab").style.color="white";
        document.getElementById("pills-payment-tab").style.color="white";
        document.getElementById("pills-payment-tab").style['pointer-events']="none";

    }
});

Template.bookClass.events({
  'click #timeSelection':function(){
    var dateInput = document.getElementById("dateInput").value;
    var date=new Date(dateInput);
    var dayNum = date.getDay();
    var dayName;
    if(dayNum==1){
      dayName='Monday';
    }else if(dayNum==2){
      dayName='Tuesday';
    }else if(dayNum==3){
      dayName='Wednesday';
    }else if(dayNum==4){
      dayName='Thursday';
    }else if(dayNum==5){
      dayName='Friday';
    }else if(dayNum==6){
      dayName='Saturday';
    }else if(dayNum==0){
      dayName='Sunday';
    }
    Session.set('dayName',dayName);
    if(Session.get('selectedClass')){
      var smtg=postList.findOne({ '_id': { $eq: Session.get('selectBookClass')},'dayTimeVar.day': { $eq: dayName }}).dayTimeVar;
    }
    else if(Session.get('selectedRequest')){
      var smtg=requestList.findOne({ '_id': { $eq: Session.get('selectBookClass')},'dayTimeVar.day': { $eq: dayName }}).dayTimeVar;
    }

    Session.set('dateSel',smtg);

  },

  'click #addSes':function(){
    var userID=Meteor.userId();
    var dateInput = document.getElementById("dateInput").value;
    var timeInput = document.getElementById("timeSelection").value;

    if (dateInput != "" && timeInput != "" )
    {
      selectedSes.insert({date:dateInput,sestime:timeInput,userID:userID, classID:Session.get('selectBookClass'),status:"pending"});
    }else{
      console.log("Empty Values in Input Date & Time")
    }
    document.getElementById("dateInput").value = "";
    document.getElementById("timeSelection").value = "";
  },
  'click #deleteSes':function(){
    event.preventDefault();
    var sesID=this._id;
    selectedSes.remove(sesID);
  },
  'click #confirmBook':function(){
    event.preventDefault();
    var currentDate=new Date();
    var userID=Meteor.userId();
    var session = selectedSes.find( { 'classID':Session.get('selectBookClass') }).fetch();
    var sessionCount=selectedSes.find( { 'classID':Session.get('selectBookClass') }).count();
    var classID=Session.get('selectBookClass');
    var className=postList.findOne( { '_id':Session.get('selectBookClass') }).title;
    var skillPvd= postList.findOne( { '_id':Session.get('selectBookClass') }).createdBy;
    var skillSkr=userID;
    var totalPrice=Session.get('totalPayment');
    var isPaid="false";
    var status="processing";
    if (sessionCount >0 && classID != "" && skillPvd!="" && skillSkr!="" && totalPrice!="")
    {
      Meteor.call('insertApp',session,classID,skillPvd,totalPrice, status, className,isPaid,currentDate);

    }else{
      console.log("Please fill up all the fields")
    }

    var sesAr=selectedSes.find({classID:Session.get('selectBookClass')}).fetch();
    if(sesAr!="" ){
      sesAr.forEach(function(element){
        selectedSes.remove(element._id);
      })
    }
    $('#progTab li:eq(1) a').tab('show');
    document.getElementById("pills-app-tab").style.backgroundColor="#5bc0de";
    document.getElementById("pills-app-tab").style.color="white";
    document.getElementById("pills-booking-tab").style['pointer-events']="none";

  },
  'click #checkStatus':function(){
    event.preventDefault();
    $('#progTab li:eq(2) a').tab('show');
    document.getElementById("pills-status-tab").style.backgroundColor="#5bc0de";
    document.getElementById("pills-status-tab").style.color="white";
  },
  'click #proceedPay':function(){
    event.preventDefault();
    $('#progTab li:eq(3) a').tab('show');
    document.getElementById("pills-payment-tab").style.backgroundColor="#5bc0de";
    document.getElementById("pills-payment-tab").style.color="white";
  }

});

Template.bookClass.helpers({
  class:function(){
    if(Session.get('selectedClass')){
      return postList.findOne({'_id':Session.get('selectedClass')});
    }
    else if(Session.get('selectedRequest')){

      return requestList.findOne({'_id':Session.get('selectedRequest')});

    }
  },
  location:function(){
      if(Session.get('selectedClass')){
      var place= postList.findOne({"_id": Session.get('selectedClass')}).location;
      Session.set('selectBookClass',Session.get('selectedClass'));
      return place;
    }else if(Session.get('selectedRequest')){
    var place= requestList.findOne({"_id": Session.get('selectedRequest')}).location;
    Session.set('selectBookClass',Session.get('selectedRequest'));
    return place;
    }
  },
  timeAr:function(){
    if(Session.get('selectedClass')){
    var daytime= postList.findOne({"_id": Session.get('selectedClass')}).dayTimeVar;
    Session.set('selectBookClass',Session.get('selectedClass'));
    return daytime;
  }else if(Session.get('selectedRequest')){
  var daytime= postList.findOne({"_id": Session.get('selectedRequest')}).dayTimeVar;
  Session.set('selectBookClass',Session.get('selectedRequest'));
  return daytime;
    }
  },
  time:function(){
    var class1=Session.get('dateSel');
    var bTime=Session.get('bookedTime');
    var result=[];
    if(Session.get('bookedTime')){
      for (var k in class1){
        var timeObj=class1[k].timeFrom+'-'+class1[k].timeTo;
        bTime.forEach(function(ele){
          if(timeObj!=ele){
            var isInArray =result.includes(class1[k]);
            if(isInArray==false){
              result.push(class1[k]);
            }
          }
        })
      }
      return result;

    }else{
      if(Session.get('selectedClass')){
        return postList.findOne({'_id':Session.get('selectedClass')}).dayTimeVar;
      }
      else if(Session.get('selectedRequest')){

        return requestList.findOne({'_id':Session.get('selectedRequest')}).dayTimeVar;

      }
    }

  },
  selectedSes:function(){
    return selectedSes.find({classID:Session.get('selectBookClass')}).fetch();
  },
  sesCount:function(){
    return selectedSes.find({classID:Session.get('selectBookClass')}).count();
  },
  totalPayment:function(){
    var price=postList.findOne({_id:Session.get('selectBookClass')}).price;
    var quantity=selectedSes.find({classID:Session.get('selectBookClass')}).count();
    Session.set('totalPayment',price*quantity);
    return price*quantity;
  },
  appInfo:function(){
    return appointment.findOne({classID:Session.get('selectBookClass')});
  },
  statusMsg:function(){
    var status=appointment.findOne({classID:Session.get('selectBookClass')}).status;
    if(status=="pending"){
      return "Your booking is under processing. Please wait patiently."
    }else if(status=="rejected"){
      return "Sorry, your booking is being rejected."
    }
  },
  sesOfApp:function(){
    var userID=Meteor.userId();
    var status="false";
    var ses1=appointment.find({$and: [{classID:Session.get('selectBookClass')},{skillSkr:userID},{ispaid:"false"}]}).fetch();

    console.log(ses1);
    return ses1;
  },
  isApproved:function(){
    var userID=Meteor.userId();
    var ses2=appointment.findOne({classID:Session.get('selectBookClass'),skillSkr:userID,ispaid:"false"}).status;
    if(ses2=='approved'){
     return true;
   }else if(ses2=='processing'){
      return false;
    }
  },
  transID:function(){
    var userID=Meteor.userId();
    var classID=appointment.findOne({classID:Session.get('selectBookClass'),skillSkr:userID}).classID;
    return transaction.findOne({userID:userID,classID:classID,status:'incoming'});
  },



});

Template.bookClass.onRendered(function() {
  var place;
  var times=[];
  var disabledday=[1,2,3,4,5,6,0];
  var dayNum;
  if(Session.get('selectedClass')){
    place= postList.findOne({"_id": Session.get('selectedClass')}).dayTimeVar;
    Session.set('selBook',Session.get('selectedClass'));
  }else if(Session.get('selectedRequest')){
    place= requestList.findOne({"_id": Session.get('selectedRequest')}).dayTimeVar;
    Session.set('selBook',Session.get('selectedRequest'));
  }
  place.forEach(function(element){
    if(element.day=='Monday'){
      dayNum=1;
    }else if(element.day=='Tuesday'){
      dayNum=2;
    }else if(element.day=='Wednesday'){
      dayNum=3;
    }else if(element.day=='Thursday'){
      dayNum=4;
    }else if(element.day=='Friday'){
      dayNum=5;
    }else if(element.day=='Saturday'){
      dayNum=6;
    }else if(element.day=='Sunday'){
      dayNum=0;
    }
    var index = disabledday.indexOf(dayNum);
    times.push(dayNum);
    disabledday.splice(index, 1);
  })
  var matchApp=appointment.find({classID:Session.get('selBook')}).count();
  var matchDate=[];
  var matchTime=[];

  if(matchApp>0){
    var matchAppAr=appointment.find({classID:Session.get('selBook')}).fetch();
    matchAppAr.forEach(function(element){
      var session=element.session;
      for( var j in session){
        var time=session[j].sestime;
        var appDate=session[j].date;
        console.log(appDate);
        var date=new Date(appDate);
        var dayNum = date.getDay();
        var dayName;
        if(dayNum==1){
          dayName='Monday';
        }else if(dayNum==2){
          dayName='Tuesday';
        }else if(dayNum==3){
          dayName='Wednesday';
        }else if(dayNum==4){
          dayName='Thursday';
        }else if(dayNum==5){
          dayName='Friday';
        }else if(dayNum==6){
          dayName='Saturday';
        }else if(dayNum==0){
          dayName='Sunday';
        }
        if(Session.get('selectedClass')){
          var postAr=postList.findOne({_id:Session.get('selBook'),"dayTimeVar.day":dayName}).dayTimeVar;
        }
        else if(Session.get('selectedRequest')){
        var postAr=requestList.findOne({_id:Session.get('selectedRequest'),"dayTimeVar.day":dayName}).dayTimeVar;
        }

        for (var k in postAr){
          function checkDay(x) {
              return x.day==dayName;
          }
          function checkDT(x) {
              var postTime=x.timeFrom+'-'+x.timeTo;
              return postTime==time;
          }
          if(postAr[k].day==dayName)
          {
            var matchDateAr=postAr.filter(checkDay);
            var matchDTAr=matchDateAr.filter(checkDT);
            var disDate=[];
            var disTime=[];
            if(matchDateAr.length==matchDTAr.length){
              disDate.push(appDate);
            }else if(matchDateAr.length>matchDTAr.length){
            matchTime.push(time);
            Session.set('bookedTime',matchTime);
              }
          }
        }
      }
    })
  }

  this.$('#datetimepicker').datepicker({
   daysOfWeekHighlighted: times,
   daysOfWeekDisabled: disabledday,
   autoclose: true,
   format: 'mm-dd-yyyy',
   datesDisabled:matchDate


  });
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
    delete Session.keys['selectedClass'];
    var selectedRequest = Session.get('selectedRequest');
    console.log(selectedRequest);
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
    var classID=Session.get('selectedEdRequest');
    var locationInfo=requestList.findOne({"_id":classID}).location;
    locationInfo.forEach(function(element){
      console.log(element);
      Markers.insert({ownerClassID: classID,
                      id:element._id,
                      lat:element.lat,
                      lng:element.lng,
                      placeId:element.placeID,
                      name: element.name,
                      address: element.address});
    })
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
    var locationVarREdit = Markers.find({ownerClassID:Session.get('selectedEdRequest')}).fetch();
    var descVarREdit = event.target.desc.value;
		var selectedEdRequest = Session.get('selectedEdRequest');
    console.log(selectedEdRequest, titleVarREdit,imgSourceREdit,priceVarREdit,audienceVarREdit,dayTimeVarREdit,skillVarREdit,locationVarREdit, descVarREdit);
    if (selectedEdRequest !="", titleVarREdit != "",imgSourceREdit != "",priceVarREdit!= "",audienceVarREdit!= "",dayTimeVarREdit!="",skillVarREdit != "",locationVarREdit!= "", descVarREdit!= "")
    {
      Meteor.call('editRequestData', selectedEdRequest, titleVarREdit,imgSourceREdit,priceVarREdit,audienceVarREdit,dayTimeVarREdit,skillVarREdit,locationVarREdit, descVarREdit)
    }
    var dayTimeAr=dayTime.find().fetch();
    if(dayTimeAr!=""){

      dayTimeAr.forEach(function(element){
        dayTime.remove(element._id);
      })
    }
    var markerAr=Markers.find({ownerClassID:Session.get('selectedEdRequest')}).fetch();
    markerAr.forEach(function(element){
    Markers.remove(element._id);
    })
    $('#editRequest').modal('hide');


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
  'click button#deleteDayTimeREdit':function(event){
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
    }
    if(Session.get('selectedClass')){
      return postList.findOne({"_id": Session.get('selectedClass')});
    }
  }
});

Template.classpage.onRendered(function(){

});

Template.classpage.events({
  'click #bookBtn':function(){
    var userID=Meteor.userId();
    var ses1=appointment.find({$and: [{classID:Session.get('selectBookClass')},{skillSkr:userID},{status:'approved'}]}).count();
    if(ses1>0){
      var isPaid1=appointment.find({$and: [{classID:Session.get('selectBookClass')},{skillSkr:userID},{ispaid:"true"},{status:'approved'}]}).count();
      console.log(isPaid1);
        if(isPaid1>0){
          $('#progTab li:eq(4) a').tab('show');
          document.getElementById("pills-status-tab").style.backgroundColor="#5bc0de";
          document.getElementById("pills-status-tab").style.color="white";
          document.getElementById("pills-app-tab").style.backgroundColor="#5bc0de";
          document.getElementById("pills-app-tab").style.color="white";
          document.getElementById("pills-payment-tab").style.backgroundColor="#5bc0de";
          document.getElementById("pills-payment-tab").style.color="white";
          document.getElementById("pills-success-tab").style.backgroundColor="#5bc0de";
          document.getElementById("pills-success-tab").style.color="white";
          document.getElementById("pills-app-tab").style['pointer-events']="none";
          document.getElementById("pills-booking-tab").style['pointer-events']="none";
        }else{
        $('#progTab li:eq(2) a').tab('show');
        document.getElementById("pills-status-tab").style.backgroundColor="#5bc0de";
        document.getElementById("pills-status-tab").style.color="white";
        document.getElementById("pills-app-tab").style.backgroundColor="#5bc0de";
        document.getElementById("pills-app-tab").style.color="white";
        document.getElementById("pills-app-tab").style['pointer-events']="none";
        document.getElementById("pills-booking-tab").style['pointer-events']="none";
      }
    }else{
      $('#progTab li:eq(0) a').tab('show');
      document.getElementById("pills-status-tab").style.backgroundColor="#ededed";
      document.getElementById("pills-status-tab").style.color="#5bc0de";
      document.getElementById("pills-app-tab").style.backgroundColor="#ededed";
      document.getElementById("pills-app-tab").style.color="#5bc0de";
      document.getElementById("pills-booking-tab").style.backgroundColor="#ededed";
      document.getElementById("pills-booking-tab").style.color="white";
      document.getElementById("pills-app-tab").style['pointer-events']="none";

    }
    var selSes=selectedSes.find().fetch();
    if(selSes!="" ){
      selSes.forEach(function(element){
        selectedSes.remove(element._id);
      })
    }
  },

  'click #contactMeBtn': function(){
    var selectedUserID = this.createdBy;
    var selectedClassRequestID = this._id;
    if(this.type == "post")
    {
      var fileSource = postList.findOne({"_id":selectedClassRequestID}).fileSource;
      var title = postList.findOne({"_id":selectedClassRequestID}).title;
    }
    else if (this.type == "request"){
      var fileSource = requestList.findOne({"_id":selectedClassRequestID}).fileSource;
      var title = requestList.findOne({"_id":selectedClassRequestID}).title;
    }
    console.log(Session.get('selectedUserID'))
    var findChatRoom = chatRooms.findOne({usersIDsCRID:{$all:[selectedUserID,Meteor.userId(),selectedClassRequestID]}});
    console.log(findChatRoom);
    if (findChatRoom)
    {
      //room already exist and set room
      Session.set("roomID", findChatRoom._id);
      console.log(Session.get('roomID'));
    }

    else{
      //room does not exist and create new room
      var newChatID = chatRooms.insert({
        usersIDsCRID: [selectedUserID, Meteor.userId(),selectedClassRequestID],
        classRequestID: selectedClassRequestID,
        owner:Meteor.users.findOne({"_id":selectedUserID}).username,
        sender:Meteor.users.findOne({"_id":Meteor.userId()}).username,
        fileSource:fileSource,
        title:title,
        createdBy:Meteor.userId(),
        createdTime: new Date(),
        lastUser: "",
        lastText: "No Message Found",
        newMsg: " ",
        messages:[]
      });
      Session.set('roomID', newChatID)
    }

  }
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

Template.message.onRendered(function(){
  if(autoScrollingIsActive){
    scrollToBottom(250);
  }
  else{
    if (Meteor.user() && this.data.username !== Meteor.user().username) {

      thereAreUnreadMessages.set(true);
    }
  }
});

Template.message.onRendered(function(){
    var test = this.data.username;

    if (this.data.username == Meteor.user().username)
    {
      isUser.set(true);
      //console.log('true');
    }
    else{
      isUser.set(false);
      //console.log('false');
    }
});


Template.message.helpers({
  'isUser': function(){
    return isUser.get();
    console.log("works");
  }
});
/*
Template.chatWindow.helpers({
  'isUser': function(){
    var test = this;
    console.log(test);
    chatRooms.findOne({"_id":Session.get('roomID')}).messages.forEach(function(){
    var testArray = chatRooms.findOne({"_id":Session.get('roomID')}).messages;
    for (var i =0; i<testArray.length; i++){
      if(testArray[i].username == Meteor.user().username){
        console.log(testArray[i]);
        console.log("true");


      }
      else{
        console.log(testArray[i]);
        console.log("false");

        }
      }
    })
  }
});*/



Template.sideChatButtons.onRendered(function() {
  if (this.data.username != Meteor.user().username)
  {
    console.log('New Msg');
  }
  else{
    console.log('No new Msg');
  }
});

Template.chatBox.events({
  'click .tablinks':function(event){
    event.preventDefault();
    var selectedChat = this._id;
    Session.set('roomID', selectedChat);

    $('.tab button').removeClass("active");
    $(event.currentTarget).addClass("active");

    /*
    $('.tablinks').click(function() {
      console.log('works');
      $('.tab button').removeClass("active");
      $(this).addClass("active");
    });*/


    var senderUN = chatRooms.findOne({"_id": Session.get('roomID')}).sender;
    var ownerUN = chatRooms.findOne({"_id": Session.get('roomID')}).owner;
    if (senderUN == Meteor.users.findOne({"_id":Meteor.userId()}).username){
      senderUN = ownerUN;
      document.getElementById("senderPic").src = "https://www.svgimages.com/svg-image/s5/man-passportsize-silhouette-icon-256x256.png"
      document.getElementById("senderPic").style.display = "block";
      document.getElementById("senderName").innerHTML = senderUN;
      document.getElementById("chatUsername").innerHTML = senderUN;
    }
    else{
      document.getElementById("senderPic").src = "https://www.svgimages.com/svg-image/s5/man-passportsize-silhouette-icon-256x256.png"
      document.getElementById("senderPic").style.display = "block";
      document.getElementById("senderName").innerHTML = senderUN;
      document.getElementById("chatUsername").innerHTML = senderUN;
    }
  }
});

Template.chatBox.helpers({
  'sideChats': function(){
    var currentUserId = Meteor.userId();
    Session.set('selectedUserId',currentUserId);
    var selectedUserId = Session.get('selectedUserId');
    //var test = chatRooms.find({createdBy:Session.get('selectedUserId')},{sort: {createdAt:-1}});
    //console.log(test);
    //return test;
    return chatRooms.find({usersIDsCRID:currentUserId},{sort: {createdTime:-1}});

  }
  /*
  'isUser':function(){
    var currentUser = Meteor.users.findOne({"_id":Meteor.userId()}).username;
    console.log(currentUser);
    if (currentUser ==  chatRooms.findOne({"_id": Session.get('roomID')}).owner){
      return true;
    }else if (currentUser != chatRooms.findOne({"_id": Session.get('roomID')}).owner){
      return false;
    }
  },

  'senderName':function(){
    return senderUN = chatRooms.findOne({"_id": Session.get('roomID')});
  },*/



});

Template.chatWindow.events({
  'scroll .vcenter': function(){
    var howClose = 200;  // # pixels leeway to be considered "at Bottom"
    var messageWindow = $(".vcenter");
    var scrollHeight = messageWindow.prop("scrollHeight");
    var scrollBottom = messageWindow.prop("scrollTop") + messageWindow.height();
    var atBottom = scrollBottom > (scrollHeight - howClose);
    autoScrollingIsActive = atBottom ? true : false;
    if (atBottom) {        // <--new
        thereAreUnreadMessages.set(false);
      }

  },

  "click .more-messages": function () {
     scrollToBottom(500);
     thereAreUnreadMessages.set(false);
   }
});

Template.chatWindow.helpers({
  thereAreUnreadMessages: function(){
    return thereAreUnreadMessages.get();
  },

  'msgs':function(){
        var findChat = chatRooms.findOne({"_id": Session.get('roomID')}).messages;
        if(findChat){
          return findChat;
        }
        else{
          console.log("No chats to be found");
        }
    }

});

Template.inputMessage.events({
'keydown textarea#inputMsg': function(event){
  if(event.which==13){
    event.preventDefault();
    document.getElementById("sendMsg").click();
  }
},

'click button#sendMsg':function(event){
  event.preventDefault();
  if(Meteor.user())
  {
    var username = Meteor.user().username;
    var message = document.getElementById('inputMsg').value;

    if (message != "")
    {
      chatRooms.update({"_id":Session.get('roomID')},{
        $push:{
          messages:
          {
            username:username,
            text:message,
            createdAt: new Date(),
          }
        },
        $set:{
          createdTime: new Date()

        }
      });
      var findChat = chatRooms.findOne({"_id": Session.get('roomID')});
      var lastText = _.last(findChat.messages).text;
      var lastUser = _.last(findChat.messages).username;
      /*
      var newMsg= "none";
      if (lastUser != Meteor.user().username){
        console.log("New MSG!!!");
      }*/
      chatRooms.update({"_id":Session.get('roomID')},{
        $set:{
          lastUser: lastUser,
          lastText: lastText,
          createdTime: new Date()
        }
      });
      scrollToBottom(250);
      document.getElementById('inputMsg').value="";
    }
  }
    else
    {
      alert("Please login into your account to use the message page.");
    }
  }
});

Template.enrolledClass.helpers({
  'enrolled': function () {
    var currentUserId = Meteor.userId();
    var enrolled=appointment.find({$and:[{skillSkr:currentUserId},{status:"attended"},{ispaid:"true"}]},{sort: {createdTime:-1}}).fetch();
    var allEnroll=[];
    if(enrolled!=""){
      for (var j in enrolled){
        if(allEnroll.length<=0){
          allEnroll.push(postList.findOne({_id:enrolled[j].classID}));
        }else{
          for(var i in allEnroll){
            var a = allEnroll[i]._id;
            if(a==postList.findOne({_id:enrolled[j].classID})._id){
              console.log('Exist')
            }else{
                allEnroll.push(postList.findOne({_id:enrolled[j].classID}));
            }
          }
        }
      }
    }
    return allEnroll;
  }

});

 Template.enrolledClass.events({
   'click #moreDetails':function(){
     var classID = this._id;
     Session.set('selectedClass', classID);
     delete Session.keys['selectedRequest'];
   }
 });

 Template.newNotif.helpers({
   'postClassReq':function(){
     var currentUser= Meteor.userId();
     return appointment.find({$and:[{skillPvd:currentUser},{status:"processing"}]}).fetch();

   },
   'ispostCount':function(){
     if(appointment.find({$and:[{skillPvd:currentUser},{status:"processing"}]})>0){
       return true;
     }else{
       return false;
     }
   },
   'reqClassReq':function(){
     var currentUser= Meteor.userId();
     return appointment.find({$and:[{skillSkr:currentUser},{status:"processing"}]}).fetch();
   },
   'isreqCount':function(){
     if(appointment.find({$and:[{skillSkr:currentUser},{status:"processing"}]})>0){
       return true;
     }else{
       return false;
     }
   },

 });

 Template.newNotif.events({
   'click #acceptBtn':function(){
     event.preventDefault();
     var appID=this._id;
     Meteor.call('approvedAppStatus',appID);

   },
   'click #rejectBtn':function(){
     event.preventDefault();
     var appID=this._id;
     Meteor.call('rejectAppStatus',appID);
   }
 });
