//1 select all element
const country_Name=document.querySelector(".country-box .loading");
const totalCases=document.querySelector(".total-cases .value");
const infectedCases=document.querySelector(".infected .value");
const recoveredCases=document.querySelector(".recovered .value");
const deathsCases=document.querySelector(".deaths .value");
const ctx = document.getElementById("axes_line_chart").getContext("2d");

//2  variables
let total=[],
cases_data=[],
recovered_data=[],
death_data=[],
infected_list=[],
dates=[];
formatedDates=[];
// get user country code
let country_name= geoplugin_countryName();
let user_country;
country_list.forEach(country=>{
    if(country.name=country_name){
        user_country=country.name;
    }
    console.log(user_country);
});

// 3 fetch ApI
function fetchData(country) {
  user_country = country;
  country_Name.innerHTML = "Loading...";

  (cases_list = []),
    (recovered_list = []),
    (deaths_list = []),
    (infected_list=[]),
    (dates = []),
    (formatedDates = []);

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  const api_fetch = async (country) => {
    await fetch(
      "https://api.covid19api.com/total/country/" +
        country +
        "/status/confirmed",
      requestOptions
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.forEach((entry) => {
          dates.push(entry.Date);
          cases_list.push(entry.Cases);
        });
      });

    await fetch(
      "https://api.covid19api.com/total/country/" +
        country +
        "/status/recovered",
      requestOptions
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.forEach((entry) => {
          recovered_list.push(entry.Cases);
        });
      });

    await fetch(
      "https://api.covid19api.com/total/country/" + country + "/status/deaths",
      requestOptions
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.forEach((entry) => {
          deaths_list.push(entry.Cases);
        });
      });
     

     updateUI();
  };

  api_fetch(country);
}

fetchData(user_country);
function updateUI() {
  updateStats();
 axesLinearChart();
}
function updateStats() {
  const total_cases = cases_list[cases_list.length - 1];
 

  const total_recovered = recovered_list[recovered_list.length - 1];
  const infected_cases = total_cases - total_recovered;
//   const new_recovered_cases =
    // total_recovered - recovered_list[recovered_list.length - 2];

  const total_deaths = deaths_list[deaths_list.length - 1];
  
//   const new_deaths_cases = total_deaths - deaths_list[deaths_list.length - 2];

  country_Name.innerHTML = user_country;
  totalCases.innerHTML = total_cases;
//   new_cases_element.innerHTML = `+${new_confirmed_cases}`;
  recoveredCases.innerHTML = total_recovered;
//   new_recovered_element.innerHTML = `+${new_recovered_cases}`;
  deathsCases.innerHTML = total_deaths;
//   new_deaths_element.innerHTML = `+${new_deaths_cases}`;
infectedCases.innerHTML = infected_cases;
dates.forEach((date) => {
    formatedDates.push(formatDate(date));
  });
}


let my_chart;
function axesLinearChart() {
  if (my_chart) {
    my_chart.destroy();
  }

  my_chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Cases",
          data: cases_list,
          fill: false,
          borderColor: "black",
          backgroundColor: "black",
          borderWidth: 1,
        },
        {
          label: "Recovered",
          data: recovered_list,
          fill: false,
          borderColor: "#009688",
          backgroundColor: "#009688",
          borderWidth: 1,
        },
        {
          label: "Deaths",
          data: deaths_list,
          fill: false,
          borderColor: "#f44336",
          backgroundColor: "#f44336",
          borderWidth: 1,
        },
      ],
      labels: formatedDates,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}
const monthsNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(dateString) {
  let date = new Date(dateString);

  return `${date.getDate()} ${monthsNames[date.getMonth() - 1]}`;
}
