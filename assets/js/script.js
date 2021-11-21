var returnDate;
var departDate;
var originSearch = document.getElementById('searchBtn');
var originCity = document.getElementById('city');
var departDate = document.getElementById('depart-date');
var destinationCity = document.getElementById('city-destination');
var flightOptions = document.getElementById('flight-options');
var expiryDate;
var departDateTime;
var returnDateTime;
var btnContainer = document.getElementById('button-container');
//declare variable for iataHistory to get local storage of saved inquiries and if not available, then create array
var iataHistory = JSON.parse(localStorage.getItem('iataHistory')) || [];
//declare array for sorting flight
var flightSortArray = [];





var saveHistory = function(origin){
    //check to see if city exists in array currently, if not, add to array
    if (iataHistory.indexOf(origin) === -1) {
        //add city to city history
        iataHistory.push(origin);
        //save array to locaL storage
        localStorage.setItem("iataHistory", JSON.stringify(iataHistory));
    }

}

var createElements = function (flightData) {
    //fetch city name from iata code
    fetch("https://cors-anywhere.herokuapp.com/https://airport-info.p.rapidapi.com/airport?iata="+flightData.iata, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "airport-info.p.rapidapi.com",
            "x-rapidapi-key": "44e449c370mshf4738c3a1b33643p1713bbjsnb7b879e3b526"
        }
    })
    .then(function(response) {
            if(response.ok) {
                response.json().then(function(data) {
                    //add location to the flightKey in each flight
                    flightData["city"] = data.location;
    
    //create card container
    var flightOptionCard = document.createElement('div');
    //add card container class
    flightOptionCard.classList.add('card', 'col-md', 'col-sm-12');
    //create card body
    var flightOptionCardBody = document.createElement('div');
    //add card body class
    flightOptionCardBody.classList.add('card-body');
    //create title
    var flightOptionCardTitle = document.createElement('h5')
    //add title class
    flightOptionCardTitle.classList.add('card-title');
    //set title = iata + location name
    flightOptionCardTitle.textContent = 'Flight to: '+ flightData.iata+ ' / '+ flightData.city;
    //create text card
    var flightOptionCardText = document.createElement('div');
    //add card text class
    flightOptionCardText.classList.add('card-text');
    //create ordered list for data
    var flightOptionCardOL = document.createElement('ul');
    //create temp li
    var flightOptionCardDepart = document.createElement('li');
    //assign departure li text
    departDateTime = new Date(flightData.departure_at);
    departDateTime.toString();
    flightOptionCardDepart.textContent = 'Departure = ' + departDateTime;
    //create return element
    var flightOptionReturn = document.createElement('li');
    //add content to return
    returnDateTime = new Date(flightData.return_at);
    returnDateTime.toString();
    flightOptionReturn.textContent = 'Return = ' + returnDateTime;
    //create list item for price
    var flightOptionPrice = document.createElement('li');
    flightOptionPrice.textContent = 'Price (USD) = $'+flightData.price;
    //create list item for expires
    var flightOptionExpires = document.createElement('li');
    expiryDate = new Date(flightData.expires_at);
    expiryDate.toString();
    flightOptionExpires.textContent = 'Expires on = '+ expiryDate;                        
            //add card body to card
            flightOptionCard.append(flightOptionCardBody);
            //add card title to card body
            flightOptionCardBody.append(flightOptionCardTitle);
            //add card text to body
            flightOptionCardBody.append(flightOptionCardText);
            //add ol to text container
            flightOptionCardText.append(flightOptionCardOL);
            //add list items to ol
            flightOptionCardOL.append(flightOptionCardDepart);
            flightOptionCardOL.append(flightOptionReturn);
            flightOptionCardOL.append(flightOptionPrice);
            flightOptionCardOL.append(flightOptionExpires);
            //append daily card to daily card container
            flightOptions.append(flightOptionCard);
        })}});
}


var getFlightPrices = function(origin,depart,destination) {
    //clear input
    flightOptions.innerHTML = '';
    console.log(depart);
    console.log(destination);
    var flightAPI;
    //if depart and destination are true - use this api call
    if (depart && destination) {
        console.log('both');
        //get variable for flighttracker api w/ date
        flightAPI = 'https://cors-anywhere.herokuapp.com/https://api.travelpayouts.com/v1/prices/cheap?currency=usd&origin='+origin+'&depart_date='+depart+'&destination='+destination+'&token=d6d40c4eb3a903fde45b4f150345dc6d';
    } 
    //if depart date is true but destination is false, then use this api call
    else if (depart && !destination) {
    console.log('date');
    flightAPI = 'https://cors-anywhere.herokuapp.com/https://api.travelpayouts.com/v1/prices/cheap?currency=usd&origin='+origin+'&depart_date='+depart+'&token=d6d40c4eb3a903fde45b4f150345dc6d';

    }
    //if destination is true but departure date is false, use this api call
    else if (destination && !depart) {
    console.log('destination');
    flightAPI = 'https://cors-anywhere.herokuapp.com/https://api.travelpayouts.com/v1/prices/cheap?currency=usd&origin='+origin+'&destination='+destination+'&token=d6d40c4eb3a903fde45b4f150345dc6d';

    }
    //if depart and destination are false, use this api call
    else {
    //get variable for flighttracker api
    flightAPI = 'https://cors-anywhere.herokuapp.com/https://api.travelpayouts.com/v1/prices/cheap?currency=usd&origin='+origin+'&token=d6d40c4eb3a903fde45b4f150345dc6d';

    }

    fetch(flightAPI).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {

    //if no results for this airport, show no results card
    if (!data.data[Object.keys(data.data)[0]]) {
        //create card container
        var flightOptionCard = document.createElement('div');
        //add card container class
        flightOptionCard.classList.add('card', 'col-md', 'col-sm-12');
        //create card body
        var flightOptionCardBody = document.createElement('div');
        //add card body class
        flightOptionCardBody.classList.add('card-body');
        //create title
        var flightOptionCardTitle = document.createElement('h5')
        //add title class
        flightOptionCardTitle.classList.add('card-title');
        //set title = city name
        flightOptionCardTitle.textContent = 'Oops! There have not been any results for this Airport recently.  Please try another one.';
        //add card body to card
        flightOptionCard.append(flightOptionCardBody);
        //add card title to card body
        flightOptionCardBody.append(flightOptionCardTitle);
        //append daily card to daily card container
        flightOptions.append(flightOptionCard);
    } else {

                /*//console log return response
                console.log(data);
                //console log all aiport objects
                console.log(data[Object.keys(data)[1]]);
                //console log first airport array
                console.log(data.data[Object.keys(data.data)[0]]);
                console.log(Object.keys(data.data)[0]);
                //console log first value from first airport array
                console.log(data.data[Object.keys(data.data)[0]][0]);
                //var flights = Object.values(data.data);
                //console.log(flights);*/
                console.log(data);

                //loop through all key value pairs in data.data object
                for (var key in data.data) {
                        //console log flight origin iata
                        //console.log(key);
                        //console log first flight from api response
                        //console.log(data.data[key]);
                        for (var flightKey in  data.data[key]) {
                            //assign iata code to current object
                            data.data[key][flightKey]["iata"] = key;
                            //push each value to the flightSortArray
                            flightSortArray.push(data.data[key][flightKey]);
                        }

                
            }
                //console.log(flightSortArray);
                //sort flights array by price key/value pair in ascending order
                flightSortArray.sort(function(a,b) {
                    return a.price - b.price;                
                });
                //console.log(flightSortArray);
                //for each element in the flightSortArray
                for (var i=0; i<flightSortArray.length; i++) {
                    //create elements for each flight
                    createElements(flightSortArray[i]);
                }
            }});
        } else {
            //if no response from server ask user to request demo env
            //clear flightOptions
            flightOptions.innerHTML = '';
            //create card container
            var flightOptionCard = document.createElement('div');
            //add card container class
            flightOptionCard.classList.add('card', 'col-md', 'col-sm-12');
            //create card body
            var flightOptionCardBody = document.createElement('div');
            //add card body class
            flightOptionCardBody.classList.add('card-body');
            //create title
            var flightOptionCardTitle = document.createElement('h5')
            //add title class
            flightOptionCardTitle.classList.add('card-title');
            //set title = city name
            flightOptionCardTitle.textContent = 'Please Click Request Demo Button above and then the accompanying button on the next page';
            //add card body to card
            flightOptionCard.append(flightOptionCardBody);
            //add card title to card body
            flightOptionCardBody.append(flightOptionCardTitle);
            //append daily card to daily card container
            flightOptions.append(flightOptionCard);
        }
    })
  
};

var inputBtnValue = function(event) {
        //prevent page refresh
        event.preventDefault();
    //get button iata value and run search for flight prices
    getFlightPrices(event.target.textContent);

}

var historyBtn = function() {
    //set button container to be empty
    btnContainer.innerHTML = '';
    //loop through localstorage of iata history length of array
    for (var i=0; i<iataHistory.length; i++) {
    //create button
     var recentSearch = document.createElement('button');
    recentSearch.classList.add('btn-secondary');
     //set button text to name of input value
     recentSearch.textContent = iataHistory[i];
     //listen for click of recent searches, and when done, run inputBtnValue function
     recentSearch.addEventListener('click', inputBtnValue);
     //add button underneath searchbox container
     btnContainer.append(recentSearch);
    }
     
}

var getFlightInput = function(event) {
    //prevent page refresh
    event.preventDefault();
    //declare depart variable for optionally passing
    var depart;
    //declare destination variable for optionally passing
    var destination;
    //if iata city code exists
    if (originCity && originCity.value) {
        //establish value as origin variable
        var origin = originCity.value;
        //if departure date has a value
        if (departDate.value) {
            //save departure value to depart
            depart = departDate.value;
            //remove day from date
            depart = depart.slice(0,7);
        }
        //if destination city has a value
        if (destinationCity.value) {
            //assign destination the value from the destination input
            destination=destinationCity.value
        } 
        //if origin is not a 3 letter code
        if (origin.length > 3) {
        //if user inputs a value greater than 3
        //clear flightOptions
        flightOptions.innerHTML = '';
        //create card container
        var flightOptionCard = document.createElement('div');
        //add card container class
        flightOptionCard.classList.add('card', 'col-md', 'col-sm-12');
        //create card body
        var flightOptionCardBody = document.createElement('div');
        //add card body class
        flightOptionCardBody.classList.add('card-body');
        //create title
        var flightOptionCardTitle = document.createElement('h5')
        //add title class
        flightOptionCardTitle.classList.add('card-title');
        //set title = city name
        flightOptionCardTitle.textContent = 'Please enter a valid IATA Code (Ex: JFK, LGA, SFO, RDU, etc.)';
        //add card body to card
        flightOptionCard.append(flightOptionCardBody);
        //add card title to card body
        flightOptionCardBody.append(flightOptionCardTitle);
        //append daily card to daily card container
        flightOptions.append(flightOptionCard);
        return;
        } /*else if (destination !== undefined) {
            if (destination.length > 3) {
                //if user inputs a value greater than 3
                //clear flightOptions
                flightOptions.innerHTML = '';
                //create card container
                var flightOptionCard = document.createElement('div');
                //add card container class
                flightOptionCard.classList.add('card', 'col-md', 'col-sm-12');
                //create card body
                var flightOptionCardBody = document.createElement('div');
                //add card body class
                flightOptionCardBody.classList.add('card-body');
                //create title
                var flightOptionCardTitle = document.createElement('h5')
                //add title class
                flightOptionCardTitle.classList.add('card-title');
                //set title = city name
                flightOptionCardTitle.textContent = 'Please enter a valid IATA Code (Ex: JFK, LGA, SFO, RDU, etc.)';
                //add card body to card
                flightOptionCard.append(flightOptionCardBody);
                //add card title to card body
                flightOptionCardBody.append(flightOptionCardTitle);
                //append daily card to daily card container
                flightOptions.append(flightOptionCard);
                return;
            }
        }*/
        //pass iata origin to getFlightPrices function
        getFlightPrices(origin,depart,destination);
        saveHistory(origin);
        historyBtn();
    } else {
        //if user doesnt input any values, ask them to put in an IATA code
        //clear flightOptions
        flightOptions.innerHTML = '';
        //create card container
        var flightOptionCard = document.createElement('div');
        //add card container class
        flightOptionCard.classList.add('card', 'col-md', 'col-sm-12');
        //create card body
        var flightOptionCardBody = document.createElement('div');
        //add card body class
        flightOptionCardBody.classList.add('card-body');
        //create title
        var flightOptionCardTitle = document.createElement('h5')
        //add title class
        flightOptionCardTitle.classList.add('card-title');
        //set title = city name
        flightOptionCardTitle.textContent = 'Please enter a valid IATA Code (Ex: JFK, LGA, SFO, RDU, etc.)';
        //add card body to card
        flightOptionCard.append(flightOptionCardBody);
        //add card title to card body
        flightOptionCardBody.append(flightOptionCardTitle);
        //append daily card to daily card container
        flightOptions.append(flightOptionCard);
    }

}

originSearch.addEventListener("click", getFlightInput);
//call history buttons to bring back recent searches from local storage
historyBtn();