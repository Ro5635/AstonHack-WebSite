# Aston Hack Website

:rotating_light: 

2017 AstonHack website, HTML files and media assets are in the static directory, this is the directory that is synced with the Web Server.

## Production Environment

The current production environment has the static file on a AWS S3 bucket that is served to the Internet through AWS CloudFront. CloudFront operates as the
CDN and utilities HTTPS. The SSL certificate is generated with AWS certificate manager at no cost.

DNS Routing is handled from CloudFlare. 


## Ticketing System

	The ticketing for the event is completed through MYMLH, this has been selected over EventBrite that has been used in the past, this was in part due to its integration with MLH.


## Notification System

 The site during the event will connect through web-sockets (socket.io) to receive notifications such as 'Lunch Now Serving' and 'X Workshop Now Starting', this has a simple back-end written in node. This will be deployed on PM2
 on EC2 with automatic fail-over during the event.


## Legal

 All of the media files used are either produced for and owned by the Aston Computer Science Society or attained from MLH event photography at previous Aston hack events, these photos are used under the terms listed at the event.  