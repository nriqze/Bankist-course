'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [
    [200, '2019-11-01T13:15:33.035Z'],
    [455.23, '2019-11-30T09:48:16.867Z'],
    [-306.5, '2019-12-25T06:04:23.907Z'],
    [25000, '2020-01-25T14:18:46.235Z'],
    [-642.21, '2020-02-05T16:33:06.386Z'],
    [-133.9, '2020-04-10T14:43:26.374Z'],
    [79.97, '2020-06-25T18:49:59.371Z'],
    [1300, '2020-07-26T12:01:20.894Z'],
  ],
  interestRate: 1.2, // %
  pin: 1111,
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [
    [5000, '2019-11-18T21:31:17.178Z'],
    [3400, '2019-12-23T07:42:02.383Z'],
    [-150, '2020-01-28T09:15:04.904Z'],
    [-790, '2020-04-01T10:17:24.185Z'],
    [-3210, '2020-05-08T14:11:59.604Z'],
    [-1000, '2020-05-27T17:01:17.194Z'],
    [8500, '2020-07-11T23:36:17.929Z'],
    [-30, '2020-07-12T10:51:36.790Z'],
  ],
  interestRate: 1.5, // %
  pin: 2222,
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [
    [200, '2019-11-01T13:15:33.035Z'],
    [-200, '2019-11-30T09:48:16.867Z'],
    [340, '2019-12-25T06:04:23.907Z'],
    [-300, '2020-01-25T14:18:46.235Z'],
    [-20, '2020-02-05T16:33:06.386Z'],
    [50, '2020-04-10T14:43:26.374Z'],
    [400, '2020-06-25T18:49:59.371Z'],
    [-460, '2020-07-26T12:01:20.894Z'],
  ],
  interestRate: 0.7, // %
  pin: 3333,
  currency: 'EUR',
  locale: 'fr-FR',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [
    [430, '2019-11-18T21:31:17.178Z'],
    [1000, '2020-01-28T09:15:04.904Z'],
    [700, '2020-04-01T10:17:24.185Z'],
    [50, '2020-07-11T23:36:17.929Z'],
    [90, '2020-07-12T10:51:36.790Z'],
  ],
  interestRate: 1, // %
  pin: 4444,
  currency: 'GBP',
  locale: 'en-GB',
};

let accounts = [account1, account2, account3, account4];
let curAccount, timer;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const containerModal = document.querySelector('.modalAndOverlay');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const close = document.querySelector('.close-modal');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////// Functions //////////////
// Computing user names
const usernames = function(accs) {
  accs.forEach(acc => {
    acc.username = acc.owner.toLowerCase().split(' ').map(el => el[0]).join('');
  });
};
usernames(accounts)

// Calculating days passed
const formatMovsDate = function(date, locale) {
  // After 7 days, display actual date.
  const calcDaysPassed = (date1, date2) => Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
  const daysPassed = Math.floor(calcDaysPassed(new Date(), date));

  if(daysPassed === 0) return `Today`;
  if(daysPassed === 1) return `Yesterday`;
  if(daysPassed <= 7) return `${daysPassed} days ago`;
  if(daysPassed > 7) {
    return new Intl.DateTimeFormat(locale).format(date);
  };
};

// Format numbers for currency.
const formatNumber = function(currency, locale, mov) {
  const optionsNumber = {
    style: 'currency',
    currency: currency,
  };
  return Intl.NumberFormat(locale, optionsNumber).format(mov);
}

// Display movements
const displayMovements = function(curAcc, sort = false) {
  // Empty movements container
  containerMovements.innerHTML='';

  // Sorting movements
  const movs = sort ? curAcc.movements.slice().sort((a, b) => a[0] - b[0] ) : curAcc.movements;
  // Add html to movements
  movs.forEach((mov, i) => {
    let movDate = new Date(mov[1]);
    // Days passed
    let days = formatMovsDate(movDate);

    const movType = mov[0] < 0 ? 'withdrawal' : 'deposit';
    const formatedMov = formatNumber(curAcc.currency, curAcc.locale, mov[0]);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${movType}">${i+1} ${movType}</div>
      <div class="movements__date">${days}</div>
      <div class="movements__value">${formatedMov}</div>
    </div>
    `
    //
    // Attach the new element to the UI
    containerMovements.insertAdjacentHTML("afterbegin", html);
  })
  // Display element
  containerApp.style.opacity=100;
};

// Display summary
const displaySummary = function(curAcc) {
  // In
  const sumIn = curAcc.movements.filter(mov => mov[0] > 0).reduce((acc, mov) => acc + mov[0], 0);
  labelSumIn.textContent = formatNumber(curAcc.currency, curAcc.locale, sumIn);
  // Out
  const sumOut = curAcc.movements.filter(mov => mov[0] < 0).reduce((acc, mov) => acc + mov[0], 0);
  labelSumOut.textContent = formatNumber(curAcc.currency, curAcc.locale, sumOut);
  // Interest - 1.2% of each deposit and each interest amount is at least one.
  const sumInt = curAcc.movements.filter(mov => mov[0] > 0).map(dep => (dep[0] * curAcc.interestRate / 100) > 1 ? dep[0] * curAcc.interestRate / 100 : 1).reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatNumber(curAcc.currency, curAcc.locale, sumInt);

  curAcc.balance = sumIn + sumOut + sumInt;
};

// Display balance
const displayBalance = function(curAcc) {
  labelBalance.textContent = formatNumber(curAcc.currency, curAcc.locale, curAcc.balance);
  // labelBalance.textContent = `${formatNumber(curAcc.currency, curAcc.locale, curAcc.balance)}`;

  // Display balance date
  const now = new Date();
  const curLocale = curAccount.locale;

  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  };

  labelDate.textContent = new Intl.DateTimeFormat(curLocale, options).format(now);
};

//Update UI
const updateUI = function(acc) {
  displayMovements(acc);
  displaySummary(acc);
  displayBalance(acc);
};

// Logout timer
const startLogoutTimer = function() {
  const times = function() {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    
    labelTimer.textContent = `${min}:${sec}`;
    
    if(time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      // labelWelcome.textContent = 'Log in to get started';
      window.location = '../index.html';
    };
    
    time--;
  };
  
  let time = 10;

  times();
  const timer = setInterval(times, 1000);
  return timer;
};

////////////// Handlers //////////////
btnLogin.addEventListener('click', function(e) {
  e.preventDefault();

  curAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  if(curAccount && curAccount.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome ${curAccount.owner}`;
    updateUI(curAccount);
  };

  if(!curAccount) return;

  // Clear form
  inputLoginUsername.value = inputLoginPin.value = '';

  // Start timer
  if(timer) clearInterval(timer);
  timer = startLogoutTimer();
});

// Sort movements
let sorted = false;

btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(curAccount, !sorted);
  sorted = !sorted;
});

// Transfer money
btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const recAccount = accounts.find(acc => acc.username === inputTransferTo.value);
  const amount = +inputTransferAmount.value;

  if(!recAccount) alert

  if(amount > 0 && curAccount.balance >= amount && recAccount?.username !== curAccount.username) {
    recAccount.movements.push([amount, new Date().toISOString()]);
    curAccount.movements.push([-amount, new Date().toISOString()]);
  };

  updateUI(curAccount);

  inputTransferTo.value = inputTransferAmount.value = '';
});

// Request loan
// CONDITION: The loans is granted only if there is at least one deposit with at least 10% of the loan amount.
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const minDepositLoan = curAccount.movements.some(mov => mov[0] >= +inputLoanAmount.value * 0.1);

  if(minDepositLoan && inputLoanAmount.value >= 0) {
    curAccount.movements.push([Math.floor(inputLoanAmount.value), new Date().toISOString()]);
  };

  setTimeout(function() {
    updateUI(curAccount);
  }, 3000);


  inputLoanAmount.value = '';
});

// Close account
btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  if(curAccount.username === inputCloseUsername.value && curAccount.pin === +inputClosePin.value) {
    const index = accounts.findIndex(acc => acc.username === curAccount.username);
    accounts.splice(index, 1);
    containerApp.style.opacity=0;
    // labelWelcome.textContent = 'Log in to get started';
    window.location = '../index.html';
  };

  inputCloseUsername.value = inputClosePin.value = '';
});

/////////////////////////////////////////////////////////
window.addEventListener('beforeunload', function(e) {
  console.log(e);
  e.returnValue = `You're going to be redirected to our site`;
})