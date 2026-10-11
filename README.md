# VakeelAI-AI-Powered-Contract-Analysis-API
An AI-powered contract analysis API built with FastAPI, Google Gemini, and MongoDB. Upload PDF or TXT contracts to extract key clauses, identify potential legal risks, assess overall risk levels, and generate actionable recommendations.
# Intro of the Project:
Good morning, everyone.

I would like to explain my project, **Vakeel AI — an AI-Powered Contract Analysis Application**.

The main purpose of this project is to help users understand legal contracts more easily. Legal documents often contain complex language, important clauses, and potential risks. My application uses AI to analyze these documents and present the information in a simpler and more understandable format.

**Let me explain the complete working flow of my project.**

First, the user opens the frontend application, which is developed using React and JavaScript. The user can upload a contract and request its analysis through the interface.

When the user submits a request, the frontend communicates with the backend through REST APIs. I developed the backend using Python and FastAPI.

The backend receives the request, validates the input, and processes the contract according to the application's workflow. The Google Gemini API is integrated to generate AI-powered insights from the contract, such as its summary, important clauses, and potential risks.

Once the analysis is generated, the application stores contract and analysis records in MongoDB Atlas. I use separate collections named `contracts` and `analyses` to organize this data.

The backend then returns the appropriate response to the frontend. React displays the available contract information and analysis results to the user. The application also supports viewing stored contract and analysis records through its available history features.

For deployment, I hosted the React frontend on Vercel and the FastAPI backend on Render. MongoDB Atlas is used as the cloud database. I also configured the production API URL and CORS settings so that the deployed frontend can communicate with the backend.

One of the challenges I faced was configuring the production environment. Initially, the frontend could not communicate properly with the deployed backend because of a CORS configuration issue. I investigated the problem, updated the allowed frontend origin, and redeployed the backend. After that, I verified that the application was working end to end.

**Overall, this project helped me gain practical experience with full-stack development, REST API integration, Generative AI, database management, debugging, and cloud deployment.**

Thank you.

# What is Vakeel AI, and what problem does it solve?
Vakeel AI is an AI-powered contract analysis application that helps users understand legal documents more easily. It uses Google Gemini to generate insights from contracts, such as summaries, important clauses, and potential risks. The main goal is to make complex legal information easier to understand.”

- Possible follow-up: Is it a replacement for a lawyer?
“No, it is an assistance tool. Its output should be reviewed carefully, and important legal decisions should be discussed with a qualified lawyer.”

# Explain the complete architecture and working flow.
“The application has three main components: frontend, backend, and database.
The frontend is built using React and JavaScript. It sends requests to the FastAPI backend through REST APIs. The backend processes the request and integrates with the Google Gemini API for AI-powered analysis. Contract and analysis records are stored in MongoDB Atlas. Finally, the backend returns the response, which the frontend displays to the user.
The frontend is deployed on Vercel, the backend on Render, and the database is hosted on MongoDB Atlas.”

# Why did you choose FastAPI for the backend?
“I chose FastAPI because it makes it easy to develop REST APIs using Python. It provides request validation, automatic API documentation through Swagger UI, and support for asynchronous endpoints. It also integrates well with AI services and Python libraries.”

- If they ask: What is Swagger UI?
“Swagger UI is an interactive API documentation interface where we can view endpoints, understand their parameters, and test API requests.”

# How does Google Gemini work in your project?
“I integrated the Google Gemini API to generate AI-powered contract insights. The backend sends the relevant contract content to the model through an API request. Gemini processes the input and generates a response, which the application uses to present information such as the contract summary, clauses, and potential risks.”

- If they ask: Why Gemini instead of building your own model?
“Training a language model from scratch requires significant data, computing resources, and time. Using Gemini allowed me to integrate existing generative AI capabilities into my application.”

- If they ask: Can Gemini give incorrect answers?
“Yes. Generative AI can produce inaccurate or incomplete information. That is why the output should be treated as assistance rather than guaranteed legal advice.”

# How do you store and retrieve data using MongoDB?
“I used MongoDB Atlas as the cloud database. In my project, the mydb database contains separate contracts and analyses collections. These collections organize contract records and their corresponding analysis records. The backend interacts with the database to store and retrieve information.”

- If they ask: What is the difference between a database and a collection?
“A database contains collections, and a collection contains documents. A document is a record stored in a JSON-like format called BSON in MongoDB.”

- If they ask: Why MongoDB instead of MySQL?
“MongoDB stores data in a flexible document structure, which is useful when working with application records and AI-generated responses that may have varying fields.”

# What is a REST API, and how does React communicate with FastAPI?
“A REST API allows different parts of an application to communicate over HTTP. In my project, React sends HTTP requests to FastAPI endpoints. The backend processes the requests and returns responses, commonly in JSON format.”

- If they ask: What is JSON?
“JSON is a lightweight data format used to exchange structured information between the frontend and backend.”

# What deployment challenges did you face?
“One major challenge was connecting the deployed frontend to the deployed backend. Initially, the browser could not access the API because the production frontend origin was not properly allowed by the backend's CORS configuration.
I investigated the issue, checked the API and preflight response, updated the allowed origin in the backend configuration, and redeployed the backend. After deployment, I tested the live application again.”

- If they ask: What is CORS?
“CORS stands for Cross-Origin Resource Sharing. Browsers use it to control whether a frontend from one origin can access resources from a different origin. The backend must allow the appropriate frontend origin.”

- If they ask: Why did it work locally but not in production?
“Localhost and the deployed website have different origins. Production also requires correct API URLs, environment variables, CORS settings, and deployment configuration.”

# How do you handle errors and protect sensitive information?
“I use backend validation and error handling to manage invalid requests and failures. For deployment, environment variables are used for sensitive configuration, such as API keys and database connection strings, instead of hardcoding these values in the source code.”

- If they ask: What happens if Gemini or MongoDB is unavailable?
“The application should handle the failure gracefully, return an appropriate error response, and avoid exposing internal details or credentials. I would also use logs to identify the cause.”
Be prepared to explain the exact error-handling and validation mechanisms present in your code.

# What are the limitations, and how would you improve this project?
“Currently, the application depends on the quality of the contract content and the AI model's output. AI-generated insights may not always be accurate, so legal verification is important. In the future, I would improve the application with stronger document validation, more robust error handling, authentication and authorization, better testing, and more reliable evaluation of the AI-generated results.”

- If they ask: How would you make it production-ready?
“I would focus on secure authentication, access control for uploaded contracts, file validation, safe handling of sensitive documents, monitoring, automated tests, and evaluating the accuracy of the AI responses.”

# What was your individual contribution to this project?
“Vakeel AI is my individual project, and I developed it end to end.

I initially focused on building the backend using Python and FastAPI. I implemented the API workflows, integrated the Google Gemini API for AI-powered contract analysis, and connected MongoDB Atlas to store contract and analysis records.

After completing the backend, I developed the frontend using React and JavaScript and connected it to the backend through REST APIs.

I also deployed the frontend on Vercel and the backend on Render, configured the production environment, and resolved deployment issues related to API connectivity and CORS.

This project gave me hands-on experience in full-stack development, Generative AI integration, database management, and end-to-end deployment.”
