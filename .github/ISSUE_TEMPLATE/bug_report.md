---
name: Bug report
about: Create a report to help us improve
title: ''
labels: ''
assignees: ''

---

Bug Description
When accessing the site on a mobile device, there is a horizontal scrollbar on the right side of the page. This unwanted space causes the content to extend beyond the screen width, leading to a poor user experience.

Steps to Reproduce
Open the website on any mobile device (or use the developer tools in a desktop browser to simulate a mobile view).

Try to scroll horizontally on the page.

Observe the empty space that appears on the right side of the screen.

Expected Behavior
The page should fit the screen perfectly without any horizontal scrolling. The content should not exceed the viewport width.

Actual Behavior
There is an unnecessary empty space on the right side of the page on mobile devices. This suggests that the page's layout is not properly formatted for smaller screens.

Screenshots/Logs
(If available, please add screenshots or video here to illustrate the bug.)

Additional Information
This bug is likely related to CSS or responsive design issues. It could be caused by an incorrect width on a main div element or by not having max-width: 100% on content elements like img or video.
