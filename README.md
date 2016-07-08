# boteam
A open source bot for teams in Slack.

Simple as this gif:
![demo](https://raw.githubusercontent.com/cristianoliveira/boteam/master/boteam.gif)

# Development
This projects uses vagrant and ansible for provising a simple
development enviroment. To use it just follow this instructions.
Make sure you have installed:

 - VirtualBox
 - Vagrant
 - Ansible

Then run:
```bash
vagrant up
vagrant ssh -c 'cd /projects/ && npm install'
vagrant ssh -c 'SLACK_TOKEN=MYTOKEN node /projects/app.js'
```
The project sync folder is `/projects`
