'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputTemp = document.querySelector('.form__input--temp');
const inputClimb = document.querySelector('.form__input--climb');


let map, mapEvent;


if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
        function(position){
            const coords = [position.coords.latitude, position.coords.longitude];

            map = L.map('map').setView(coords, 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // обработка клика на карте
            map.on('click', function(event) {
                mapEvent = event;
                form.classList.remove('hidden');
                inputDistance.focus();
                /*
                const {lat, lng} = mapEvent.latlng;

                L.marker([lat, lng]).addTo(map)
                .bindPopup(L.popup({
                    maxWidth: 200,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    className: 'running-popup',
                }))
                .setPopupContent('Тренировка')
                .openPopup();
                */
            });    
        }, 
        function(){
            alert('Невозможно получить ваше местоположение')
        })
}

form.addEventListener('submit', function(event) {
    //очистка полей ввода данных
    inputDistance.value = inputDuration.value = inputTemp.value = inputClimb.value = '';


    //отображение маркера
    event.preventDefault();
    const {lat, lng} = mapEvent.latlng;

    L.marker([lat, lng]).addTo(map)
    .bindPopup(L.popup({
        maxWidth: 200,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: 'running-popup',
    }))
    .setPopupContent('Тренировка')
    .openPopup();
});

inputType.addEventListener('change', function() {
    inputClimb.closest('.form__row').classList.toggle('form__row--hidden');
    inputTemp.closest('.form__row').classList.toggle('form__row--hidden');

})