# Reactify-University-System

Reactify University System is a front-end application built using JavaScript, React and CSS, designed to interact with a university registration REST API. It allows users to view and manage university data such as degrees, cohorts, modules, and students through an intuitive, well-structured interface.

## Features
- **View Degrees**: Browse a list of all available degrees. Each degreehas a dedicated page that includes all related cohorts, providing a detailed overview of all the degree's structure.
- **View Cohorts**: Explore all cohorts associated with a degree. The system allows users to drill down into specific cohorts to view associated students and modules.
- **Student Information**: View individual student details, including enrolled modules and grades, through dynamically generated pages. The system supports creating new students and viewing their assigned data in real-time.
- **Module Management**: Access detailed information on all modules, including the ability to view students registered for each module and the cohorts receiving those modules.
- **Creation Pages**: Seamlessly create new degrees, cohorts, modules, and students using the React interface, with automatic redirection to relevant pages upon successful creation.
- **API Integration**: The application leverages Rest API endpoints to fetch and display data in real-time, providing an efficient and responsive user experience.

## Getting Started

### Prerequisites:
- Node.js
- Node packages (package.json)
- React
- Python 3.x
- Python libraries (requirements.txt)

### Installation:

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone https://github.com/PjayEvangelio/Reactify-University-System.git
   cd Reactify-University-System

2. Navigate to the "universityrestapi" directory and install required Python libraries:
   ```bash
   cd universityrestapi
   pip install -r requirements.txt

3. Start the university registration REST API server:
   ```bash
   python3 manage.py runserver

4. The REST API is available at:
   ```bash
   http://127.0.0.1:8000

5. In a new terminal, navigate to the "frontend" directory:
   ```bash
   cd ../frontend

6. Install front-end dependencies and start the React development server:
   ```bash
   npm install
   npm start

7. Access the Reactify-University-System front-end by visiting:
   ```bash
   http://localhost:3000
  
## Project Stewardship
- Head Maintainer: Patrick John Evangelio

## Getting Assitance
If you run into any challenges or have inquiries regarding this project, you can:
- Create an issue in the [GitHub Issues](https://github.com/PjayEvangelio/Reactify-University-System/issues) section.
- Contact the Head Maintainer (me) directly via email for support.

## References

### Acknowledgements:
A big thanks to [Dr. Michael Scriney](https://www.dcu.ie/computing/people/michael-scriney) for providing the university REST API used as the back-end for this project.
