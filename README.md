
<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/knaxel/Climb-Grader">
    <img src="https://github.com/knaxel/Climb-Grader/blob/main/public/images/logo_light.png?raw=true" alt="Logo" width="150" height="150">
  </a>

  <h1 align="center">Climb Grader</h1>

[![LinkedIn][linkedin-shield]][linkedin-url]

[linkedin-url]: https://www.linkedin.com/in/e-m-
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

  <p align="center">
    A web application connecting in-person climbing gym patrons. A working example of NodeJS being used for human computer interaction. 
  </p>
  <p align="">
    Imagine you own a rock climbing gym and you want to encourage your patrons to provide feedback on the climbing routes provided. 
    Climb Grader allows you to put up simple QR-codes next to the climbing route as you normally would with difficulty ratings.
    These QR codes allow members to virtually review, grade, and ultimately providing you and your route setters valuable gym member feedback on the variety of climbing routes and opportunities in the gym.
  </p>
  
<!-- [![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/8IIgYCVqt5k/0.jpg)](https://www.youtube.com/watch?v8IIgYCVqt5k) -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

- NodeJS 
- ExpressJs
- HandleBarsJS
- MongoDB
- skeleton.css

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

- [npm](https://www.npmjs.com) 

- [express](https://www.npmjs.com/package/express)
- [express-handlebars](https://www.npmjs.com/package/express-handlebars)
- [Express Session](https://www.npmjs.com/package/express-session)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [MongoDB](https://www.mongodb.com) 

DataBase Collections Schema in JSon
```json
{
  "gyms" : [{
    "_id": "ObjectId()",
    "date_created" : "2022-06-15T05:17:56.653+00:00",
    "name" : "The Climbing Gyms Name",
    "gym_associate" :  "62a96b842e99e2ac7707ce69",
    "setter_code" : "XXXXXX"
  }],
  "routes" : [{
    "_id" : "ObjectId()",
    "gym_code" : "ObjectID('Gym ID')",
    "date_created" : "2022-01-01T00:00:00.000+00:00",
    "expire_at" : "2022-01-31T00:00:00.000+00:00",
    "climb_code" : "123456",
    "setter_name" : "Mr.RouteSetter",
    "grade" : {
      "system": "V-Scale",
      "setter" : "5"
    },
    "votes" : [{
      "id": "ObjectId('Mr.RouteSetter ID')",
      "grade" : "5"
    }]
  }],
  "users" : [
    "_id" : "ObjectId()",
    "last_ip" :  "192.168.0.110",
    "date_created" : "2022-06-15T05:20:05.367+00:00",
    "email" : "email@gmail.com",
    "definitely_not_a_password_hash" : "$2b$10$FfjtEF7ONncUoWRObUCUz.LZZbaHtiuMjzl1YB0tvNTVO3s6ZgjBC",
    "definitely_not_a_password_salt" : "$2b$10$FfjtEF7ONncUoWRObUCUz.",
    "gyms" :  [{
      "0" : "62a96c055438f5c080486dbc"
    }]
  }]
}
```
  

### Installation

_Below is instruction how to start running the web-app._

1. (have npm first) Clone the repo
   ```sh
   git clone https://github.com/your_username_/Project-Name.git
   ```
2. Install/Update NPM packages
   ```sh
   npm install
   ```
3. Enter your MongoDB Connection String in a new file at `private/.env`
   ```js
   CONNECTION_STR='MONGODB CONNECTION STRING';
   ```
4. Start with npm
   ```sh
   npm start
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [x] Main logo/webdesign with user accounts
- [x] Gym QR codes and climbing route setter QR Codes
- [x] Captcha check (spam reduction)
- [x] Individual user ratings by IP or Account (spam reduction)
- [x] Gym's and gym climbing routes expirations
- [x] user ratings statistics
- [ ] Add full list of gym routes
- [ ] Let gym owners upload indoor map of the gym 
  - [ ] Uploading of gym map image
  - [ ] Categorize climbing routes by walls

<!-- LICENSE -->
## License

Copyright 2023 Emerson Philipp

All rights reserved. This work may not be reproduced or redistributed in whole or in part without express written permission from [your name].

This repository is provided for educational and informational purposes only. Any use of the code or content within this repository is at your own risk. [Your name] makes no representations or warranties about the suitability, completeness, timeliness, reliability, legality, or accuracy of the code or content within this repository.

<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/othneildrew/Best-README-Template.svg?style=for-the-badge
[contributors-url]: https://github.com/othneildrew/Best-README-Template/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/othneildrew/Best-README-Template.svg?style=for-the-badge
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=for-the-badge
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 


