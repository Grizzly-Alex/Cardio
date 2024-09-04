'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputTemp = document.querySelector('.form__input--temp');
const inputClimb = document.querySelector('.form__input--climb');

class Workout {
    constructor(distance, duration, coords){
        this.id = (new Date() + '').slice(-10);
        this.date = new Date();
        this.distance = distance;
        this.duration = duration;
        this.coords = coords;
    }
}

class Running extends Workout{
    constructor(distance, duration, coords, temp){
        super(this.distance, this.duration, this.coords);
        this.temp = temp;
    }
}

class Cycling extends Workout{
    constructor(distance, duration, coords, climb){
        super(this.distance, this.duration, this.coords);
        this.climb = climb;
    }
}



class App {

    #map;
    #mapEvent;

    constructor(){
        this._getPosition();
        form.addEventListener('submit', this._newWorkout.bind(this));       
        inputType.addEventListener('change', this._toggleClimbField);
    }

    _getPosition() {
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                this._loadMap.bind(this),
                function(){
                    alert('Невозможно получить ваше местоположение')
                })
        }
    }

    _loadMap(position) {                
        const coords = [position.coords.latitude, position.coords.longitude];

        this.#map = L.map('map').setView(coords, 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

        }).addTo(this.#map);

        // обработка клика на карте
        this.#map.on('click', this._showForm.bind(this));    
    }

    _showForm(event) {
        this.#mapEvent = event;
            form.classList.remove('hidden');
            inputDistance.focus();
    }

    _toggleClimbField() {
        inputClimb.closest('.form__row').classList.toggle('form__row--hidden');
        inputTemp.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(event) {
        event.preventDefault();
            
        //очистка полей ввода данных
        inputDistance.value = inputDuration.value = inputTemp.value = inputClimb.value = '';
            
        //отображение маркера
        const {lat, lng} = this.#mapEvent.latlng;
    
        L.marker([lat, lng]).addTo(this.#map)
        .bindPopup(L.popup({
            maxWidth: 200,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: 'running-popup',
        }))
        .setPopupContent('Тренировка')
        .openPopup();}
}

const app = new App();

