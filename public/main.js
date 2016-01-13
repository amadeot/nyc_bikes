var submitRSVP = function(event){
  var $form = $('.active .rsvp-form');
  var allFields = $form.form('get values');
  if(allFields.name !== "" && allFields.email !== ""){
    $.ajax({
      url: '/events/'+allFields.eventId+'/rsvps',
      type: 'POST',
      dataType: 'json',
      data: {rsvp: allFields}
    }).always(function(){
      var oldSpots = $('.active .spots-left').text();
      var newSpots = parseInt(oldSpots) - 1;
      $('.active .spots-left').text(newSpots);
      $form.form('clear');
    })    
  } else {
    alert("YOU NEED BOTH NAME AND EMAIL")
  }

}

var submitComment = function(event){
  var $form = $('.active .comment-form');
  var allFields = $form.form('get values');
  $.ajax({
    url: '/events/'+allFields.eventId+'/comments',
    type: 'POST',
    dataType: 'json',
    data: {submittedComment: allFields}
  }).always(function(){
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source)
    var html = template(allFields);
    $('.comments').append(html);
    $form.form('clear');
  })
}

var showModal = function(calEvent){
  $.ajax({
    url: '/events/'+calEvent._id,
    type: 'get',
    dataType: 'json'
  }).done(function(clickedEvent){
    clickedEvent.spots_left = parseInt(clickedEvent.max_attendees)-clickedEvent.rsvps.length;
    var source = $('#event-modal').html();
    var template = Handlebars.compile(source);
    var html = template(clickedEvent);
    $('body').append(html);
    $(html).modal({
      onVisible: function(){
        $('.rsvp-submit').click(submitRSVP);
        $('.comment-submit').click(submitComment);
      },
      onHidden: function(){
        $('.ui.modal').remove();
      }
    }).modal('show');
  });
};

var renderEvents = function(){
  $.ajax({
    url: '/events',
    type: 'get',
    dataType: 'json'
  }).done(function(events){
    events.forEach(function(event){
      $('#calendar').fullCalendar('renderEvent', event);
    })
  })
};


$(document).ready(function() {
  $('#calendar').fullCalendar({
    eventClick: function(calEvent, jsEvent, view){
      showModal(calEvent)
    }
  });
  renderEvents();
});

