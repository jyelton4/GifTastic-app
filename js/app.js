//
//  project by jacobyelton - 06292018
//
// GifTastic App object
var gifTastic = {
    topics: [
        "Jay Z", 
        "Kanye", 
        "Chance the Rapper", 
        "Notorious BIG", 
        "Tupac", 
        "Gucci Mane", 
        "50 Cent", 
        "Nelly", 
        "Drake", 
        "Rick Ross"
    ], 
    queryParams: {
        api_key: "Bl6riyjArSm7UwHATde1Cta9Zr7fyHcb", 
        limit: 10
    }, 
    gifService: {
        url: "https://api.giphy.com/v1/gifs/search", 
        method: "GET"
    }, 
    // attach query params from topics button id cicked by user 
    attachQueryParams: function (btnId) {
        this.queryParams.q = btnId;
        this.gifService.url = this.gifService.url + "?" + $.param(this.queryParams);
    }, 
    // make initial call to GIPHY api using topics array as q parameters 
    initialApiCall: function () {
        $.ajax(this.gifService).then(function (response) {
            gifTastic.renderGIFHandler(response);
        })
    }, 
    // loop through topics array and append HTML buttons to div id = initial-btns 
    initialButtonsHTML: function () {
        this.topics.forEach(function (item) {
            $("#btns-box").append($("<button>").addClass("btn btn-info gif-btns").text(item).attr("id",item.toLowerCase()));
        });
    },  
    // replace topics buttons with static GIFs from user click selection 
    renderGIFHandler: function (response) {
        this.checkAddReplaceRadioButtons();
        var data = response.data;
        this.renderGIFs(data);
    }, 
    // method to render GIFs
    renderGIFs: function (data) {
        data.forEach(function (item) {
            $("#gifs-box").prepend($("<div>").addClass("gif-divs").attr("id", item.id));
            $("#" + item.id).append($("<img>").addClass("static-gifs").attr("id",item.slug)
            .attr("src",item.images.fixed_height_still.url)
            .attr("data-still", item.images.fixed_height_still.url)
            .attr("data-animate", item.images.fixed_height.url)
            .attr("data-state", "still"));
            gifTastic.ratingHTML(item);
        })
    }, 
    // append new topic submission from user to btns-box div 
    newTopicsHTML: function (topic) {
        this.topics.push(topic);
        $("#btns-box").empty();
        this.initialButtonsHTML();
        // $("#btns-box").append($("<button>").addClass("btn btn-info gif-btns").text(topic).attr("id",topic.toLowerCase()));
    }, 
    // attach rating HTML to static GIF 
    ratingHTML: function (item) {
        $("#" + item.id).append($("<p>").text("Rating: " + item.rating));
    }, 
    // animate GIF 
    animateGIF: function (gif) {
        var state = $(gif).attr("data-state");
        if (state === "still") {
            $(gif).attr("src", $(gif).attr("data-animate"));
            $(gif).attr("data-state", "animate");
        } else if (state === "animate") {
            $(gif).attr("src", $(gif).attr("data-still"));
            $(gif).attr("data-state", "still");
        }
    }, 
    // check add/replace radio buttons 
    checkAddReplaceRadioButtons: function () {
        if ($("#replace-gifs").is(":checked")) {
            $("#gifs-box").empty();
        }
    }
}
// Bugs to fix: 
// Can submit an empty tag button
//
// Executables below 
//
// Dynamically generate HTML buttons at page load from initial topics array 
gifTastic.initialButtonsHTML();
//
// click event to handle user submissions of new topics 
$(document).ready(function () {

    $("#submit-btn").on("click", function () {
        event.preventDefault();
        gifTastic.newTopicsHTML($("#topic-input").val());
        $("#topic-input").val("");
        })

});
//
// click event to handle user selection of topic buttons 
$(document).on("click", ".gif-btns", function () {

    gifTastic.attachQueryParams(this.id);
    gifTastic.initialApiCall();

});
//
// click event to de/animate GIF on user click 
$(document).on("click", ".static-gifs", function () {

    gifTastic.animateGIF(this);

});