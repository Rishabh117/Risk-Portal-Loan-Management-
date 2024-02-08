async function fetchData() {
  const response = await fetch ('applicants.json');
  const data = await response.json();
  return data.applicants;
}


// Function to search for an applicant by ID or Name
function searchApplicant(applicants, searchTerm) {
  return applicants.find(applicant =>
    applicant.applicant_id === parseInt(searchTerm) ||
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}


// Function to display applicant summary
function displayApplicantSummary(applicant) {
  const summarySection = document.getElementById('summarySection');
  summarySection.innerHTML = `
    <h2>Applicant Information</h2>
    <p>Name: ${applicant.name}</p>
    <p>Age: ${applicant.age}</p>
    <p>Income: $${applicant.income}</p>
    <p>Credit Score: ${applicant.credit_score}</p>
  `;


  // Display loan details
  const loanDetailSection = document.getElementById('loanDetailSection');
  loanDetailSection.innerHTML = `
    <h2>Loan Details</h2>
    <p id="loanAmt">Loan Amount Requested: $${applicant.loan_amount_requested}</p>
    <p id="loanTerm">Loan Term: ${applicant.loan_term} months</p>
    <p id="interestRate">Interest Rate: ${applicant.interest_rate}%</p>
  `;
}

// Function to handle loan approval
function approveLoan(applicant) {
  alert(`Loan for ${applicant.name} approved.`);
}


// Function to handle loan denial
function denyLoan(applicant) {
  alert(`Loan for ${applicant.name} denied.`);
}


// Function to handle loan modification
function modifyLoan(applicant, newLoanAmount, newLoanTerm, newInterestRate) {
  // Parse input values as numbers
  newLoanAmount = parseFloat(newLoanAmount);
  newLoanTerm = parseInt(newLoanTerm);
  newInterestRate = parseFloat(newInterestRate);

  // Update the loan details in the HTML
  const loanDetailSection = document.getElementById('loanDetailSection');
  loanDetailSection.innerHTML = `
    <h2>Loan Details</h2>
    <p>Loan Amount Requested: $${newLoanAmount}</p>
    <p>Loan Term: ${newLoanTerm} months</p>
    <p>Interest Rate: ${newInterestRate}%</p>
  `;


  // Update the loan details in the applicant object
  applicant.loan_amount_requested = newLoanAmount;
  applicant.loan_term = newLoanTerm;
  applicant.interest_rate = newInterestRate;


  alert(`Loan terms for ${applicant.name} modified.`);
}




// Function to calculate monthly payment
function calculateMonthlyPayment(loanAmount, loanTerm, interestRate) {
  if (loanTerm === 0 || interestRate === 0) {
    return 0; // Return 0 if loan term or interest rate is 0 to avoid division by zero
  }
  const monthlyInterestRate = interestRate / 100 / 12;
  const numPayments = loanTerm;
  const monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numPayments));
  if (!isFinite(monthlyPayment)) {
    return 0; // Return 0 if monthly payment is not finite
  }
  return monthlyPayment.toFixed(2);
}


// Function to calculate total payment
function calculateTotalPayment(monthlyPayment, loanTerm) {
  const totalPayment = monthlyPayment * loanTerm;
  if (!isFinite(totalPayment)) {
    return 0; // Return 0 if total payment is not finite
  }
  return totalPayment.toFixed(2);
}

// Main function
async function main() {
  const applicants = await fetchData();


  document.getElementById('searchInput').addEventListener('input', function() {
    const searchTerm = this.value.trim();
    if (searchTerm === '') {
      return;
    }
    const applicant = searchApplicant(applicants, searchTerm);
    if (applicant) {
      displayApplicantSummary(applicant);
    } else {
      alert('Applicant not found');
    }
  });


  document.getElementById('approveBtn').addEventListener('click', function() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const applicant = searchApplicant(applicants, searchTerm);
    if (applicant) {
      approveLoan(applicant);
    } else {
      alert('Applicant not found');
    }
  });


  document.getElementById('denyBtn').addEventListener('click', function() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const applicant = searchApplicant(applicants, searchTerm);
    if (applicant) {
      denyLoan(applicant);
    } else {
      alert('Applicant not found');
    }
  });


  document.getElementById('modifyBtn').addEventListener('click', function() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const applicant = searchApplicant(applicants, searchTerm);
    if (applicant) {
      const newLoanAmount = document.getElementById('loanAmt').innerText.split(24);
      const newLoanTerm = document.getElementById('loanTerm').innerText.split(24,26);
      const newInterestRate = document.getElementById('interestRate').innerText.split(24,28);
      modifyLoan(applicant, newLoanAmount, newLoanTerm, newInterestRate);
    } else {
      alert('Applicant not found');
    }
});

  

  document.getElementById('calculateBtn').addEventListener('click', function() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    const applicant = searchApplicant(applicants, searchTerm);
    if (applicant) {
      const newLoanAmount = parseFloat(document.getElementById('loanAmt').innerText.split('$')[1]);
      console.log(document.getElementById('loanAmt').innerText);
      const newLoanTerm = parseFloat(document.getElementById('loanTerm').innerText.split(':')[1].trim().split(' ')[0]);
      const newInterestRate = parseFloat(document.getElementById('interestRate').innerText.split(':')[1].trim().split('%')[0]);
      const monthlyPayment = calculateMonthlyPayment(newLoanAmount, newLoanTerm, newInterestRate);
      const totalPayment = calculateTotalPayment(monthlyPayment, newLoanTerm);
      alert(`Monthly Payment: $${monthlyPayment}\nTotal Payment: $${totalPayment}`);
    } else {
      alert('Applicant not found');
    }
  });
}


main();
