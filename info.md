# Q. Why did you separate routes and services?
- Routes handle HTTP requests and responses. Services contain reusable application logic, such as extracting document text or calling Gemini. This separation makes the application easier to maintain and test.

# Q. Why use Pydantic?
- Pydantic validates data against defined types and schemas. For example, RiskFlag expects a risk title, description, risk level, and recommendation. It helps detect incorrectly structured data.

# Q. What is an Enum?
- An Enum restricts a value to a predefined set of options. Your RiskLevel enum allows low, medium, high, or critical.

# Q. Why use a .env file?
- It keeps configuration and sensitive values, such as API keys and database credentials, outside the main source code. The .env file should not be committed to a public repository.

# Q. Why use UUIDs for filenames?
- Your upload code generates a unique filename so two uploaded documents with the same original filename are less likely to overwrite one another. The original filename is retained separately for display.

# 4. The complete request flow — the most important part
This is what you must understand if an interviewer asks, “Explain how your project works internally.”

## Phase A — Upload a contract
1. The user sends a PDF or TXT file to POST /contracts/upload.
2. contracts.py checks the file extension and whether the file exceeds the 10 MB limit.
3. The uploaded bytes are written to the local uploads/ directory using a unique filename.
4. document_parser.py extracts the text. PyPDF2 reads PDF pages; Python's file reading handles TXT.
5. A Contract Pydantic object is created with the filename, text, page count, word count, and upload metadata.
6. The contract metadata and extracted text are inserted into MongoDB's contracts collection. The endpoint returns the contract ID.

## Phase B — Analyze the contract
7. The client sends the returned ID to POST /analysis/analyse/{contract_id}.
8. analysis.py checks the Gemini API key, validates the MongoDB ObjectId, retrieves the contract, and checks that extracted text exists.
9. The contract's analysis status is changed to in_progress.
10. gemini_analyse.py inserts the extracted text into CONTRACT_ANALYSIS_PROMPT and sends it to Gemini asynchronously.
11. Gemini returns text intended to be a JSON object. The code parses it using json.loads() and builds ClauseAnalysis, RiskFlag, and AnalysisResult objects.
12. The analysis is stored in MongoDB's separate analyses collection. The contract status is updated to completed, and the response contains the analysis.

# 5. Understand the two MongoDB collections
Think of them as two separate tables, although MongoDB stores documents rather than relational rows.

1. contracts collection
Stores the uploaded contract and its extracted text.
_id: ObjectId("...")
filename: "unique-name.txt"
original_name: "sample_nda.txt"
text_content: "...contract text..."
word_count: 550
status: "uploaded"
analysis_status: "completed"



2. analyses collection
Stores the AI-generated results separately, linked by contract_id.
_id: ObjectId("...")
contract_id: "contract123"
contract_type: "NDA"
overall_risk_level: "medium"
key_clauses: [...]
risk_flags: [...]
recommendations: [...]

# Why didn't you use RAG here?
The main requirement of Vakeel Contracts API is to analyze an individual contract and return predefined information, such as key clauses, risk flags, and recommendations. For this requirement, I used direct Gemini prompting with structured output.

In a RAG system, I would split the document into chunks, create embeddings, and retrieve relevant passages based on a user's query. That approach is particularly useful when users need to ask different questions about long documents or search across many documents.

RAG could be a future enhancement for Vakeel if we need clause-level retrieval, question answering, or analysis across a large collection of contracts.

- I used Docker Compose to run MongoDB in a consistent environment without having to manually manage the database installation. The named volume helps preserve database data, and port mapping allows my local FastAPI application to connect to the container.

# Why did you choose FastAPI?
- FastAPI is a python framework for building API's. It support asunchronous endpoints, request  validation, and automatic interactive API documentation through Swagger UI.

# What is REST API?
- A REST API allows clients and servers to communicate over HTTP using methods such as GET, POST, PUT and DELETE. My project uses POST to upload and analyze contracts and GET to retrieve records.

# Why MongoDB instead of MySQL?
- MongoDB stores flexible BSON documents and supports nested structures, which fit naturally with caluse lists, risk flags and recommendations, A relational database could also work if stronger realetional constraints were needed.

# What is the difference between a route and a service?
- A route handles the incoming HTTP request. A service performs application logic, such as extracting text or calling Gemini.

# How does Gemini analyze the contract?
- I pass extracted contract text and a structured prompt to Gemini. The model generates the requested fields, which my application aprses and validates before saving the result.

# How do you handle errors?
- I validate file extensions, file size, contract IDs, and the presence of text. During AI analysis status, and return an appropriate HTTP error.

# Why use Pydantic models?
- They define expected data structures and validate field types. For Ex: my RiskFlag model defines the title, description, severity, recommendation, and clause reference.

# How do you identify a contract in MongoDB?
- MongoDB automatically creates an ObjectID for each inserted document. My API returns its string represenatation, which client use in later requests. The string must be converted back to an ObjectId for queries.

# How do you handle long contract?
- My current implementation limits Gemini input to the first 15,000 character. This is a limitation because later clauses may be omitted. I could improve it using chunking, section-based analysis, or a carefully, or a carefully designed reterival approach.

# What are the limitation of my project?
- The AI can produce inaccurate legal interpretations, scanned PDF's may need OCR, lomg contracts may be truncated, and the current API needs stronger authentication and validation before production use.

# How would you improve the project?
- I would add authtication and authorization, OCR, more robust AI output validation, tests, improved logging, and analysis of long contracts withtout silently dropping final sections.

# Can this system replace a lawyer?
- No, it assists with preliminary contract review and highlights potential issues, but legal conclusions and recommendations should be reviewed by a qualified lawyer.
