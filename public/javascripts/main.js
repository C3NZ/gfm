//shout out to this thread for the help:  https://stackoverflow.com/questions/6677035/jquery-scroll-to-element
$('#lb').click(function() {
    $('html,body').animate({
        scrollTop: $('#learn-more').offset().top
    }, 1500)
})
