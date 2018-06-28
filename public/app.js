$(document).ready(function () {
    $("#scrape").on("click", function () {
        $.get("/scrape", function (data) {
            alert("Scraped 20 new Articles")
            for (var i = 0; i < data.length; i++) {
                $("#articles").append(`
                <div class= "card" id="artDiv">
                    <div class= "card-header">
                        <a id="artLink" href="${data[i].link}" target="_blank">
                             <h1 id="artTitle">${data[i].title}</h1>
                        </a> 
                    </div>
                    <div class="card-body">
                         <p>${data[i].summary}</p>  
                    </div>     
                </div>`
                )
            }
        })
    })
    // $("#home").on("click", function(){
    //     $.get("/",)
    // })
})
