$(document).ready(function() {
    var formEl= document.querySelector("#city-loc");
    var cityValEl = document.querySelector("#city-val");
    var modal = document.querySelector("#myModal");
    var modalBody = document.querySelector("#modalBod");
    var closeBtn = document.querySelector("#btn-close"); 
    
    var saveSearch = function(key) {
        // create a variable and name to store search inpu from user as json parsed array
        var searchHistory = (localStorage.searchHistory) ? JSON.parse(localStorage.searchHistory) : [];
        
        // on click push data from input to created array, and stringify the local storage array value
        document.querySelector("#submit-btn").addEventListener("click", () => {
            searchHistory.push(key);
            localStorage.searchHistory = JSON.stringify(searchHistory);
        });

        $("#cityData").innerHTML = " "
        // get local storage array value and add it to page as an option element included in the datalist for form.
        document.querySelector("#city-val").addEventListener("focus", () => {
            var data = document.querySelector("datalist#cityData");
            data.innerHTML = "";
            searchHistory.forEach((search) => {
                data.innerHTML = "<option>" + data.innerHTML;
                data.querySelector("option").innerText = search;
            });
        });
    }

    var getAp = function(event){
        //prevent refresh
        event.preventDefault();
        //city = cityname input box value
        var city = cityValEl.value

        //if city is true
        if(city) {
            //run getAirport of city value
            getAirport(city)
            // run function to save search value as drop down data list
            saveSearch(city)
            //clear input value
            cityValEl.value = ""
        }
        else {
            // clear the appended modal body div container of all child elements
            $("#modalBod").empty()
            // create a p element and fill it with warning text
            var modalText = document.createElement("p")
            modalText.textContent = "You need to input a city name to continue"

            // apppend element to page in modal body variable
            $(modalBody).append(modalText);

            // call function
            modalAlert();
        }
    }
   
    var getAirport= function(cityName) {
        var flightApi = "https://aviation-edge.com/v2/public/autocomplete?key=be6698-7715a2&city=" + cityName

        fetch(flightApi).then(function(response) {
            if(response.ok){
                response.json().then(function(data) {
                    console.log(data)
                    //once city passed in, pass airport object to displayAirports function
                    displayAirports(data);

                    if (data.success = false){  
                    }
                })
            } 
            else {
                var modalText = document.createElement("p")
                modalText.textContent = "server cant find relavent airport data!"
                $(modalBody).append(modalText);

                modalAlert();  
            }     
        });
    }

    var displayAirports = function(airports){
        //airportsArray = airports object
        var airportsArray = airports.airportsByCities
        //get iataCodes element
        var iataCon = document.querySelector("#iataCodes");
        // clear content of iata container div
        iataCon.innerHTML = ""

        //for the array of airport info returned
        for ( let i = 0; i < airportsArray.length; i++ ) {
            //get airport information dependent on the index in the array
            var airportCodes = airportsArray[i].codeIataAirport
            var airportNames = airportsArray[i].nameAirport
            var airportCountry = airportsArray[i].nameCountry
            var airportCountCode = airportsArray[i].codeIso2Country
            var airportPhone = airportsArray[i].phone
            //if airport codes exist
            if(airportCodes) {
                console.log("success")
            }
            else {
                // modal alert to let user know no information is recieved from server.
                var modalText = document.createElement("p")
                modalText.textContent = "There is no airport data for this location"
                $(modalBody).append(modalText);

                modalAlert();
            }

            // create div elements for card, card title, card body, and card text with labels from each picked information variable.
            var codeEl = document.createElement("div")
            codeEl.classList = "card";

            var cardTitle = document.createElement("h3")
            cardTitle.textContent = airportCodes;
            cardTitle.classList = "card-title iata-info"

            var cardBody = document.createElement("div")
            cardBody.classList = "card-body"

            var airNames = document.createElement("h3")
            airNames.textContent = ("Airport Name:   " + airportNames)
            airNames.classList = "card-title"

            var airCountry = document.createElement("p")
            airCountry.textContent = ("Airport Country:  " + airportCountry + "," + airportCountCode)
            airCountry.classList = "card-text"

            // append all card text divs to card body
            $(cardBody).append(airNames);
            $(cardBody).append(airCountry);
            // if airport phone data exists create a card text element with phone number info and append to page, then color card body green for Sucess!!!
            if( airportPhone !== "" ){
                cardBody.classList = "card-body bg-success text-white";

                var airPhone = document.createElement("p")
                airPhone.textContent = ("Airport Phone #:  " + airportPhone )
                airPhone.classList = "card-text"

                $(cardBody).append(airPhone);
            }

            // append card-title, and card-body divs to card div on page
            $(codeEl).append(cardTitle);
            $(codeEl).append(cardBody);

            // append card element to div container for cards with iata name
            $(iataCon).append(codeEl);
        }

    }

    // function to display modal alerts after each else conditional statement is triggered
    var modalAlert = function(){   
        // changes modal container on main index page to display default hidden content 
        modal.style.display = "block";
        
        // on button click changed display back to hidden
        closeBtn.onclick = function(){
            modal.style.display = "none"
        };
    }

    // on click submit run function getAp
    formEl.addEventListener("submit", getAp);
});