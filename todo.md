Needs:
- [x] Add tags to contact cards
- [ ] Add Notes to contacts 
- [ ] Setup Liquibase
- [ ] Setup Multiple tenants 
- [x] Password Reset Flow
- [ ] Users should be unique by location_id and (phone or email)
- [ ] Connect Admin calendars and allow New Volunteers to sign up for an interview 
- [ ] Get notified when someone fills out an application and automatically move the user to the correct pipeline status.
- [ ] Captcha for password reset

Bugs:

- [ ] Solve SMS shared template issue: Devii Reference number: Your reference is DCS-54
- [x] When you switch pipelines you have to refresh to get the users to show up. I think this has to do with the client loader?

Ideas:

- [ ] Allow Users to record meetings and label meetings in the platform -> Then search them
- [ ] Have the last question of the application in the new volunteer application to be to schedule an interview.
- [ ] Track activities for each user based on sms and call clicks
- [ ] Track the number of people contacted vs the number of people who volunteer to accurately predict the number of people who will volunteer
- [ ] Add contact by attaching contact card from phone. (not sure how possible this is)
- [ ] Better Chat UI
- [ ] Fix React Query so when chat changes something, it changes on the screen
- [ ] Natural Language Actions / Automations. I.e. Remind me Tuesday to reach out to Erik Olson. Or Everyday, check if there is a birthday to anyone I'm assigned to and text me a list of them. (Some optimization on the NLAPI's part could be useful here)
- [ ] Connect to Google Drive and be able to ask questions about anything in there. (Have to consider permissions as we wouldn't want to be able to answer questions about specific child applications potentially. But since this is strictly an admin tool, it may be fine.)
- [ ] Record a changelog that is searchable by text.
- [ ] Create a way to forward emails to the system with commands to do things. For example we received a new donation email. On that email it sometimes has a name, amount, etc. Can we forward that to the software to have it record it automatically for a person that exists or create someone, etc.
