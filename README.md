# DDSA Assignment 1 'CoffeeHouse' - Group 3

## How to install
- Things needed to run the application
  - Node
  - MongoDB
  - IDE e.g. Visual Studio Code

- Navigate to folder where you want project to be on your local computer
e.g. `$ cd Desktop/project`

- Git clone repo
`$ git clone https://github.com/millsjoe/shu-group-3.git`

- Install dependencies
`$ npm i`

- To run the application
1. Make sure you have followed the above steps for setup.
2. Open the project in your IDE
3. Run `node app.js`
4. Load 'localhost:3000' in your browser
5. Database is hosted on MongoDB cloud so can be viewed through this link - (account required) https://cloud.mongodb.com/v2/601c020fd7d91e6d2ecf559e#metrics/replicaSet/601c033926a2f814ab92d082/explorer/ddsa

## Development Team:
- Joe Mills
- Lucy Burgin
- Fiona Simons
- Chloe Williams

## Application Summary:
Our applications allows users to search and rate local coffeeshops in their area.

## Technology stack:
- HTML - Front end website
- CSS, Bootstrap - Front end styling of website
- JavaScript - Business logic
- MongoDB - Data retention
- Slack - Group communications
- Trello - Kanban/Project Board management
- GitHub - Source Control 
- Visual Studio Code - Development environment

## Work Approach:

### Agile Methodology - Kanban
As a team we decided to use Kanban as a way of working to follow Agile methodologies as having an open framework helped us adapt the working environment to each individual team member. We created a Kanban board on Trello so we could easy pick up tickets as necessary and where time allowed within our daily work routines. We decided not to follow the Scrum methodology due to its strict ceremonies, however we had regular catch-ups and weekly meetings throughout the development of our project.

To arrange the tasks in order of priority we used MOSCOW (must have, should have, could have and won't have). Each group member could work on any ticket and would then be responsible with completing the work and if this group member was struggling they could pair program with another group member.

### Work strategy
Due to COVID restrictions, we developed this project whilst working fully remote and often had Zoom calls where we would share our screen to look at code. We also pair programmed certain features to remove unnecessary mistakes and to assist as we found ourselves at different technical capabilities. 

To protect our main branch from breaking the application and to make sure people have greater visibility over code that they haven't worked on, a peer review process was in place in the GitHub repository where at least one other group member must look at and approve the code before it can be merged into the main branch.

We placed a development freeze on our group from Friday 5th March, to allow us time to refine and to ensure that any new features wouldn't break the application.

### Communication
There is a team Slack channel that has been set up to facilitate a communications hub where we arranged meetings and posted general questions about the application. We could also send screenshots, videos and code snippets within Slack to help demonstrate any issues within our messages. Slack was chosen as its used within the wider organisation. 

The Trello board would also alert us to any changes made so we can see if any group members had added anything to the backlog or assigned themself to a ticket. 

Weekly demos were presented within the group to feedback on the application's overall progress, this also helped align ourselves to understanding what next actions needed to be taken in the following week, which kept us focused and on task.

## Key Stakeholders:
- Development Team
    - Joe Mills
    - Lucy Burgin
    - Fiona Simons
    - Chloe Williams
- Mick Marriott (Lecturer)

## Application Overview:
The application has 4 main functions:

1. A user can register and login to our application.

1. A user is able to enter a postcode and find local coffee shops.

2. A user can leave a review of a coffee shop.

3. A user can view, edit and delete all the ratings they have made from their profile page.

The application is being developed as a "mobile first" application. The website will still function the same in a computer web browser however will be styled differently. The wireframes were used as a guide when we were first generating ideas as to how the application would look.

## Wireframes:
![Detail - Desktop](https://user-images.githubusercontent.com/46544086/110933761-16886c00-8325-11eb-8eff-f4eeda0ac75b.png)
![Detail - Mobile](https://user-images.githubusercontent.com/46544086/110933774-1a1bf300-8325-11eb-839a-fd6c935386c3.png)
![Homepage - Desktop](https://user-images.githubusercontent.com/46544086/110933786-1be5b680-8325-11eb-9bf4-9d015ae4b78e.png)
![Homepage - Mobile](https://user-images.githubusercontent.com/46544086/110933809-230cc480-8325-11eb-97a2-35ccbd2f1fab.png)
![Login - Desktop](https://user-images.githubusercontent.com/46544086/110933812-23a55b00-8325-11eb-9303-55700476da1a.png)
![Login - Mobile](https://user-images.githubusercontent.com/46544086/110933813-23a55b00-8325-11eb-89db-482044fc6ed5.png)
![Profile - Desktop](https://user-images.githubusercontent.com/46544086/110933814-243df180-8325-11eb-9f88-2f5becec131b.png)
![Profile - Mobile](https://user-images.githubusercontent.com/46544086/110933816-243df180-8325-11eb-8de1-81d59531edf8.png)
![Sign up - Desktop](https://user-images.githubusercontent.com/46544086/110933818-24d68800-8325-11eb-825d-55818a9621a4.png)
![Sign up - Mobile](https://user-images.githubusercontent.com/46544086/110933822-256f1e80-8325-11eb-8b6d-2f1cb4f0be8d.png)

## Sequence Diagrams:
![Ratings_Sequence_Diagram](https://user-images.githubusercontent.com/46544086/110935415-4afd2780-8327-11eb-8139-a0b30a46c9a4.png)
![Register_Sequence_Diagram](https://user-images.githubusercontent.com/46544086/110935418-4b95be00-8327-11eb-999d-30fae087f845.png)
![Login_Sequence_Diagram](https://user-images.githubusercontent.com/46544086/110935423-4c2e5480-8327-11eb-8fed-a0d9ecbe4750.png)
![API_Sequence_Diagram](https://user-images.githubusercontent.com/46544086/110933934-48013780-8325-11eb-9d50-3e4249fbe58d.png)

## Application Security
We have implemented different security features to protect against malicious users gaining access to the application and the underlying data within the database, these are: 

### Checks user is logged in
Only logged in users can access the main application.
### Checks user is admin
Only admin users will be able to access the admin page where they can edit and delete both users and ratings.
### Password hashing 
Any passwords saved into the database are hashed using 'bcrypt'.
### Strong password requirements
Passwords must be 8-15 characters long containing at least one lowercase letter, one upercase letter, one numeric digit and one special character
### Maximum log-in attempts 
If a user incorrectly enters their password 5 times, they will be made to have a 30 second cooldown period.
### API not stored in GitHub repository
Ensures that malicious users cannot use the API key.
