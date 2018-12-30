from django.http import HttpResponse
from django.shortcuts import render
from SnapCal2.settings import BASE_DIR
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from googleapiclient.discovery import build
from oauth2client import file, client, tools
from httplib2 import Http
import base64
import time
import json
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
            return Response(msg, status=status.HTTP_400_BAD_REQUEST)

        # remove b64 header
        b64image = image[image.find('base64,')+7:]
        image = base64.b64decode(b64image)
        cvhelper = CVHelper()
        texts = cvhelper.detect(image)
        event_strings = cvhelper.matcher(texts)

        data = dict(descriptions=event_strings)
        output_dict = json.dumps(data)
        output_json = json.loads(output_dict)
        # return object with calendar event strings to add
        return Response(output_json)
