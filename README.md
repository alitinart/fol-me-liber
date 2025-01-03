<img src="./public/app-gif.gif"/>

# <img src="./public/logo.png" height="34"/> Fol me Liber

**Fol me Liber** is an application that combines the power of AI, ReactJS, and Spring Boot to change the way we interact with books.

This project enables users to analyze books using AI and have conversational interactions with them, offering a unique and engaging learning experience.

## Want to run it?

### Prerequisites

Make sure you have the following available to use in your system:

- Node.js (v16 or later)
- ChromaDB Instance
- MongoDB Database
- Java (SDK 17)
- Maven

### Installation

1. Clone the repo

```bash
  git clone https://github.com/alitinart/fol-me-liber
  cd fol-me-liber
```

2. Setup Frontend

```bash
  cd ./frontend
  npm install
  npm start
```

3. Setup Backend

```bash
  cd backend
```

Go to application.properties and fillout all properties with your information

4. Run Backend

```bash
mvn clean install
mvn spring-boot:run
```

Open your browser and navigate to http://localhost:5173
