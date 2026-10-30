# ☁️ Cloud Calculator

A serverless Cloud Calculator built using **AWS Amplify, Amazon API Gateway, AWS Lambda, and Amazon DynamoDB**. The application performs basic arithmetic operations and stores calculation history in a cloud database.

## 📌 Project Overview

The Cloud Calculator is a web application that demonstrates how serverless computing can be used to build and deploy cloud-based applications. Users can perform arithmetic calculations through a simple web interface, while the backend processes requests and stores calculation records.

The project uses AWS managed services to reduce infrastructure management and provide a scalable, cloud-based solution.

## ✨ Features

- **Basic Arithmetic Operations:** Addition, subtraction, multiplication, and division.
- **Serverless Backend:** Processes calculations using AWS Lambda.
- **REST API Integration:** Connects the frontend and backend using Amazon API Gateway.
- **Calculation History:** Stores successful calculations in Amazon DynamoDB.
- **History Retrieval:** Retrieves previously stored calculations.
- **Cloud Hosting:** Hosts the frontend using AWS Amplify.
- **Responsive Interface:** Provides a simple interface using HTML, CSS, and JavaScript.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Structures the calculator interface |
| CSS3 | Styles the application |
| JavaScript | Handles user interactions and API requests |
| Python | Implements backend logic |
| AWS Lambda | Executes calculation and history functions |
| Amazon API Gateway | Provides HTTP API endpoints |
| Amazon DynamoDB | Stores calculation history |
| AWS Amplify | Hosts the frontend |
| AWS IAM | Manages permissions for AWS resources |

## 🏗️ Architecture

The application follows a serverless architecture.

```text
          User
           |
           v
   Web Interface
 (HTML, CSS, JavaScript)
           |
           v
    AWS Amplify
   (Frontend Hosting)
           |
           v
    Amazon API Gateway
           |
           v
      AWS Lambda
   (Python Functions)
       /       \
      v         v
 Perform       Amazon
Calculation   DynamoDB
                 |
                 v
        Calculation History
```

### How It Works

1. The user opens the calculator web application.
2. The user enters two numbers and selects an arithmetic operation.
3. JavaScript sends a request to Amazon API Gateway.
4. AWS Lambda processes the calculation.
5. The result is returned to the frontend.
6. Successful calculations are stored in Amazon DynamoDB.
7. Users can request calculation history through the history endpoint.

## 🔢 Supported Operations

| Operation | Symbol | Example |
|---|---|---|
| Addition | `+` | 10 + 5 = 15 |
| Subtraction | `-` | 10 - 5 = 5 |
| Multiplication | `*` | 10 × 5 = 50 |
| Division | `/` | 10 / 5 = 2 |

Division by zero should be handled as an invalid operation.

## 🔌 API Endpoints

The application uses an Amazon API Gateway HTTP API connected to AWS Lambda.

**Base API URL:**

```text
https://ap38znmti0.execute-api.ap-south-1.amazonaws.com
```

### 1. Calculate

- **Method:** `POST`
- **Endpoint:** `/calculate`
- **Purpose:** Performs an arithmetic calculation and stores the successful result.

Example request body:

```json
{
  "num1": 10,
  "num2": 5,
  "operation": "addition"
}
```

The response contains the calculation result. The exact response structure depends on the Lambda function implementation.

### 2. Retrieve Calculation History

- **Method:** `GET`
- **Endpoint:** `/history`
- **Purpose:** Retrieves stored calculation records from DynamoDB.

The Lambda function retrieves up to 50 records per request and sorts the returned records by timestamp, newest first.

## 📂 Project Structure

```text
CloudCalculatorApp/
│
├── index.html          # Main calculator interface
├── styles.css          # Application styling
├── app.js              # Frontend logic and API integration
├── README.md            # Project documentation
└── .gitignore           # Files excluded from Git
```

If you have also saved the backend code locally, you can include the Lambda Python file in the repository.

## 🚀 Deployment

The project uses the following AWS services:

1. **AWS Amplify:** Deploys and hosts the frontend.
2. **Amazon API Gateway:** Exposes the calculation and history endpoints.
3. **AWS Lambda:** Runs the backend logic without managing servers.
4. **Amazon DynamoDB:** Stores calculation history.
5. **AWS IAM:** Controls access to AWS resources.

The API and frontend must be configured with the correct endpoints and permissions for the application to work properly.

## 💻 Running Locally

### Prerequisites

- A web browser
- Visual Studio Code or another code editor
- An AWS account with the required resources configured
- Git installed (optional, for version control)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/Anshuman101010/Cloud-Calculator.git
   ```

2. Navigate to the project directory:

   ```bash
   cd CloudCalculatorApp
   ```

3. Open `index.html` in your browser, or use the Live Server extension in Visual Studio Code.

4. Ensure that the API URLs in `app.js` point to your deployed API Gateway endpoints.

**Note:** Opening the frontend locally does not deploy the backend. AWS Lambda, API Gateway, and DynamoDB must already be configured and accessible.

## 🔐 Security Considerations

- Use IAM permissions that grant Lambda access only to the required DynamoDB actions and table.
- Avoid committing AWS access keys, secret keys, passwords, or other credentials to GitHub.
- Configure API Gateway CORS to allow the required frontend origin, methods, and headers.
- Consider API throttling and request validation to protect the backend.
- Validate user inputs and handle invalid operations, including division by zero.
- Review access controls before making the application publicly available.

## 🔮 Future Enhancements

- Add scientific calculator functions.
- Improve input validation and error handling.
- Add user authentication.
- Maintain separate calculation histories for individual users.
- Add pagination and filtering to calculation history.
- Improve the interface for mobile devices.
- Add automated testing and monitoring.
- Apply stricter IAM permissions and API access controls.

## 🎯 Learning Outcomes

This project demonstrates practical experience with:

- Serverless application development.
- Frontend-to-backend API integration.
- AWS Lambda function development using Python.
- Data storage and retrieval using Amazon DynamoDB.
- Frontend hosting through AWS Amplify.
- IAM permissions and cloud resource configuration.
- Version control and project documentation using Git and GitHub.

## 👨‍💻 Author

**Anshuman Chakravorty**

B.Tech Computer Engineering

NMIMS University

## 📄 License

This project is intended for educational and academic purposes. Add a license file if you plan to distribute or reuse the project under a specific open-source license.