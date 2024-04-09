<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


# NestJS E-commerce Backend

This project is a backend application built with NestJS, a powerful framework for building efficient, reliable, and scalable server-side applications. It serves as the backbone for an e-commerce platform, providing essential functionality for managing products.

## Features

- **CRUD Operations:** Perform Create, Read, Update, and Delete operations for products.
- **Authentication System:** Utilizes JWT (JSON Web Tokens) for secure authentication, ensuring that only authorized users can access protected endpoints.
- **Pagination:** Implements pagination to efficiently handle large datasets, improving performance and user experience.

## Technologies Used

- **NestJS:** A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **TypeScript:** A statically typed superset of JavaScript that compiles to plain JavaScript.
- **JWT (JSON Web Tokens):** A compact, URL-safe means of representing claims to be transferred between two parties.
- **Swagger:** A powerful tool for API documentation, allowing developers to describe and document RESTful APIs.
- **PostgreSQL:** A powerful, open-source relational database system.
- **TypeORM:** An Object-Relational Mapping (ORM) library for TypeScript and JavaScript.


## Getting Started

* **1. Clone the project:** Clone the repository using `git clone`.
* **2. Install dependencies:** Run `yarn install` to install project dependencies and go to front-end folder and exec `yarn install` as well (if you can't install the modules this project was make with node 18 switch the version and try again)
* **3. Configure the .env file:** Clone the `.env.template` file and rename it to `.env`. Fill in the necessary values in the `.env` file.
* **4. Start the database:** Use Docker Compose to start the PostgreSQL database. Run `docker-compose up -d`.
* **5. Start the application in development mode:** Launch the application in development mode by running `yarn dev`.
* **6. Execute seed:** Access `http://localhost:3000/api/seed` to execute the seed and populate the database with sample data.


## Usage

- **API Documentation with Swagger:** Explore available endpoints and their usage in the API documentation `http://localhost:3000/api/`.
- **API Documentation with Postman:** This project include a Postman file `postman.json`

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your improvements.

## License

This project is licensed under the [MIT License](LICENSE).
