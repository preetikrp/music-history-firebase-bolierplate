"use strict";

let $ = require('jquery'),
    db = require("./db-interaction"),
    templates = require("./dom-builder"),
 login = require("./user");


// Using the REST API
function loadSongsToDOM() {
    console.log("Need to load some songs, Buddy");
    let currentUser = login.getUser();
    db.getSongs(currentUser);
    db.getSongs()
        .then(function(songData) {
            console.log("got data", songData);




            //add the id to each song and then bild the song list
            //we need the id to be able to target each one
            //The object.keys() method returns and array of a
            //given object's own enumerable properties,  in the same
            //order as that provided by a for...in loop
            let idArray = Object.keys(songData);
            idArray.forEach(function(key) {
                songData[key].id = key;
            });
            console.log("song object with id", songData);
            templates.makeSongList(songData);
        });
}
loadSongsToDOM(); //<--Move to auth section after adding login btn


// Send newSong data to db then reload DOM with updated song data


      

// go get the song from database and then populate the form for editing.



//Save edited song to FB then reload DOM with updated song data

$(document).on("click", ".save_new_btn", function() {
    console.log("click save new song");
    let songObj = buildSongObj();
    db.addSong(songObj)
        .then(function(songID) {
            loadSongsToDOM();
        });
});

// go get the song from database and then populate the form for editing.
$(document).on("click", ".edit-btn", function() {
    console.log("click edit song");
    let songID = $(this).data("edit-id");
    db.getSong(songID)
        .then(function(song) {
            return templates.songForm(song, songID);
        }).then(function(finishedForm) {
            $(".uiContainer--wrapper").html(finishedForm);
        });
});
$(document).on("click", ".save_edit_btn", function() {
    let songObj = buildSongObj(),
        songID = $(this).attr("id");
    console.log("songID", songID);
    db.editSong(songObj, songID)
        .then(function(data) {
            loadSongsToDOM();

        });


});

// Remove song then reload the DOM w/out new song
$(document).on("click", ".delete-btn", function() {
    let songID = $(this).data("delete-id");
    db.deleteSong(songID)
        .then(() => {
            loadSongsToDOM();
        });


});


// Helper functions for forms stuff. Nothing related to Firebase
// Build a song obj from form data.
function buildSongObj() {
    let songObj = {
        title: $("#form--title").val(),
        artist: $("#form--artist").val(),
        album: $("#form--album").val(),
        year: $("#form--year").val(),
        uid: login.guestuser()
    };
    return songObj;
}

// Load the new song form
$("#add-song").click(function() {
    console.log("clicked add song");
    var songForm = templates.songForm()
        .then(function(songForm) {
            $(".uiContainer--wrapper").html(songForm);
        });
});
$("#auth-btn").click(function(){
  console.log("clicked on auth-btn");
  login.logInGoogle()
  .then(function(result){
    console.log("result from Login", result.user.uid);
    login.setUser(result.user.uid);
    loadSongsToDOM();

  });
});
$("#logout").click(function(){
    console.log("logout clicked");
    login.logOut();
});