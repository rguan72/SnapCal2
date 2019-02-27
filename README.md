# SnapCal Web
College student organization fairs can get really hectic:
![alt text][festifall]

[festifall]: https://github.com/rguan72/SnapCal/blob/master/md_images/festifall.jpg
<br align="center">*UMICH Festifall*</br>

During these fairs, you often pick up way too many fliers for events like mass meetings:
![alt text][fliers]

[fliers]: https://github.com/rguan72/SnapCal/blob/master/md_images/IMG_0779.JPG

# What SnapCal does
In 2018, you shouldn't have to manually enter the dates of the mass meetings you want to attend. You could add images to the calendar, but what if you want event alerts?

With SnapCal, you can an event on a flier to your calendar with just one click. SnapCal uses computer vision (including the Google Cloud Platform and Cloud Vision API) and the Google Calendar API to extract event dates from a photo you take on your device.

# Development prerequisites
Make sure you have pip and pipenv installed on your system.
Create a virtual environment with Python version 3.7.


# Install necessary packages.
Run these commands within the project root directory (SnapCal2)
```
(myenv)$ pipenv install

(myenv)$ pip install -r requirements.txt

(myenv)$ pipenv lock
```
# Run in the future
Get in the virtualenv:
```
(myenv)$ pipenv shell
(myenv)$ python manage.py runserver
```
Run the Django app locally on your computer. 

# Run app
This is being developed and deployed on Google Cloud Platform.

# Access the app as a consumer, not developer:
[SnapCal2](https://snapcal.richardguan.me)
