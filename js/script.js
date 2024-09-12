//script files

window.addEventListener('load', () => {
    const genContainer = document.querySelector('.gen-container');
    const loaderSection = document.querySelector('.pre-loader');
    genContainer.style.display = 'block';
    loaderSection.style.display = 'none';

    const rentModal = document.getElementById('rentModal')
    const rentalPriceInput = document.getElementById('rentalPrice');
    const carModelInput = document.getElementById('carModel');
    const totalPriceInput = document.getElementById('totalCost');
    const rentDuration = document.getElementById('rentDuration');
    const rentForm = document.getElementById('rentForm');
    const closeBtn = document.querySelector('.close-btn');
    const modalToFlex = document.querySelector('.modal-to-flex');
    const searchIcon = document.getElementById('searchInput-icon');
    const searchInput = document.getElementById('searchInput');

    const filterIcon = document.getElementById('filter-icon');
    const offCanvasFilter = document.getElementById('off-canvas-filter');
    const closeFilterBtn = document.getElementById('close-filter');
    const filterForm = document.getElementById('filterForm');

    let cars = [];
    let carsPerPage = 12;
    let currentPage = 1;
    let exchangeRates = {}; //to store fetched exchange rates
    let selectedCurrency = "USD"

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
            displayCars() //25 cars showing
            createPagination()
        } catch (error) {
            console.log('Error loading cars:', error);
        }

    }
    //calling our fetchcar data function
    fetchCarData()


    function displayCars(filteredCars = cars) {
        const carContainer = document.getElementById('carContainer');
        carContainer.innerHTML = '';
        const start = (currentPage - 1) * carsPerPage; //0
        const end = currentPage * carsPerPage //12
        const carsToShow = filteredCars.slice(start, end)
        //filtercars = 25
        //carstoshow =12

        // Create a new div for each car
        carsToShow.forEach(car => {
            const convertedPrice = convertCurrency(car.rental_price_per_day, selectedCurrency)
            const carItem = document.createElement('div');
            carItem.classList.add('car-card');
            carItem.innerHTML = `
            <div>
                <h2> ${car.make} ${car.model} (${car.year}) </h2>
                 <p> Location: ${car.location} </p>
              <p> Rental Price: <b> ${selectedCurrency} ${convertedPrice} </b> </p>
               <p class = 'rating'> ${car.rating} </p>
               <p>Features:  ${car.features.join(', ')} </p>
            </div>
            <div class = "car-card-img">
            <img src= "${car.images[0]}" alt="${car.make}" />
            </div>
            <button class="rent-btn" data-car="${car.make} ${car.model}"  data-price ="${convertedPrice}"> Rent </button>
            `
            // Append each new car item to the container
            carContainer.appendChild(carItem);
        });
        document.querySelectorAll('.rent-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                console.log();
                const carModel = e.target.getAttribute('data-car'); //toyota camry
                const rentalPrice = e.target.getAttribute('data-price'); //45
                carModelInput.value = carModel;
                rentalPriceInput.value = rentalPrice
                rentModal.style.display = 'block'

            })
        })

    }
    rentDuration.addEventListener('input', (event) => {
        const days = event.target.value;
        const pricePerDay = parseFloat(rentalPriceInput.value);
        if (!isNaN(days) && !isNaN(pricePerDay) && days) {
            totalPriceInput.value = (days * pricePerDay).toFixed(4)
        }
    })

    rentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Collect form data in form of key value pairs
        const formData = new FormData(rentForm);
        console.log("Form data:", Object.fromEntries(formData.entries()));
        swal.fire('Success', "Your rental Request has been submitted", "success")
        rentModal.style.display = 'none';
    })
    // closing the rent modal
    closeBtn.addEventListener('click', () => {
        rentModal.style.display = 'none';
    })

    window.addEventListener('click', (e) => {
        if (e.target === modalToFlex) {
            rentModal.style.display = 'none';
        }
    })
    function createPagination(paginatedCars = cars) {
        const paginationContainer = document.getElementById('paginationContainer')
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(paginatedCars.length / carsPerPage)
        console.log(totalPages); //3 pages
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('pagination-btn');

            if (i == currentPage) {
                pageButton.classList.add('active')
            }
            pageButton.addEventListener('click', () => {
                currentPage = i
                displayCars(paginatedCars);
                createPagination(paginatedCars)
            })
            paginationContainer.appendChild(pageButton)
        }

    }
    //function for triggering the rent modal


    // display search input
    searchIcon.addEventListener('click', () => {
        searchInput.classList.toggle('active');
        searchInput.focus()
    })

    // search the cars arry using the filter method

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        const searchFilteredCars = cars.filter(car => {
            return (

                car.make.toLowerCase().includes(query) ||
                car.model.toLowerCase().includes(query) ||
                car.location.toLowerCase().includes(query)
            )
        });
        displayCars(searchFilteredCars);
        createPagination(searchFilteredCars)
    })

    function applyFilters() {
        const make = document.getElementById('filterMake').value.toLowerCase();
        const model = document.getElementById('filterModel').value.toLowerCase();
        const year = document.getElementById('filterYear').value;
        const priceMin = parseFloat(document.getElementById('filterPriceMin').value) || 0;
        const priceMax = parseFloat(document.getElementById('filterPriceMax').value) || Infinity;

        const newlyFilterCars = cars.filter((car) => {
            const carMake = car.make.toLowerCase();
            const carModel = car.model.toLowerCase();
            const caryear = car.year;
            const carPrice = car.rental_price_per_day;

            return (
                (make === '' || carMake.includes(make)) &&
                (model === ' ' || carModel.includes(model)) &&
                (year === "" || caryear == year) &&
                (carPrice >= priceMin && carPrice <= priceMax)

            );
        })

        // update display with the newly filtered cars

        displayCars(newlyFilterCars);
        createPagination(newlyFilterCars);
    }

    // Event listener for the rest filter button 
    document.getElementById("reset-filters-btn").addEventListener('click', () => {
        filterForm.reset();
        // rest the current page to be 1
        currentPage = 1;

        // redisplay the original list of cars
        displayCars()

        //recreate pagination for the original cars
        createPagination()
    })
    // event listener for filtering
    filterForm.addEventListener('submit', (event) => {
        event.preventDefault()
        applyFilters()
    })

    // Filter functionality
    function openFilterModal() {
        offCanvasFilter.classList.add('open')
    }
    function closeFilterModal() {
        offCanvasFilter.classList.remove('open')
    }

    filterIcon.addEventListener('click', openFilterModal);
    closeFilterBtn.addEventListener('click', closeFilterModal);


    //fetch exchange rate
    async function fetchExchangeRates() {
        try {
            const response = await fetch(`https://v6.exchangerate-api.com/v6/ed6c2728ccd0bfb3119d39a8/latest/USD`);
            console.log(response);
            const data = await response.json()
            console.log(data);
            exchangeRates = data.conversion_rates;
            console.log(exchangeRates);
        }
        catch (err) {
            console.log('Error fetching exchange rates', err);
        }
    }
    fetchExchangeRates();
    // convert price to the selected currency 
    function convertCurrency(amount, toCurrency) {
        const rate = exchangeRates[toCurrency] || 1;
        return (amount * rate).toFixed(2)
    }
    document.getElementById('currencySelect').addEventListener('change', (event) => {
        selectedCurrency = event.target.value;
        displayCars();
    })

})


