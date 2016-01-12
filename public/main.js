var renderEvents = function(){
  $.ajax({
    url: '/events',
    type: 'get',
    dataType: 'json'
  }).done(function(events){
    console.log(events)
    events.forEach(function(event){
      $('#calendar').fullCalendar('renderEvent', event)
    })
  })
}


$(document).ready(function() {
  $('#calendar').fullCalendar({
  });
  renderEvents()
});

