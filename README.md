This project was built as a demonstration of the following requirements:

In Java,  implement a simple ceiling fan with these characteristics:
•    The unit has 2 pull cords:   One increases the speed each time it is pulled.  There are 3 speed settings, and an “off” (speed 0) setting.   If the cord is pulled on speed 3, the fan returns to the “off” setting. One reverses the direction of the fan at the current speed setting. Once the direction has been reversed, it remains reversed as we cycle through the speed settings, until reversed again.
•    You can assume the unit is always powered (no wall switch)

Assessment format: Please provide your project via a link to your public code repository.

====
This project is a simple spring-boot application with some APIs for retrieving and updating the fan sattings from a Mysql db,
and a UI built by React JS. It contains display of the current fan speed and fan direction settings, a fan (png file) with simple animation,
and 2 cords made by simple canvas Canvas API. User can pull the cords to change settings.

The db is hosted in a Linux VM, which is accessible from the internet.

To start the application:
$ ./mvnw spring-boot:run

After starting the application, access the GUI locally by entering http://localhost:8080/ in your browser.

I also installed the application in a Linux VM. To have a quick look, just goto http://vp1.captionnow.ca:8080/

