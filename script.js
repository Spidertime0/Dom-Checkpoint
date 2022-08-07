/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  let coffee = document.getElementById('coffee_counter')
  coffee.innerText = coffeeQty
}

function clickCoffee(data) {
  data.coffee++
  updateCoffeeView(data.coffee)
  renderProducers(data)
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  
  for (let i = 0; i < producers.length; i++){
    let curProducer = producers[i]
    if (!curProducer.unlocked && coffeeCount >= curProducer.price * 0.5){
      curProducer.unlocked = true
    }
  }
}

function getUnlockedProducers(data) {
  let ansArray = data.producers.filter(producer => producer.unlocked === true)
  return ansArray
}

function makeDisplayNameFromId(id) {
  let ansString = ''
  for (let i = 0; i < id.length; i++){
    let curChar = id[i]
    if (curChar === '_') {
      curChar = ' '
    }
    if (i === 0 || ansString[i - 1] === ' '){
    curChar = curChar.toUpperCase()
    ansString += curChar
    } else {
    ansString += curChar
    }
  }
  return ansString
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
  parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  let coffeeCount = document.getElementById('coffee_counter')
  let producers = document.getElementById('producer_container')
  
 unlockProducers(data.producers, data.coffee)
 deleteAllChildNodes(producers)
 
 for (let i = 0; i < data.producers.length; i++){
   let curProducer = data.producers[i]
   if (data.coffee >= curProducer.price * 0.5){
     let newProducer = makeProducerDiv(curProducer)
     producers.appendChild(newProducer)
    }
  }
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  let producerIndex = data.producers.findIndex((producer) => producer.id === producerId)
  
  return data.producers[producerIndex]
}

function canAffordProducer(data, producerId) {
  let userCanAfford = false
  let curProducer = getProducerById(data, producerId)
  if (data.coffee >= curProducer.price){
    userCanAfford = true
  }
  
  return userCanAfford
}

function updateCPSView(cps) {
  let cpsElement = document.getElementById('cps')
  cpsElement.innerText = cps
}

function updatePrice(oldPrice) {
  let newPrice = Math.floor(oldPrice * 1.25)
  return newPrice
}

function attemptToBuyProducer(data, producerId) {
  let userCanBuy = canAffordProducer(data, producerId)
  let producerData = getProducerById(data, producerId)
  if (userCanBuy) {
    producerData.qty++
    data.coffee -= producerData.price
    producerData.price = updatePrice(producerData.price)
    data.totalCPS += producerData.cps
    updateCPSView(data.totalCPS)
  }
  return userCanBuy
}

function buyButtonClick(event, data) {
  
  if (event.target.tagName === "BUTTON") {
  let buyProducer = event.target.id
  let curProducer = buyProducer.slice(4, buyProducer.length)
  let userCanBuy = attemptToBuyProducer(data, curProducer)
  
  if (!userCanBuy){
    window.alert('Not enough coffee!')
  } else {
    renderProducers(data)
    updateCoffeeView(data.coffee)
  }
  }
}

function tick(data) {
  data.coffee += data.totalCPS
  updateCoffeeView(data.coffee)
  renderProducers(data)
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
