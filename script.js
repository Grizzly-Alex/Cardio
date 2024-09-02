'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--temp');
const inputElevation = document.querySelector('.form__input--climb');



if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
        function(position){
            const {latitude} = position.coords.latitude;
            const {longitude} = position.coords.longitude;
            console.log(`https://www.google.com/maps/@${latitude},${longitude},7z`);
    
        }, 
        function(){
            alert('Невозможно получить ваше местоположение')
        })
}
