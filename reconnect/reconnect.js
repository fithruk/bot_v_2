const retry = require("retry");

async function fetchWithRetry(url, options) {
  return new Promise((resolve, reject) => {
    const operation = retry.operation({
      retries: 5,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 30000,
    });

    operation.attempt(async (currentAttempt) => {
      try {
        const response = await fetch(url, options);
        if (response.ok) {
          const data = await response.json();
          resolve(data);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        if (operation.retry(error)) {
          console.log(`Attempt ${currentAttempt} failed. Retrying...`);
          return;
        }
        reject(operation.mainError());
      }
    });
  });
}

module.exports = { fetchWithRetry };
