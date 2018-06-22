$(document).ready(function () {
    $("#scrape").on("click", function () {
        $.get("/scrape", function (data) {
            alert("Scraped 20 new Articles")
            for (var i = 0; i < data.length; i++) {
                $("#articles").append(`<div id="artDiv"><a id="artLink" href="${data[i].link}" target="_blank"><h1 id="artTitle">${data[i].title}</h1></a></div>`)


            }
        })
    })
})
