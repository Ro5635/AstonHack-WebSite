# Aston Hack Website

:rotating_light: 

2017 AstonHack website, HTML files and media assets are in the static directory, this is the directory that is synced with the Web Server.

## Building

Gulp is utilised to build the static files and compile the sass, the partial pages that form the pages within the project are stored in the partialPages folder.

!! ISSUE !! : The gulp build of SASS falls over, as a workaround I have been using compass directly to compile the SASS files.
!! ISSUE !! : The footer is currently duplicated, this is down to the requirement to include the scripts in a set order... This should be re-visited

## Production Environment

The current production environment has the static file on a AWS S3 bucket that is served to the Internet through AWS CloudFront. CloudFront operates as the
CDN and utilities HTTPS. The SSL certificate is generated with AWS certificate manager at no cost.

DNS Routing is handled from CloudFlare. 


## Ticketing System

The ticketing for the event is completed through MYMLH, this has been selected over EventBrite that has been used in the past, this was in part due to its integration with MLH. The back end for the ticketing system is contained within its own repository.


## Notification System

 The site during the event will connect through web-sockets (socket.io) to receive notifications such as 'Lunch Now Serving' and 'X Workshop Now Starting', this has a simple back-end written in node. This will be deployed on PM2. 

 The sending of notifications will be authenticated using JWT (JSON Web Tokens), this allows for easy authentication.

 on EC2 with automatic fail-over during the event.


## Legal

 All of the media files used are either produced for and owned by the Aston Computer Science Society or attained from MLH event photography at previous Aston hack events, these photos are used under the terms listed at the event.  

