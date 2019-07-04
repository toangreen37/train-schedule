
// Global Variables
var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";

// jQuery global variables
var Train = $("#train-name");
var TrainDestination = $("#train-destination");
// form validation for Time using jQuery Mask plugin
var TrainTime = $("#train-time").mask("00:00");
var TimeFreq = $("#time-freq").mask("00");


// Initialize Firebase
let config = {
    apiKey: "AIzaSyBe2zrTLSGMzMbPUuv3SECVZ07IbpQO6d4",
    authDomain: "my-badass-project-69666.firebaseapp.com",
    databaseURL: "https://my-badass-project-69666.firebaseio.com",
    projectId: "my-badass-project-69666",
    storageBucket: "my-badass-project-69666.appspot.com",
    messagingSenderId: "582123534676",
    appId: "1:582123534676:web:46a2b43154d1dea0"
};

firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();

database.ref("/trains").on("child_added", function(snapshot) {

    //  create local variables to store the data from firebase
    let trainDiff = 0;
    let trainRemainder = 0;
    let minutesTillArrival = "";
    let nextTrainTime = "";
    let frequency = snapshot.val().frequency;

    // compute the difference in time from 'now' and the first train using UNIX timestamp, store in var and convert to minutes
    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

    // get the remainder of time by using 'moderator' with the frequency & time difference, store in var
    trainRemainder = trainDiff % frequency;

    // subtract the remainder from the frequency, store in var
    minutesTillArrival = frequency - trainRemainder;

    // add minutesTillArrival to now, to find next train & convert to standard time format
    nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");

    // append to our table of trains, inside tbody, with a new row of the train data
    $("#table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    $("span").hide();


});

// function to call the button event, and store the values in the input form
const storeInputs = function(event) {
    // prevent from from reseting
    event.preventDefault();

    // get & store input values
    trainName = Train.val().trim();
    trainDestination = TrainDestination.val().trim();
    trainTime = moment(TrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = TimeFreq.val().trim();

    // add to firebase databse
    database.ref("/trains").push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    //  alert that train was added
    alert("Train successuflly added!");

    //  empty form once submitted
    Train.val("");
    TrainDestination.val("");
    TrainTime.val("");
    TimeFreq.val("");
};

// Calls storeInputs function if submit button clicked
$("#btn-add").on("click", function(event) {
    // form validation - if empty - alert
    if (Train.val().length === 0 || TrainDestination.val().length === 0 || TrainTime.val().length === 0 || TimeFreq === 0) {
        alert("Please Fill All Required Fields");
    } else {
        // if form is filled out, run function
        storeInputs(event);
    }
});

// Calls storeInputs function if enter key is clicked
$('form').on("keypress", function(event) {
    if (event.which === 13) {
        // form validation - if empty - alert
        if (Train.val().length === 0 || TrainDestination.val().length === 0 || TrainTime.val().length === 0 || TimeFreq === 0) {
            alert("Please Fill All Required Fields");
        } else {
            // if form is filled out, run function
            storeInputs(event);
        }
    }
});