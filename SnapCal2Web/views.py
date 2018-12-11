from django.http import HttpResponse

def index(request):
    # testing imports
    from google.auth import app_engine
    from google.cloud import vision
    from google.cloud.vision import types

    return HttpResponse("Hello world! This is SnapCal2!")
