var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    $("#form").hide();
    if (connected) {
        $("#conversation").show();
        $("#form").show();
        $("#send").show();
    }
    else {
        $("#conversation").hide();
        $("#form").hide();
        $("#send").hide();
    }
    $("#greetings").html("");
}

function connect() {
    var socket = new SockJS('/gs-guide-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/greetings', function (greeting) {
            showGreeting(JSON.parse(greeting.body).content);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send("/app/hello", {}, JSON.stringify({'name': $("#name").val(), 'content': $("#content").val()}));
}

function sendOut() {
    stompClient.send("/app/hello", {}, JSON.stringify({'name' : $("#name").val() , 'content' : "is out"}));

}
function showGreeting(message) {
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}

function outChat(message) {
    $("#greetings").append("<tr><td> + message + </td></tr>");
}
$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() {
        sendOut();
        disconnect(); });
    $( "#send" ).click(function() { sendName(); });
});