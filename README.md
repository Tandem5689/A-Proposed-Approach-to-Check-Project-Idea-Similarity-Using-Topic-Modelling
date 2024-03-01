
# Project Idea Buddy

This project aims to alleviate the burden on professors and students in recalling past final year projects by developing a portal that utilizes NLP models to compare project abstracts with stored project blackbooks. By inputting project abstracts, the system checks for similarity with previous projects stored on cloud-based storage, aiding in avoiding duplication and encouraging exploration of new research avenues through topic and semantic similarity analysis.



## Features

- Search feature to search for projects based on domain as well as techniques.
- Exhaustive comparison of a new abstract with the existing projects to get a complete summary of what work has been done on the topic previously.
- Get a complete overview of a project and also be able to access the whitebook if needed.
- Web crawlers to get recent articles or papers related to the project idea and also recommendations from previous projects to refer to.


## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory


Install dependencies for React Application

```bash
  npm install
```

Install dependencies for Flask Server

```bash
  pip install -r requirements.txt
```

Start the Flask Server First (Default Port-5000)

```bash
  python APIs.py
```
Start the React Application (Default Port - 3000)

```bash
  npm start
```

