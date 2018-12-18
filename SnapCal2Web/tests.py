from django.test import TestCase
from django.urls import reverse
from SnapCal2Web.snapcv import CVHelper
from rest_framework.test import APIRequestFactory, APIClient
import base64

class SnapCVTests(TestCase):
    b64image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABiCAYAAACI/lfbAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAHpSURBVHic7du/TsJQGEDx76KIm4M66GSIow6uPoEx8SVg8ClcfA6jT6EO+gwOOuLiKrI4oQh19k8i1TbcY84vYSvlIydt06Y3FUVRhLAasx5Af2NAOAPCGRDOgHAGhDMgnAHhDAhnQDgDwhkQzoBwBoQzIFx2AQeDQUwmk1mPgZFdwF6vF6PRaNZjYGQXUOUYEM6AcAaEMyCcAeEMCGdAOAPCGRDOgHDzde683+/HcDgs9R0fZJdTa8DxeFz6wXS73Y5Wq1XTRNVIKUUui7qSy8vKyymg10A4A8IZEM6AcAaEMyCcAeGyDlg8nsTeYoqUPn4W90/jadrbsNeL6KzMfdnHws5x3I2/2fzqMNbmPv9mM7aObuKt0n9XjawD6mcGhDMgnAHhDAhnQDgDwhkQzoBwBoSr9Z2YurxcdmO10Z31GFnwCIQzIJwB4ZDXwMbSRmxvLk83fPEcD7f38fSWx2uAVUMGbO4exfV5J1bSFBu/XkRn/SDOBv8zoKdQOAPCGRDOgHAGhDMgnAHhDAhnQDgDwhkQzjXyv+AaeVXGgHAGhDMgnAHhDAhnQDgD/kIu94ARBsQzIJwB4QwIZ0A4A8IZEM6AcAaEMyCcAeEMCGdAOAPCGRDOgHAGhDMgnAHhDAhnQDgDwr0DjfhUciNCRL0AAAAASUVORK5CYII="
    b64image = b64image[b64image.find('base64,')+7:]
    img = base64.b64decode(b64image)
    cvhelper = CVHelper()
    texts = cvhelper.detect(img)
    
    assert texts[0].description == 'HI\n'

class ImageResponseTests(TestCase):
    def test_receive_image(self):
        factory = APIRequestFactory()
        self.client = APIClient()
        request = factory.post(reverse('process_image'), None, format='json')
        b64img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAABiCAYAAACI/lfbAAAABHNCSVQICAgIfAhkiAAAABl0RVh0U29mdHdhcmUAZ25vbWUtc2NyZWVuc2hvdO8Dvz4AAAHpSURBVHic7du/TsJQGEDx76KIm4M66GSIow6uPoEx8SVg8ClcfA6jT6EO+gwOOuLiKrI4oQh19k8i1TbcY84vYSvlIydt06Y3FUVRhLAasx5Af2NAOAPCGRDOgHAGhDMgnAHhDAhnQDgDwhkQzoBwBoQzIFx2AQeDQUwmk1mPgZFdwF6vF6PRaNZjYGQXUOUYEM6AcAaEMyCcAeEMCGdAOAPCGRDOgHDzde683+/HcDgs9R0fZJdTa8DxeFz6wXS73Y5Wq1XTRNVIKUUui7qSy8vKyymg10A4A8IZEM6AcAaEMyCcAeGyDlg8nsTeYoqUPn4W90/jadrbsNeL6KzMfdnHws5x3I2/2fzqMNbmPv9mM7aObuKt0n9XjawD6mcGhDMgnAHhDAhnQDgDwhkQzoBwBoSr9Z2YurxcdmO10Z31GFnwCIQzIJwB4ZDXwMbSRmxvLk83fPEcD7f38fSWx2uAVUMGbO4exfV5J1bSFBu/XkRn/SDOBv8zoKdQOAPCGRDOgHAGhDMgnAHhDAhnQDgDwhkQzjXyv+AaeVXGgHAGhDMgnAHhDAhnQDgD/kIu94ARBsQzIJwB4QwIZ0A4A8IZEM6AcAaEMyCcAeEMCGdAOAPCGRDOgHAGhDMgnAHhDAhnQDgDwr0DjfhUciNCRL0AAAAASUVORK5CYII="
        request.data = {'data': b64img}

        self.response = self.client.post(reverse('process_image'), request.data, format='json')

        assert self.response.status_code != 400
        assert self.response.data['descriptions'] == ['HI\n', 'HI']
