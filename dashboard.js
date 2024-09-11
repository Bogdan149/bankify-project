"use strict";

// // Prelucrare informatii Local Storage

const userData = JSON.parse(localStorage.getItem("loggedInUser"));
const accounts = JSON.parse(localStorage.getItem("accounts"));

// Declarare variabile

const loggedUser = document.querySelector(".show_username");
const userPicture = document.querySelector(".user_picture");
const balance = document.querySelector(".balance_value");
const cardName = document.querySelector(".card_holder-second");
const totalIncomes = document.querySelector(".incomes_value");
const totalOutcomes = document.querySelector(".outcomes_value");
const transactions = document.querySelector(".transactions_table");
const logoutBtn = document.querySelector(".logout_btn");
const transferBtn = document.querySelector(".transfer_btn button");
const loanBtn = document.querySelector(".loan_btn button");
const errorLoan = document.querySelector(".error_loan");
const errorPayments = document.querySelector(".error_payments");

// Functie afisare balanta cont

const userBalance = () => {
  const total = userData.movements.reduce((acc, cum) => acc + cum, 0);
  return total;
};

// Functie afisare incasari

const incomes = () => {
  return userData.movements
    .filter((a) => a > 0)
    .reduce((acc, cum) => acc + cum, 0);
};

// Functie afisare debitari

const outcomes = () => {
  return userData.movements
    .filter((a) => a < 0)
    .reduce((acc, cum) => acc + cum, 0);
};

// Afisare date in pagina

const displayData = () => {
  // Logged User
  loggedUser.textContent = `${userData.fullName}`;
  // Picture
  userPicture.src = `${userData.picture}`;
  // Balance
  balance.textContent = `$ ${userBalance()}`;
  // Card Name
  cardName.textContent = `${userData.fullName}`;
  // Total incomes
  totalIncomes.textContent = `$ ${incomes()}`;
  // Total outcomes
  totalOutcomes.textContent = `$ ${Math.abs(outcomes())}`;
  // Transactions
  let transactionsHTML = "";

  userData.movements.forEach((element) => {
    const typeOf = element > 0 ? "Deposit" : "Withdrawal";
    const date = new Date();

    transactionsHTML += `<tr class="${typeOf.toLowerCase()}">
              <td>${date.toISOString().split("T")[0]}</td>
              <td>${Math.abs(element)}</td>
              <td>${typeOf}</td>
            </tr>`;
  });

  transactions.innerHTML = `<thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
          ${transactionsHTML}
          </tbody>`;
};

displayData();

// Logout event

logoutBtn.addEventListener("click", function (e) {
  e.preventDefault();
  window.location.href = "index.html";
});

// Make a payment

const payments = () => {
  const amount = Number(document.querySelector("#amount_payment").value);
  const userTotal = userBalance();
  const beneficiaryUser = document.querySelector("#beneficiary").value;

  // Verificam daca suma introdusa este corecta

  if (isNaN(amount) || amount <= 0) {
    errorPayments.style.opacity = 1;
    errorPayments.textContent = "Please enter a valid amount for the transfer.";
    errorLoan.style.opacity = 0;
    return;
  }

  // verificam daca suma este mai mica sau egala cu balanta userului logat

  if (amount > userTotal) {
    errorPayments.style.opacity = 1;
    errorPayments.textContent =
      "The entered amount exceeds the account balance.";
    errorLoan.style.opacity = 0;
    return;
  }

  // Cautam beneficiarul in lista de conturi

  console.log(beneficiaryUser);

  const beneficiaryAccount = accounts.find(
    (account) => account.userName === beneficiaryUser
  );

  if (!beneficiaryAccount) {
    errorPayments.style.opacity = 1;
    errorPayments.textContent = "The beneficiary was not found.";
    errorLoan.style.opacity = 0;
    return;
  }

  // Adaugam suma in lista de conturi

  beneficiaryAccount.movements.push(Number(amount));
  console.log(beneficiaryAccount);

  // Retragem suma din contul celui care transfera

  userData.movements.push(-Number(amount));

  // Actualizam localStorage

  localStorage.setItem("accounts", JSON.stringify(accounts));
  localStorage.setItem("loggedInUser", JSON.stringify(userData));

  errorPayments.style.opacity = 0;

  displayData();
};

// Transfer event

transferBtn.addEventListener("click", function (e) {
  e.preventDefault();
  payments();
});

// Take a Loan

const loan = () => {
  const amount = document.querySelector("#amount").value;
  const period = document.querySelector("#period").value;
  const userTotal = userBalance();
  // Verificam ca valoarea introdusa sa fie un numar si sa nu fie mai mic sau egal ca 0

  if (isNaN(amount) || amount <= 0) {
    errorLoan.style.opacity = 1;
    errorLoan.textContent = "Invalid amount.";
    errorPayments.style.opacity = 0;
    return;
  }

  // Verificam va perioada introdusa este corecta

  if (isNaN(period) || period <= 0 || period > 5) {
    errorLoan.style.opacity = 1;
    errorLoan.textContent = "Invalid period.";
    errorPayments.style.opacity = 0;
    return;
  }

  // Algoritm creditare suma
  const lastPayment = userData.movements.filter((el) => el > 0).pop();
  const maxAmount = lastPayment / 10;
  console.log(lastPayment);
  console.log(maxAmount);

  if (amount <= maxAmount) {
    userData.movements.push(+amount);
    errorLoan.style.opacity = 0;
    errorPayments.style.opacity = 0;
  } else {
    errorLoan.style.opacity = 1;
    errorPayments.style.opacity = 0;
    errorLoan.textContent =
      "The requested amount cannot be more than 10% of your last deposit.";
    errorLoan.style.fontSize = "1.2rem";
    errorLoan.style.textAling = "center";
  }

  displayData();
};

loanBtn.addEventListener("click", (e) => {
  e.preventDefault();
  loan();
});

