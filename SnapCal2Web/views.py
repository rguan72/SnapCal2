from django.http import HttpResponse
from django.shortcuts import render
from SnapCal2.settings import BASE_DIR
from rest_framework.views import APIView
from googleapiclient.discovery import build
from oauth2client import file, client, tools
from httplib2 import Http
import base64
import time
from SnapCal2Web.snapcv import CVHelper

# Decorator for oauth. Any way to make it non global?

def index(request):
    # testing imports
    from google.auth import app_engine
    from google.cloud import vision
    from google.cloud.vision import types

    return render(request, 'app.html')

class ProcessImageResponse(APIView):
    """
    This API receives the image sent to the server and extracts
    the text.
    """
    def get(self, request):
        pass

    def post(self, request):
        try:
            image = request.data['data']
            if image is None:
                raise KeyError
        except KeyError:
            msg = {'Error': 'Bad Request'}

        # remove b64 header
        b64image = image[image.find("base64,")+7:]
        image = base64.b64decode(b64image)
        cvhelper = CVHelper()
        cvhelper.detect(image)

        return HttpResponse('')

# TODO: Implement properly
class CalAuth(APIView):
    """
    This API authorizes the app to read/write to the user's google calendar.
    """
    def get(self, request):
        pass

    def post(self, request):
        SCOPES = 'https://www.googleapis.com/auth/calendar.events'
        # try:
        store = file.Storage('token.json')
        creds = store.get()
        if not creds or creds.invalid:
        # except FileNotFoundError:
            flow = client.flow_from_clientsecrets('credentials.json', SCOPES)
            creds = tools.run_flow(flow, store)

        service = build('calendar', 'v3', http=creds.authorize(Http()))

        return HttpResponse('')
