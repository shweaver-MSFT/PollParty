# PollParty
PollParty is a Web Content Add-In for PowerPoint that enables a live, interactive polling experience to promote audience engagement during the presentation.

As a content add-in, PollParty can be used like any other object in a PowerPoint slide; stretched, transformed, etc. For the intended experience, stretch the add-in instance to completely fill the slide.

The PollParty experience consists of 3 parts:

1. Backend data api & routing
1. Web Content AddIn for PowerPoint
1. Poll response website

### Backend Data API & Routing
All of the PollParty experience is hosted through a single node instance. It maintains the polling data and supplies the routing for the PowerPoint Add-In experience and response website. 

### Web Content Add-In for PowerPoint
The PowerPoint add-in supports a workflow for a presenter to design a presentation with PollParty enabled slides interleaved in. While editing a presentation, the designer will be able to configure the questions for each PollParty slide. Once the presentation goes live, the configured PollParty slides will change to instead show the live results of voting audience members.

### Poll Response Website
During a presentation with PollParty enabled slides, audience members can use a mobile or other web browser to join the polling session for their presentation instance and respond to the current poll. Their responses will be reflected live in the presentation on the PollParty slide.

## Server Setup

All you need is NodeJs to run the sample.

In a terminal window:
- `git clone https://github.com/shweaver-MSFT/PollParty.git` to get the code.
- `cd PollParty` to change directory.
- `npm i` to get any missing local dependencies.
- `npm start` to start a localhost server on port `3000`.

The two web endpoints are routed to:

- Presenter: http://127.0.0.1:3000/add-in/
- Audience: http://127.0.0.1:3000/web/

***Note:***
The presenter endpoint will only function correctly when running inside of PowerPoint. The Audience endpoint should be accessed directly by audience members.

## Add PollParty to PowerPoint
Follow the guidance at [Sideload Office Add-ins for testing](https://docs.microsoft.com/en-us/office/dev/add-ins/testing/create-a-network-shared-folder-catalog-for-task-pane-and-content-add-ins) to add the PollParty add-in to your PowerPoint experience.

## Configure a PollParty Presentation
Start in PowerPoint, with a blank slide.

1. In the PowerPoint ribbon: select the `Insert` tab, select `My Add-Ins`, and find the PollParty add-in to add it to the slide.

1. Stretch the add-in to fill the slide. This is technically optional, but it tends to look better when it fills the slide.

1. The add-in will load ready for you to type in your first poll question. For the best effect, input a question with a *yes/no* type of response. Once you are satisfied, click `Save`.

1. At this point you can repeat the process on a new slide if you wish to configure a multi-question polling experience.

1. When you are ready, click the Slide Show button in PowerPoint to start the presentation. The add-in will change from edit to live mode, with an active session code displayed.

## Engage the Audience with PollParty
While a PollParty slide is being presented,

1. Audience members can respond by going to http://127.0.0.1/web/ and using the join code displayed on the slide. 

1. Once a response has been submitted, the results will be displayed live in the presentation.