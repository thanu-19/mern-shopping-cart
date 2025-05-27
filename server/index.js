// const paypal = require("@paypal/checkout-server-sdk");

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
require('dotenv').config();
// app.use(cors());

app.use(cors({
  origin: 'https://mern-shopping-cart-one.vercel.app'  // your frontend URL here
}));
app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,    // from .env
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const paypal = require('@paypal/checkout-server-sdk');

function environment() {
  return new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  );
}

function getPayPalClient() {
  return new paypal.core.PayPalHttpClient(environment());
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB (projectDB)'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const accountSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
});
const Account = mongoose.model('Account', accountSchema);

app.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existingAccount = await Account.findOne({ email });
    if (existingAccount) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newAccount = new Account({ name, email, phone, password });
    await newAccount.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Registration failed', error });
  }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find user by email
      const account = await Account.findOne({ email });
  
      if (!account) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check password (plain text comparison for now — in real apps use hashing!)
      if (account.password !== password) {
        return res.status(401).json({ message: "Incorrect password" });
      }
  
      // Successful login
      res.status(200).json({ message: "Login successful", user: account });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Login failed", error });
    }
  });
  

  
app.get("/api/user", async (req, res) => {
    const email = req.query.email;
  
    try {
      const user = await Account.findOne({ email }); // Using Mongoose model
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Return user info as JSON (you can add more fields if needed)
      res.json({ name: user.name, email: user.email, phone: user.phone });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const category = req.body.category?.toLowerCase() || 'general'; // Default to 'general'
    return {
      folder: category,
      allowed_formats: ['jpg', 'jpeg', 'png'],
      transformation: [{ width: 500, height: 500, crop: 'limit' }]
    };
  }
});
const upload = multer({ storage });


const milkSchema = new mongoose.Schema({
  name: String,
  cost: Number,
  image: String,
  category: { type: String, default: 'milkproducts' }
});

const MilkProduct = mongoose.model('MilkProduct', milkSchema);

// POST route
app.post('/milk-products', upload.single('image'), async (req, res) => {
  const { name, cost } = req.body;
  const image = req.file.path;

  const product = new MilkProduct({ name, cost, image });
  await product.save();
  res.status(201).send('Product added');
});

// GET route
app.get('/milk-products', async (req, res) => {
  const products = await MilkProduct.find();
  res.json(products);
});

// PUT route to update product
app.put('/milk-products/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, cost } = req.body;
  let updateData = { name, cost };

  if (req.file) {
    updateData.image = req.file.path;
  }

  try {
    await MilkProduct.findByIdAndUpdate(id, updateData);
    res.status(200).send('Product updated');
  } catch (err) {
    res.status(500).send('Error updating product');
  }
});

// DELETE route to delete product
app.delete('/milk-products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await MilkProduct.findByIdAndDelete(id);
    res.status(200).send('Product deleted');
  } catch (err) {
    res.status(500).send('Error deleting product');
  }
});









// Snacks schema & model
const snackSchema = new mongoose.Schema({
  name: String,
  cost: Number,
  image: String,
  category: { type: String, default: 'snacks' }
});

const Snack = mongoose.model('Snack', snackSchema);
// POST route - Add Snack
app.post('/snacks', upload.single('image'), async (req, res) => {
  const { name, cost } = req.body;
  const image = req.file.path;

  const snack = new Snack({ name, cost, image });
  await snack.save();
  res.status(201).send('Snack added');
});

// GET route - Get all Snacks
app.get('/snacks', async (req, res) => {
  const snacks = await Snack.find();
  res.json(snacks);
});

// PUT route - Update Snack
app.put('/snacks/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, cost } = req.body;
  let updateData = { name, cost };

  if (req.file) {
    updateData.image = req.file.path;
  }

  try {
    await Snack.findByIdAndUpdate(id, updateData);
    res.status(200).send('Snack updated');
  } catch (err) {
    res.status(500).send('Error updating snack');
  }
});

// DELETE route - Delete Snack
app.delete('/snacks/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Snack.findByIdAndDelete(id);
    res.status(200).send('Snack deleted');
  } catch (err) {
    res.status(500).send('Error deleting snack');
  }
});






const vegetableSchema = new mongoose.Schema({
  name: String,
  cost: Number,
  image: String,
  category: { type: String, default: 'vegetable' }
});

const Vegetable = mongoose.model('Vegetable', vegetableSchema);

// POST - Add Vegetable
app.post('/vegetables', upload.single('image'), async (req, res) => {
  const { name, cost } = req.body;
  const image = req.file.path;

  const veg = new Vegetable({ name, cost, image });
  await veg.save();
  res.status(201).send('Vegetable added');
});

// GET - All Vegetables
app.get('/vegetables', async (req, res) => {
  const items = await Vegetable.find();
  res.json(items);
});

// PUT - Update Vegetable
app.put('/vegetables/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, cost } = req.body;
  let updateData = { name, cost };

  if (req.file) {
    updateData.image = req.file.path;
  }

  try {
    await Vegetable.findByIdAndUpdate(id, updateData);
    res.status(200).send('Vegetable updated');
  } catch (err) {
    res.status(500).send('Error updating vegetable');
  }
});

// DELETE - Delete Vegetable
app.delete('/vegetables/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Vegetable.findByIdAndDelete(id);
    res.status(200).send('Vegetable deleted');
  } catch (err) {
    res.status(500).send('Error deleting vegetable');
  }
});










// Fruits schema and model
const fruitSchema = new mongoose.Schema({
  name: String,
  cost: Number,
  image: String,
  category: { type: String, default: 'fruits' }
});
const Fruit = mongoose.model('Fruit', fruitSchema);



// POST - Add fruit
app.post('/fruits', upload.single('image'), async (req, res) => {
  const { name, cost } = req.body;
  const image = req.file.path;

  const fruit = new Fruit({ name, cost, image });
  await fruit.save();
  res.status(201).send('Fruit added');
});

// GET - All fruits
app.get('/fruits', async (req, res) => {
  const fruits = await Fruit.find();
  res.json(fruits);
});

// PUT - Update fruit
app.put('/fruits/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, cost } = req.body;
  let updateData = { name, cost };

  if (req.file) {
    updateData.image = req.file.path;
  }

  try {
    await Fruit.findByIdAndUpdate(id, updateData);
    res.status(200).send('Fruit updated');
  } catch (err) {
    res.status(500).send('Error updating fruit');
  }
});

// DELETE - Remove fruit
app.delete('/fruits/:id', async (req, res) => {
  try {
    await Fruit.findByIdAndDelete(req.params.id);
    res.status(200).send('Fruit deleted');
  } catch (err) {
    res.status(500).send('Error deleting fruit');
  }
});







// Mongoose Schema
const grocerySchema = new mongoose.Schema({
  name: String,
  cost: Number,
  image: String,
  category: { type: String, default: 'grocery' }
});

const Grocery = mongoose.model('Grocery', grocerySchema);


// POST: Add new grocery
app.post('/groceries', upload.single('image'), async (req, res) => {
  const { name, cost } = req.body;
  const image = req.file.path;

  const grocery = new Grocery({ name, cost, image });
  await grocery.save();
  res.status(201).send('Grocery item added');
});

// GET: All groceries
app.get('/groceries', async (req, res) => {
  const groceries = await Grocery.find();
  res.json(groceries);
});

// PUT: Update grocery item
app.put('/groceries/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, cost } = req.body;
  let updateData = { name, cost };

  if (req.file) {
    updateData.image = req.file.path;
  }

  try {
    await Grocery.findByIdAndUpdate(id, updateData);
    res.status(200).send('Grocery item updated');
  } catch (err) {
    res.status(500).send('Error updating grocery item');
  }
});

// DELETE: Delete grocery item
app.delete('/groceries/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Grocery.findByIdAndDelete(id);
    res.status(200).send('Grocery item deleted');
  } catch (err) {
    res.status(500).send('Error deleting grocery item');
  }
});







// Mongoose Schema
const bakerySchema = new mongoose.Schema({
  name: String,
  cost: Number,
  image: String,
  category: { type: String, default: 'bakery' }
});

const Bakery = mongoose.model('Bakery', bakerySchema);


// POST: Add new grocery
app.post('/bakery', upload.single('image'), async (req, res) => {
  const { name, cost } = req.body;
  const image = req.file.path;

  const bakery = new Bakery({ name, cost, image });
  await bakery.save();
  res.status(201).send('Bakery item added');
});

// GET: All groceries
app.get('/bakery', async (req, res) => {
  const bakery = await Bakery.find();
  res.json(bakery);
});

// PUT: Update grocery item
app.put('/bakery/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, cost } = req.body;
  let updateData = { name, cost };

  if (req.file) {
    updateData.image = req.file.path;
  }

  try {
    await Bakery.findByIdAndUpdate(id, updateData);
    res.status(200).send('Bakery item updated');
  } catch (err) {
    res.status(500).send('Error updating bakery item');
  }
});

// DELETE: Delete grocery item
app.delete('/bakery/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Bakery.findByIdAndDelete(id);
    res.status(200).send('Bakery item deleted');
  } catch (err) {
    res.status(500).send('Error deleting Bakery item');
  }
});




// app.post("/create-order", async (req, res) => {
//   console.log("Received order request:", req.body);

//   const { total } = req.body;

//   const request = new paypal.orders.OrdersCreateRequest();
//   request.prefer("return=representation");
//   request.requestBody({
//     intent: "CAPTURE",
//     purchase_units: [
//       {
//         amount: {
//           currency_code: "USD",
//           value: total.toString(),
//         },
//       },
//     ],
//     application_context: {
//       return_url: "https://mern-shopping-cart-one.vercel.app/payment-success",
//       cancel_url: "https://mern-shopping-cart-one.vercel.app/mycart",
//     },
//   });

//   try {
//     const client = getPayPalClient(); // ✅ Correct usage
//     const order = await client.execute(request);

//     const approvalUrl = order.result.links.find(link => link.rel === "approve").href;
//     res.json({ approvalUrl });

//   } catch (error) {
//     console.error("PayPal order creation failed:", error.message);
//     res.status(500).json({ error: "Payment creation failed" });
//   }
// });






app.post("/create-order", async (req, res) => {
  console.log("Received order request:", req.body);

  const { total } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD", // Or "INR" if you're using INR
          value: total.toString(),
        },
      },
    ],
    application_context: {
      return_url: "https://mern-shopping-cart-one.vercel.app/payment-success",
      cancel_url: "https://mern-shopping-cart-one.vercel.app/mycart",
      shipping_preference: "GET_FROM_FILE", // ✅ THIS LINE TELLS PAYPAL TO COLLECT SHIPPING
    },
  });

  try {
    const client = getPayPalClient();
    const order = await client.execute(request);

    const approvalUrl = order.result.links.find(link => link.rel === "approve").href;
    res.json({ approvalUrl });

  } catch (error) {
    console.error("PayPal order creation failed:", error.message);
    res.status(500).json({ error: "Payment creation failed" });
  }
});


// app.get("/capture-order", async (req, res) => {
//   const { token } = req.query;

//   const request = new paypal.orders.OrdersCaptureRequest(token);
//   request.requestBody({});

//   try {
//     const client = getPayPalClient();
//     const capture = await client.execute(request);

//     const shippingAddress = capture.result.purchase_units[0].shipping.address;
//     res.json({ shippingAddress });

//   } catch (error) {
//     console.error("Error capturing PayPal order:", error.message);
//     res.status(500).json({ error: "Failed to capture order" });
//   }
// });




// app.get("/capture-order", async (req, res) => {
//   const { token } = req.query;

//   const request = new paypal.orders.OrdersCaptureRequest(token);
//   request.requestBody({});

//   try {
//     const client = getPayPalClient();
//     const capture = await client.execute(request);

//     const shipping = capture.result.purchase_units[0].shipping;
//     const fullName = shipping?.name?.full_name || "No Name";
//     const address = shipping?.address || null;
//     if (!address) {
//       console.warn("Shipping address not found in PayPal response.");
//     }
    
//     res.json({
//       full_name: fullName,
//       address: address
//     });

//   } catch (error) {
//     console.error("Error capturing PayPal order:", error.message);
//     res.status(500).json({ error: "Failed to capture order" });
//   }
// });




app.get("/capture-order", async (req, res) => {
  const { token } = req.query;

  console.log("🔁 Received capture request with token:", token);

  const request = new paypal.orders.OrdersCaptureRequest(token);
  request.requestBody({});

  try {
    const client = getPayPalClient();
    const capture = await client.execute(request);

    console.log("✅ Full PayPal Capture Response:", JSON.stringify(capture.result, null, 2));

    const purchaseUnit = capture.result.purchase_units?.[0];
    const shipping = purchaseUnit?.shipping;
    const fullName = shipping?.name?.full_name || "No Name";
    const address = shipping?.address || null;

    if (!address) {
      console.warn("⚠️ Shipping address not found in PayPal response.");
    }

    res.json({
      full_name: fullName,
      address: address
    });

  } catch (error) {
    console.error("❌ Error capturing PayPal order:", error);
    res.status(500).json({ error: "Failed to capture order" });
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
