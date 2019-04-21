import numpy as np
import eventlet
import cv2 as cv2
import time
import socketio
import pymongo
import json
import unicodedata
import math
#opencv version 3.2.4.16
myclient = pymongo.MongoClient("mongodb://13.95.120.117:27017/")
mydb = myclient["userdb"]
# create a Socket.IO server
pyio = socketio.Server()

# wrap with a WSGI application
app = socketio.WSGIApp(pyio)

						
#After finding a match in a certain group this function is called to check for more matches in this image group
#If more than n matches is found the new image is added to the group, and the players get rewarded, otherwise nothing happens.		
def checkForBestMatch(image_data):
    print(" -  checkForBestMatch() called")
    n = len(image_data)//3
    winning_players = []
    index = 0
    best_match_rate = 0
    best_index = 0
    for img_data in image_data:
        with open("image.png", "wb") as fh:
            fh.write((img_data["encoded_image"]).decode('base64'))
        isMatch, match_rate = compareImages()
        if best_match_rate < match_rate and isMatch:
            best_index = index
            n -= 1
        if img_data["player_id"] not in winning_players:
            winning_players.append(img_data["player_id"]);
    if n <= 0:
        winning_players.append(image_data[best_index]["player_id"]) #Player with best match gets double the points
        return winning_players
    return []
		
def createNewGroup(new_image_data, location):
    print(" -  createNewGroup() called")
    mycol = mydb["missiongroups"]
    return mycol.insert_one({"location": location, 'image_data': [new_image_data,]})

def setDataBaseImageInGroup(group_id, new_image_data):
    print(" -  setDataBaseImageInGroup() called      group_id:" + group_id)
    mycol = mydb["missiongroups"]
    mycol.update({'_id': group_id}, {'$push': {'image_data': new_image_data}})
	
def getDataBaseGroups():
    print(" -  getDataBaseGroups() called")
    mycol = mydb["missiongroups"]
    myquery = {}
    mydoc = mycol.find(myquery,{"_id":1, "image_data":1})
    return mydoc
		
	
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

def compareImages():
    print(" -  compareImages() called")
    image_to_compare = cv2.imread("image.jpg")
    original = cv2.imread("newImage.jpg")

    height_2, width_2, channels_2 = image_to_compare.shape
    height, width, channels = original.shape

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
    match_rate = (float(len(good_points)) / float(len(keyp_1)) * 100)
    print("Match %:   ", match_rate)
    if match_rate >= 3:
        print("Images are similar!")
        return True, match_rate;
    else:
        print("Images are NOT similar")
        return False, match_rate;

def degreesToRadians(degrees):
    return degrees * math.pi / 180

def distanceBetween(A, B):
    lat1 = A[0]
    lon1 = A[1]
    lat2 = B[0]
    lon2 = B[1]
    x = degreesToRadians(lon2-lon1) * math.cos(degreesToRadians(lat2+lat1)/2);
    y = degreesToRadians(lat2-lat1);
    d = math.sqrt(x*x + y*y) * 6371;
    return d * 1000; # * 1000 (answer in meters)

range = 100     # max distance between two images

@pyio.on('connect')
def connect(sid, environ):
    print(' ** new connection:  ' + sid)


@pyio.on('compareNewImage')
def compareNewImage(sid, jsondata):
    print("\n")
    print(" >> new image received from Node server:")
    data = json.loads(jsondata)
    player = unicodedata.normalize('NFKD', data["player_id"]).encode('ascii', 'ignore')
    minigameImage = unicodedata.normalize('NFKD', data["image"]).encode('ascii', 'ignore')
    location = data["location"]
    print("player:  " + player)

    with open("newImage.png", "wb") as fh:
        fh.write(minigameImage.decode('base64'))

    new_image_data = {"encoded_image": minigameImage, "player_id": player}

    groups = getDataBaseGroups()
    print("number of groups:  " + str(groups.count()))
    index = 0
    match_found = False
    close_to_existing_target = False
    while index < groups.count():
        current_group = groups.next()
        print(current_group["_id"])
        if distanceBetween(location, current_group["location"]) < range:
            close_to_existing_target = True
            for img_data in current_group["image_data"]:

                with open("image.png", "wb") as fh:
                    fh.write((img_data["encoded_image"]).decode('base64'))
                isMatch, match_rate = compareImages()
                if isMatch:
                    match_found = True
                    winning_players = checkForBestMatch(current_group["image_data"])
                    if len(winning_players) != 0:
                        setDataBaseImageInGroup(current_group._id, new_image_data)
                        jsondata = json.dumps({'winning_players': winning_players})
                        pyio.emit('comparisonResult', jsondata)
                    else:
                        jsondata = json.dumps({'winning_players':0})
                        pyio.emit('comparisonResult', jsondata)
        index += 1
    print(" -- while loop exited -- ")
    if not match_found and not close_to_existing_target:
        print(" ! no match found ! ")

        id = createNewGroup(new_image_data, location)

        jsondata = json.dumps({'player_id': player, 'image': minigameImage, 'location': location, "group_id": id})
        pyio.emit('newGroup', jsondata)


if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', 5000)), app)