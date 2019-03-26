import numpy as np
import cv2 as cv2
import plotly as py
import plotly.graph_objs as go
import time
#opencv-contrib needed to run SIFT

def image_resize(image, width = None, height = None, inter = cv2.INTER_AREA):
    dim = None
    (h, w) = image.shape[:2]

    if width is None and height is None:
        return image

    if width is None:

        r = height / float(h)
        dim = (int(w * r), height)

    else:
        r = width / float(w)
        dim = (width, int(h * r))

    resized = cv2.resize(image, dim, interpolation = inter)

    return resized

original_jpg = " (" + str(1) + ")"
comparison_jpg = " (" + str(2) + ")"

original = cv2.imread(original_jpg + ".jpg")
image_to_compare = cv2.imread(comparison_jpg + ".jpg")

height, width, channels = original.shape
height_2, width_2, channels_2 = image_to_compare.shape

fixed_width = 360
if width > fixed_width :
    original = image_resize(original, width=fixed_width)
if width_2 > fixed_width :
    image_to_compare = image_resize(image_to_compare, width=fixed_width)


# Check for similarities
sift = cv2.xfeatures2d.SIFT_create()
keyp_1, desc_1 = sift.detectAndCompute(original, None)
keyp_2, desc_2 = sift.detectAndCompute(image_to_compare, None)
print("Keypoints Image 1:   " + str(len(keyp_1)))
print("Keypoints Image 2:   " + str(len(keyp_2)))


index_params = dict(algorithm=0, trees=5)
search_params = dict()
flann = cv2.FlannBasedMatcher(index_params, search_params)

# k-nearest-neighbours
matches = flann.knnMatch(desc_1, desc_2, k=2) # k-nearest-neighbours

good_points = []
for m, n in matches:
    if m.distance < 0.6*n.distance:
        good_points.append((m,n))
print("GOOD Matches:   ", len(good_points))
match_rate = (len(good_points) / len(keyp_1) * 100)
print("Match %:   ", match_rate)
if match_rate >= 3:
    print("Images are similar!")
else:
    print("Images are NOT similar")

result = cv2.drawMatchesKnn(original, keyp_1, image_to_compare, keyp_2, good_points, None)
cv2.imshow("result", cv2.resize(result, None, fx=1, fy=1))
cv2.waitKey( )
cv2.destroyAllWindows()
