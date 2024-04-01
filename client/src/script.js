
function app() {
  // QuerySelectors / GetElementByIds
  const img = document.querySelector('.property-img');
  const btnLeft = document.querySelector('.btn-left-container');
  const btnRight = document.querySelector('.btn-right-container');
  const propertyPrice = document.querySelector('.property-price');
  const propertySold = document.querySelector('.property-sold');
  const propertyDescription = document.querySelector('.property-description');
  const enquireForm = document.querySelector('.grid-item-3');
  const listing = document.querySelector('.grid-item-3-listing');
  const btnSwitch = document.querySelector('.grid-item-9');
  const createListingNav = document.querySelector('.create-listing');
  const enquireNav = document.querySelector('.enquire');
  const availableCheckbox = document.getElementById('available');
  const soldCheckbox = document.getElementById('sold');
  const listingSubmitForm = document.querySelector('.grid-item-3-listing')
  const imgUrlElement = document.getElementById('img-url')
  const priceElement = document.getElementById('price')
  const descriptionElement = document.getElementById('description')
  const adminForm = document.querySelector('.admin-form')
  const adminElement = document.getElementById('admin')
  const hamburgerBtn = document.querySelector('.hamburger');
  const navList = document.querySelector('.nav-list');
  const navLinks = document.querySelectorAll('.nav-link');
  // Const


  // Lets
  let propertyData = null
  let currentImg = '';
  let currentPropertyId = null;
  let enquireOrListing = false
  let availableChecked = false
  let soldChecked = false
  let imgUrl = ''
  let price = ''
  let description = ''
  let adminCode = null
  let adminCodeEntered = false

  // Arrays 

  // Functions
  const changeImg = (rightOrLeft) => {
    let dataLength = propertyData.length
    if(rightOrLeft === 'right'){
      if (dataLength - 1 === currentPropertyId){
        currentPropertyId = 0    
      } else {
        currentPropertyId++
      }
    } 
    if (rightOrLeft === 'left'){
      if ((dataLength - dataLength) === currentPropertyId) {
        currentPropertyId = dataLength - 1
      } else {
        currentPropertyId--
      }
    }
    if (!rightOrLeft){
      currentPropertyId = parseInt(propertyData.length / 2)
    }
      img.style.opacity = 0;
      propertySold.style.opacity = 0;
    setTimeout(() => {
      img.style.backgroundImage = `url('${propertyData[currentPropertyId].propertyImg}')`;
      propertyPrice.innerHTML = `Freehold price: £${propertyData[currentPropertyId].price}`;
      propertyData[currentPropertyId].sold ? (propertySold.classList.remove('property-sold-false'), propertySold.classList.add('property-sold-true')) : (propertySold.classList.remove('property-sold-true'), propertySold.classList.add('property-sold-false'));
      propertyDescription.innerHTML = `${propertyData[currentPropertyId].description}`;
      img.style.opacity = 1;
      propertySold.style.opacity = 1;
    }, 500);
  }

  const switchEnquireListing = () => {
    if (!enquireOrListing) {
      enquireForm.style.display = 'none'
      listing.style.display = 'block'

    } else {
      enquireForm.style.display = 'block'
      listing.style.display = 'none'
    }
    enquireOrListing = !enquireOrListing
  }

  const checkSwitchEnquireListing = (check) => {
    if (check === 'listing' && !enquireOrListing) {
      switchEnquireListing()
    } else if (check === 'listing' && enquireOrListing) {
      return
    }
    if (check === 'enquire' && enquireOrListing) {
      switchEnquireListing()
    } else if (check === 'enquire' && !enquireOrListing) {
      return
    }
  }

  const checkCheckboxes = (check) => {
    if (check === 'available' && !availableChecked) {
      soldCheckbox.style.display = 'none'
    }
    if (check === 'available' && availableChecked) {
      soldCheckbox.style.display = 'block'
    }
    if (check === 'sold' && !soldChecked) {
      availableCheckbox.style.display = 'none'
    }
    if (check === 'sold' && soldChecked) {
      availableCheckbox.style.display = 'block'
    }
  }

  const resetPage = () => {
    getPropertyData()
    imgUrlElement.value = ''
    descriptionElement.value = ''
    priceElement.value = ''
    availableCheckbox.checked = false
    soldCheckbox.checked = false
    soldChecked = false
    availableChecked = false
    availableCheckbox.style.display = 'block'
    soldCheckbox.style.display = 'block'
  }

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (event.target === imgUrlElement) {
      imgUrl = value
      console.log(imgUrl)
    } else if (event.target === descriptionElement) {
      description = value
      console.log(description)
    } else if (event.target === priceElement) {
      price = value
      console.log(price)
    } else if (event.target === adminElement) {
      adminCode = parseInt(value)
      console.log(adminCode)
    }
  }

  const showAdminFeatures = () => {
    if (adminCode === 12345){
      adminForm.style.display = 'none'
      createListingNav.style.display = 'block'
      btnSwitch.style.display = 'block'
    }
  }

  // Fetch Data
  const getPropertyData = async () => {
    try {
      const response = await fetch(`http://localhost:4003/property-data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      propertyData = await response.json();
      changeImg()
      return propertyData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getPropertyData()

  const createListing = async () => {
    try {
      const response = await fetch(`http://localhost:4003/property-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          propertyImg: imgUrl,
          price: price,
          description: description,
          sold: soldChecked ? true : availableChecked ? false : ''
        })
      });
      const responseData = await response.json();
      if (response.ok) {
        console.log('Success:', responseData);
        resetPage()
      } else {
        console.error('Failed:', responseData);
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };



  // Event listeners
  hamburgerBtn.addEventListener('click', () =>{
    hamburgerBtn.classList.toggle('active');
    navList.classList.toggle('active');
  });
  for (const link of navLinks) {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navList.classList.toggle('active');
    });
  };
  btnLeft.addEventListener('click', function () {
    changeImg('left');
  });

  btnRight.addEventListener('click', function () {
    changeImg('right');
  });

  btnSwitch.addEventListener('click', function () {
    switchEnquireListing()
  });

  createListingNav.addEventListener('click', function () {
    checkSwitchEnquireListing('listing')
  });

  enquireNav.addEventListener('click', function () {
    checkSwitchEnquireListing('enquire')
  });

  availableCheckbox.addEventListener('click', function () {
    checkCheckboxes('available')
    availableChecked = !availableChecked
  });

  soldCheckbox.addEventListener('click', function () {
    checkCheckboxes('sold')
    soldChecked = !soldChecked
  });

  listingSubmitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    createListing();
  });

  imgUrlElement.addEventListener('change', handleInputChange);
  descriptionElement.addEventListener('change', handleInputChange);
  priceElement.addEventListener('change', handleInputChange);

  adminForm.addEventListener('submit', function (event) {
    event.preventDefault();
    showAdminFeatures()
  });

  adminElement.addEventListener('change', handleInputChange);
}

app();
