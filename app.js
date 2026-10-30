
const API_URL =
  "https://ap38znmti0.execute-api.ap-south-1.amazonaws.com/calculate";

const HISTORY_URL =
  "https://ap38znmti0.execute-api.ap-south-1.amazonaws.com/history";

const form = document.getElementById("calculator-form");
const button = document.getElementById("calculate-button");
const message = document.getElementById("message");
const resultCard = document.getElementById("result-card");
const resultValue = document.getElementById("result-value");
const summary = document.getElementById("calculation-summary");

const historyButton = document.getElementById("history-button");
const historyCard = document.getElementById("history-card");
const historyMessage = document.getElementById("history-message");
const historyList = document.getElementById("history-list");

const symbols = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷"
};

// Verify that index.html contains all required elements.
if (
  !form || !button || !message || !resultCard ||
  !resultValue || !summary || !historyButton ||
  !historyCard || !historyMessage || !historyList
) {
  console.error(
    "Required HTML elements are missing. Check index.html IDs."
  );
} else {
  // Perform a calculation and save it through Lambda.
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    message.textContent = "";
    message.className = "message";
    resultCard.hidden = true;

    const num1 = Number(document.getElementById("num1").value);
    const num2 = Number(document.getElementById("num2").value);
    const operation = document.getElementById("operation").value;

    if (!Number.isFinite(num1) || !Number.isFinite(num2)) {
      message.textContent = "Please enter valid numbers.";
      message.classList.add("error");
      return;
    }

    if (operation === "divide" && num2 === 0) {
      message.textContent = "You cannot divide by zero.";
      message.classList.add("error");
      return;
    }

    button.disabled = true;
    button.textContent = "Calculating…";
    message.textContent = "Sending your calculation to AWS…";

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ num1, num2, operation })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || data.message ||
          `Request failed (${response.status})`
        );
      }

      const calculation = data.calculation;

      if (!calculation || calculation.result == null) {
        throw new Error("The API returned an invalid calculation result.");
      }

      const resultNumber = Number(calculation.result);

      resultValue.textContent = Number.isFinite(resultNumber)
        ? String(Number(resultNumber.toPrecision(12)))
        : String(calculation.result);

      summary.textContent =
        `${num1} ${symbols[operation]} ${num2}`;

      resultCard.hidden = false;
      message.textContent = "Calculation completed successfully.";
      message.classList.add("success");

      // Refresh history separately so a history error
      // does not undo a successful calculation.
      if (!historyCard.hidden) {
        loadHistory();
      }
    } catch (error) {
      message.textContent =
        `Could not complete the calculation: ${error.message} ` +
        "Check API Gateway, Lambda, and CORS.";
      message.classList.add("error");
    } finally {
      button.disabled = false;
      button.textContent = "Calculate result";
    }
  });

  // Retrieve saved calculations from DynamoDB through Lambda.
  async function loadHistory() {
    historyCard.hidden = false;
    historyMessage.textContent = "Loading history...";
    historyMessage.className = "message";
    historyList.replaceChildren();
    historyButton.disabled = true;

    try {
      const response = await fetch(HISTORY_URL, {
        method: "GET"
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || data.message ||
          `Request failed (${response.status})`
        );
      }

      if (!Array.isArray(data.history)) {
        throw new Error("The API response does not contain a history array.");
      }

      const records = data.history;

      if (records.length === 0) {
        historyMessage.textContent = "No saved calculations found.";
        return;
      }

      historyMessage.textContent =
        `Showing ${records.length} recent calculation(s).`;

      records.forEach((item) => {
        const entry = document.createElement("div");
        entry.className = "history-item";

        const calculation = document.createElement("strong");
        calculation.className = "history-calculation";

        const symbol = symbols[item.operation] || item.operation || "?";

        calculation.textContent =
          `${item.num1} ${symbol} ${item.num2} = ${item.result}`;

        const details = document.createElement("span");
        details.className = "history-details";

        const date = new Date(item.timestamp);

        details.textContent =
          item.timestamp && !Number.isNaN(date.getTime())
            ? date.toLocaleString()
            : "Date unavailable";

        entry.append(calculation, details);
        historyList.appendChild(entry);
      });
    } catch (error) {
      historyMessage.textContent =
        `Could not load history: ${error.message}. ` +
        "Check GET /history, its Lambda integration, and CORS.";
      historyMessage.classList.add("error");
    } finally {
      historyButton.disabled = false;
    }
  }

  historyButton.addEventListener("click", loadHistory);
}
