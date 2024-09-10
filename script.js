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
        this.id = (Date.now() + '').slice(-10);
        this.date = new Date();
        this.distance = distance;
        this.duration = duration;
        this.coords = coords;
    }

    _setDescription() {
        const formatedDate = new Intl.DateTimeFormat('ru-RU').format(this.date);
        this.type === 'running' ? this.description = `Пробежка ${formatedDate}` : this.description = `Велотренировка ${formatedDate}`;       
    }
}

class Running extends Workout{
    type = 'running';

    constructor(distance, duration, coords, temp){
        super(distance, duration, coords);
        this.temp = temp;
        this.calculatePace();
        this._setDescription();
    }

    calculatePace() {
        this.pace = this.duration / this.distance; 
    }
}

class Cycling extends Workout{
    type = 'cycling';

    constructor(distance, duration, coords, climb){
        super(distance, duration, coords);
        this.climb = climb;
        this.calculateSpeed();
        this._setDescription();
    }

    calculateSpeed() {
        this.speed = this.distance / this.duration / 60; 
    }
}

class App {

    #map;
    #mapEvent;
    #workouts = [];

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

    _hideForm() {
        inputDistance.value = inputDuration.value = inputTemp.value = inputClimb.value = '';
        form.classList.add('hidden');
    }

    _toggleClimbField() {
        inputClimb.closest('.form__row').classList.toggle('form__row--hidden');
        inputTemp.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(event) {
        const areNumbers = (...numbers) => numbers.every(i => Number.isFinite(i));
        const areNumbersPositive = (...numbers) => numbers.every(i => i > 0);

        event.preventDefault();

        const {lat, lng} = this.#mapEvent.latlng;

        //получить данные из формы
        const type = inputType.value;
        const distance = Number(inputDistance.value);
        const duration = Number(inputDuration.value);

        //если тренировка является пробежкой, создать Running
        let workout;

        if(type === 'running'){
            const temp = Number(inputTemp.value);
            if(!areNumbers(distance, duration, temp) || !areNumbersPositive(distance, duration, temp))
                return alert('Введите положительное число!');

            workout = new Running(distance, duration, [lat, lng], temp);
        }

        //если тренировка является велотренировкой, создать Cycling
        if(type === 'cycling'){
            const climb = Number(inputClimb.value);
            if(!areNumbers(distance, duration, climb) || !areNumbersPositive(distance, duration))
                return alert('Введите положительное число!');

            workout = new Cycling(distance, duration, [lat, lng], climb);
        }
    
        //добавить новый объект в массив тренировок
        this.#workouts.push(workout);
        console.log(this.#workouts);

        //отобразить тренировку на карте

        this._displyWorkout(workout);

        //отобразить тренировку в списке

        this._displayWorkoutOnSidebar(workout);
            
        //спрятать форму и очистка полей ввода данных
        this._hideForm();
    }

    _displyWorkout(workout){
        L.marker(workout.coords).addTo(this.#map)
        .bindPopup(L.popup({
            maxWidth: 200,
            minWidth: 100,
            autoClose: false,
            closeOnClick: false,
            className: `${workout.type}-popup`,
        }))
        .setPopupContent(`${workout.type === 'running' ? '🏃' : '🚵‍♂️'} ${workout.description}`)
        .openPopup();
    }

    _displayWorkoutOnSidebar(workout){
        let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
            <h2 class="workout__title">${workout.description}</h2>
            <div class="workout__details">
                <span class="workout__icon">${workout.type === 'running' ? '🏃' : '🚵‍♂️'}</span>
                <span class="workout__value">${workout.distance}</span>
                <span class="workout__unit">км</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">⏱</span>
                <span class="workout__value">${workout.duration}</span>
                <span class="workout__unit">мин</span>
            </div>
        `

        if(workout.type === 'running'){
            html += `
                <div class="workout__details">
                    <span class="workout__icon">📏⏱</span>
                    <span class="workout__value">${workout.pace.toFixed(2)}</span>
                    <span class="workout__unit">мин/км</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">👟⏱</span>
                    <span class="workout__value">${workout.temp}</span>
                    <span class="workout__unit">шаг/мин</span>
                </div>
            </li>`
        }

        if(workout.type === 'cycling'){
            html += `
                <div class="workout__details">
                    <span class="workout__icon">📏⏱</span>
                    <span class="workout__value">${workout.speed.toFixed(2)}</span>
                    <span class="workout__unit">км/ч</span>
                </div>
                <div class="workout__details">
                    <span class="workout__icon">🏔</span>
                    <span class="workout__value">${workout.climb}</span>
                    <span class="workout__unit">м</span>
                </div>
            </li>`
        }

        form.insertAdjacentHTML('afterend', html);
    }
}

const app = new App();

