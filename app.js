// Function to format the ingredient into the correct API query format
function formatIngredient(ingredient) {
  return ingredient.toLowerCase().replace(/\s+/g, '_');
}

// Function to fetch meals based on the main ingredient
function fetchMealsByIngredient(ingredient) {
  const formattedIngredient = formatIngredient(ingredient);
  const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${formattedIngredient}`;

  return fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.meals) {
        return data.meals;
      } else {
        return []; // If no meals are found
      }
    })
    .catch(error => {
      console.error("Error fetching meals:", error);
      return [];
    });
}

// Function to create an order
function createOrder(meal) {
  // Retrieve last order number from sessionStorage, default to 0 if not found
  let lastOrderNumber = parseInt(sessionStorage.getItem('lastOrderNumber')) || 0;

  // Generate a new order number
  const orderNumber = lastOrderNumber + 1;

  // Create the order object
  const order = {
    orderNumber: orderNumber,
    description: meal.strMeal,
    status: 'Incomplete'
  };

  // Retrieve existing orders or initialize as an empty array
  let orders = JSON.parse(sessionStorage.getItem('orders')) || [];

  // Add the new order to the orders array
  orders.push(order);

  // Store the updated orders array and the last order number in sessionStorage
  sessionStorage.setItem('orders', JSON.stringify(orders));
  sessionStorage.setItem('lastOrderNumber', orderNumber.toString());

  return order;
}

// Function to display incomplete orders
function displayIncompleteOrders() {
  let orders = JSON.parse(sessionStorage.getItem('orders')) || [];

  // Filter out orders that are incomplete
  let incompleteOrders = orders.filter(order => order.status === 'Incomplete');

  if (incompleteOrders.length > 0) {
    let orderList = incompleteOrders.map(order => `Order #${order.orderNumber}: ${order.description}`).join("\n");
    alert("Incomplete Orders:\n" + orderList);
  } else {
    alert("No incomplete orders.");
  }
}

// Function to mark an order as complete
function markOrderComplete() {
  let orders = JSON.parse(sessionStorage.getItem('orders')) || [];

  // Step 1: Display incomplete orders
  displayIncompleteOrders();

  // Step 2: Prompt user for order number to complete or 0 to skip
  let orderNumberToComplete = parseInt(prompt("Enter the order number to mark as complete, or 0 to skip:"));

  if (orderNumberToComplete === 0) {
    alert("No orders were marked as complete.");
    return;
  }

  // Step 3: Find the order by order number
  let order = orders.find(order => order.orderNumber === orderNumberToComplete);

  if (order) {
    // Update the order status to completed
    order.status = 'Completed';

    // Save the updated orders back to sessionStorage
    sessionStorage.setItem('orders', JSON.stringify(orders));
    alert(`Order #${orderNumberToComplete} marked as completed.`);
  } else {
    alert("Order not found. Please check the order number.");
  }
}

// Main function to take the order
function takeOrder() {
  // Step 1: Prompt the user for a main ingredient
  const ingredient = prompt("Enter the main ingredient for your order (e.g., chicken, beef, garlic powder):");

  // Step 2: Fetch meals based on the ingredient
  fetchMealsByIngredient(ingredient).then(meals => {
    if (meals.length > 0) {
      // Step 3: Randomly select a meal from the list of meals
      const randomMeal = meals[Math.floor(Math.random() * meals.length)];

      // Step 4: Create an order based on the selected meal
      const order = createOrder(randomMeal);

      // Step 5: Show the order details to the user
      alert(`Your order has been placed!\nOrder Number: ${order.orderNumber}\nMeal: ${order.description}\nStatus: ${order.status}`);
    } else {
      alert("No meals found for this ingredient. Please try again with a different ingredient.");
    }
  });
}

// Function to trigger the display of incomplete orders and order completion
function handleOrders() {
  // Step 1: Ask the user if they want to see incomplete orders
  const viewIncomplete = prompt("Would you like to view incomplete orders? (yes/no)").toLowerCase();

  if (viewIncomplete === 'yes') {
    displayIncompleteOrders();
  }

  // Step 2: Ask the user if they want to mark an order as complete
  const markComplete = prompt("Do you want to mark an order as complete? (yes/no)").toLowerCase();

  if (markComplete === 'yes') {
    markOrderComplete();
  }
}

// Call the function to take the order when the page loads
window.onload = function () {
  takeOrder();

  // Optional: Provide a way to handle incomplete orders or complete orders after placing an order
  handleOrders();
};
