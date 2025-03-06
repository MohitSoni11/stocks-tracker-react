////////////////////////////////////////////
/********* Requiring npm Packages *********/
////////////////////////////////////////////

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

const cors = require('cors');
app.options('*', cors());

const { spawn } = require('child_process');
const yahooFinance = require('yahoo-finance2').default;

//////////////////////////////////
/********* Creating App *********/
//////////////////////////////////

const port = 5000;
const app = express();

app.use(cors({
  origin: ['https://stocks-tracker-react.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// MongoDB password: YIK13x0DFx332537
// MongoDB connection string: mongodb+srv://mohitksoni04:9teGhahcsRCXwOpz@cluster0.kfl9a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

app.use(cors(corsOptions));
app.use(express.json());

app.listen(process.env.port || port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

// So that yahooFinance doesn't provide useless messages in the terminal
yahooFinance.suppressNotices([
  'yahooSurvey',
]);

/////////////////////////////////////////
/********* Setting up Database *********/
/////////////////////////////////////////

mongoose.connect(uri)
.then(() => (
    console.log('MongoDB connected.')
))
.catch(() => (
  console.log('ERROR: MongoDB could not connect.')
));

/////////////////////////////////////////////////////////
/********* MongoDB Collection Schemas & Models *********/
/////////////////////////////////////////////////////////

const TypeSchema = mongoose.Schema({
  name: { 
    type: String, 
    required: true
  }
});

const AccountSchema = mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

const TransactionTypeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

const TickerSchema = mongoose.Schema({
  ticker: {
    type: String,
    required: true
  }
});

const LotNumSchema = mongoose.Schema({
  num: {
    type: Number,
    required: true
  }
});

const LotSchema = mongoose.Schema({
  lot: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  account: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    required: true
  },
  ticker: {
    type: String,
    required: true
  },
  transactionType: {
    type: String,
    required: true
  },
  buyQuantity: {
    type: Number,
    required: true
  },
  buyPrice: {
    type: Number,
    required: true
  },
  sellQuantity: {
    type: Number,
    default: 0,
    required: true
  },
  sellReturn: {
    type: Number,
    default: 0,
    required: true
  }
});

const sellSchema = mongoose.Schema({
  ticker: {
    type: String,
    required: true
  },
  lot: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  fee: {
    type: Number,
    required: true
  }
});

const Type = mongoose.model('type', TypeSchema);
const Account = mongoose.model('account', AccountSchema);
const TransactionType = mongoose.model('transactionType', TransactionTypeSchema);
const Ticker = mongoose.model('ticker', TickerSchema);
const LotNum = mongoose.model('lotNum', LotNumSchema);
const Lot = mongoose.model('lot', LotSchema);
const Sell = mongoose.model('sell', sellSchema);

///////////////////////////////////////
/********* Updating Database *********/
///////////////////////////////////////

app.post('/add-account-type', async (req, res) => {
  const results = await Type.find({ name: req.body.name });
  
  // Adding type if it is not already present in the database
  if (results.length == 0) {
    data = {
      name: req.body.name
    };

    await Type.insertMany([data]).then(() => {
      console.log('Added Account Type: ' + data.name);
      return res.json({ success: true, message: '' });
    }).catch((error) => {
      return res.json({ success: false, message: error });
    });
  } else {
    return res.json({ success: false, message: 'Account type already exists' });
  }
});

app.post('/add-account', async (req, res) => {
  const results = await Account.find({ name: req.body.name });

  // Adding account if it is not already present in the database
  if (results.length == 0) {
    data = {
      type: req.body.type,
      name: req.body.name
    };

    await Account.insertMany([data]).then(() => {
      console.log('Added Account: ' + data.name + ' with type ' + data.type);
      return res.json({ success: true, message: '' });
    }).catch((error) => {
      return res.json({ success: false, message: error });
    });
  } else {
    return res.json({ success: false, message: 'Account already exists' });
  }
});

app.post('add-transaction-type', async (req, res) => {
  const results = await TransactionType.find({ name: req.body.name });

  // Adding transaction type if it is not already present in the database
  if (results.length == 0) {
    data = {
      name: req.body.name
    };

    await TransactionType.insertMany([data]).then(() => {
      console.log('Added Transaction Type: ' + data.name);
      return res.json({ success: true, message: '' });
    }).catch((error) => {
      return res.json({ success: false, message: '' });
    });
  } else {
    return res.json({ success: false, message: 'Transaction Type already exists' });
  }
});

app.post('/add-ticker', async (req, res) => {
  const results = await Ticker.find({ ticker: req.body.ticker });

  // Adding ticker if it is not already present in the database
  if (results.length == 0) {
    data = {
      ticker: req.body.ticker
    };

    await Ticker.insertMany([data]).then(() => {
      console.log('Added Ticker: ' + data.ticker);
      return res.json({ success: true, message: '' });
    }).catch((error) => {
      return res.json({ success: false, message: error });
    });
  } else {
    return res.json({ success: false, message: 'Ticker already exists' });
  }
});

app.post('/buy', async (req, res) => {
  const now = new Date();
  const providedDate = new Date(req.body.date);
  providedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

  const initialResults = await LotNum.find({});
  if (initialResults.length == 0) {
    data = {
      num: 0
    };

    await LotNum.insertMany([data]).then(() => {
      console.log('Added Initial Lot Num');
    }).catch((error) => {
      console.log('ERROR: ' + error);
    });
  }

  await LotNum.updateOne({}, { $inc: { num: 1 }});

  const results = await LotNum.find({});

  data = {
    lot: results[0].num,
    date: providedDate,
    account: req.body.account,
    accountType: req.body.accountType,
    ticker: req.body.ticker,
    transactionType: req.body.transactionType,
    buyQuantity: req.body.quantity,
    buyPrice: req.body.price
  };

  await Lot.insertMany([data]).then(() => {
    console.log('Bought ' + data.buyQuantity + ' stocks of ' + data.ticker + ' at price ' + data.buyPrice);
    return res.json({ success: true, message: '' });
  }).catch((error) => {
    console.log('ERROR: ' + error);
    return res.json({ success: false, message: error });
  });
});

app.post('/sell', async (req, res) => {
  data = {
    ticker: req.body.ticker,
    lot: req.body.lot,
    quantity: req.body.quantity,
    price: req.body.price,
    fee: req.body.fee
  };

  const currLot = await Lot.findOne({ lot: data.lot });
  soldQty = Number(data.quantity);

  if (currLot.buyQuantity < currLot.sellQuantity + soldQty) {
    console.log('Error: Cannot sell more than remaining.');
    return res.json({ success: false, message: 'Error: Cannot sell more than remaining.' });
  }

  currLot.sellQuantity += soldQty;
  currLot.sellReturn += soldQty * Number(data.price) - Number(data.fee);
  await currLot.save();

  await Sell.insertMany([data]).then(() => {
    console.log('Sold ' + soldQty + ' stocks of ' + data.ticker + ' at price ' + data.price);
    return res.json({ success: true, message: '' });
  }).catch((error) => {
    console.log('Error: ' + error);
    return res.json({ success: false, message: 'ERROR' })
  });
});

app.get('/delete-account-types', async (req, res) => {
  const result = await Type.deleteMany({});
  console.log(`${result.deletedCount} account types deleted.`);
  res.json({
    success: true
  });
});

app.get('/delete-accounts', async (req, res) => {
  const result = await Account.deleteMany({});
  console.log(`${result.deletedCount} accounts deleted.`);
  res.json({
    success: true
  });
});

app.get('/delete-tickers', async (req, res) => {
  const result = await Ticker.deleteMany({});
  console.log(`${result.deletedCount} tickers deleted.`);
  res.json({
    success: true
  });
});

app.get('/delete-transaction-types', async (req, res) => {
  const result = await TransactionType.deleteMany({});
  console.log(`${result.deletedCount} transaction types deleted.`);
  res.json({
    success: true
  });
});

app.get('/delete-lots', async (req, res) => {
  const result = await Lot.deleteMany({});
  const result2 = await Sell.deleteMany({});
  console.log(`${result.deletedCount} buy lots deleted.`);
  console.log(`${result2.deletedCount} sell lots deleted.`);
  res.json({
    success: true
  });
});

////////////////////////////////////////////////////////
/********* Fetching Information from Database *********/
////////////////////////////////////////////////////////

app.get('/fetch-account-types', async (req, res) => {
  const accountTypes = await Type.find({});
  res.json({
    types: accountTypes
  });
});

app.get('/fetch-accounts', async (req, res) => {
  const accounts = await Account.find({});
  res.json({
    accounts: accounts
  });
});

app.get('/fetch-transaction-types', async (req, res) => {
  const transactionTypes = await TransactionType.find({});
  res.json({
    types: transactionTypes
  });
});

app.get('/fetch-tickers', async (req, res) => {
  const tickers = await Ticker.find({});
  res.json({
    tickers: tickers
  });
});

app.get('/fetch-lots', async (req, res) => {
  const ticker = req.query.ticker?.toUpperCase();
  const lots = await Lot.aggregate([
    {
      $match: {
        ticker: ticker,
        $expr: { $ne: ['$buyQuantity', '$sellQuantity'] } // Compare buyQuantity and sellQuantity
      }
    }
  ]);

  res.json({
    lots: lots
  });
});

////////////////////////////////////////////////////////
/********* Fetching Information from YFinance *********/
////////////////////////////////////////////////////////

app.get('/fetch-ticker-info', async (req, res) => {
  const ticker = req.query.ticker?.toUpperCase();
  const quote = await yahooFinance.quote(ticker);

  let companyName = 'N/A';
  if (quote != null && quote.hasOwnProperty('displayName')) {
    companyName =  quote.displayName;
  }

  res.json({
    info: companyName
  });
});

app.get('/fetch-current-price', async (req, res) => {
  const ticker = req.query.ticker?.toUpperCase();
  const quote = await yahooFinance.quoteSummary(ticker);

  let currentPrice = 'N/A'
  if (quote != null && quote.price.hasOwnProperty('regularMarketPrice')) {
    currentPrice = quote.price.regularMarketPrice;
  }

  res.json({
    price: currentPrice
  });
});