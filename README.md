# PollParty
Group interaction in PowerPoint presentations via content add ins.

#### There are three main workflows:
1. Presenter configuring the questions inside the powerpoint content add in. 
2. Presenter presenting to audience.
3. Audience responding to the question via mobile/pc etc.

#### The NodeJS Web application consists of mainly:
1. public/add-in: Contains UI, views, code and helpers to support the presenter configuration and presentation workflows.
2. public/web: Contains UI, views and code to support the audience workflow.
3. public/api: data apis for backend to support questions and sessions data.

 #### To Debug:
 Open project and Start Debugging in Visual Studio Code. The server starts running at http://127.0.0.1:3000/ 

The important web urls are:
* Presenter: <url>/add-in Eg. http://127.0.0.1:3000/add-in
* Audience: <url>/web Eg. http://127.0.0.1:3000/web
  
  To Debug the content add-in inside powerpoint. 
  1. Create a new Visual Project Powerpoint Content add-in project.
  2. Modify the xml manifest file  <DefaultSettings> SourceLocation to point to the Presenter URL.
  Eg. <DefaultSettings>
        <SourceLocation DefaultValue="http://127.0.0.1:3000/add-in" />
  3. Start Debugging. (Make sure the NodeJS web app is running).
  
 
  









