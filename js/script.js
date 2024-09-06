//script files

window.addEventListener('load', () => {
    const genContainer = document.querySelector('.gen-container');
    const loaderSection = document.querySelector('.pre-loader');
    genContainer.style.display = 'block';
    loaderSection.style.display = 'none';

    let cars = [];
    let carsPerPage = 12;
    let currentPage = 1;

    // Fetch car data from the Json file we have using async/await
    async function fetchCarData() {
        try {
            const response = await fetch("cars.json");
            console.log(response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json();
            console.log(data);
            cars = data.cars;
            displayCars(cars) //25 cars showing
        } catch (error) {
            console.log('Error loading cars:', error);
        }

    }
    //calling our fetchcar data function
    fetchCarData()


    function displayCars(filteredCars = cars) {
        const carContainer = document.getElementById('carContainer');
        carContainer.innerHTML = '';
        // Create a new div for each car
        filteredCars.forEach(car => {
            const carItem = document.createElement('div');
            carItem.classList.add('car-card');
            carItem.innerHTML = `
            <div >
                <h2> ${car.make} ${car.model} (${car.year}) </h2>
                 <p> Location: ${car.location} </p>
              <p> Rental Price: <b> ${car.rental_price_per_day} </b> </p>
               <p class = 'rating'> ${car.rating} </p>
               <p>Features:  ${car.features.join(', ')} </p>
            </div>
            <div class = "car-card-img">
            <img src= "${car.images[0]}" alt="${car.make}" />
            </div>
            <button class="rent-btn" data-car="${car.make} ${car.model}"> Rent </button>
            `
            // Append each new car item to the container
            carContainer.appendChild(carItem);
        });
    }
})
