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
myclient = pymongo.MongoClient("mongodb://team12:mongoDBteam12@13.95.120.117:27017/userdb?authMechanism=SCRAM-SHA-1&authSource=userdb")
mydb = myclient["userdb"]
# create a Socket.IO server
pyio = socketio.Server()

# wrap with a WSGI application
app = socketio.WSGIApp(pyio)

						
#After finding a match in a certain group this function is called to check for more matches in this image group
#If more than n matches is found the new image is added to the group, and the players get rewarded, otherwise nothing happens.		
def checkForBestMatch(image_data, file):
    number_of_matches = 0
    print(" -  checkForBestMatch() called")
    n = len(image_data)/3
    n = int(math.ceil(n))
    winning_players = []
    index = 0
    best_match_rate = 0
    best_index = 0
    for img_data in image_data:

        image_string = img_data["encoded_image"]

        i = image_string.find(",") + 1
        base64_image = image_string[i:len(image_string)]
        img = "groupImg."
        if image_string.find("jpeg", 0, 25) >= 0:
            img += "jpg"
        elif image_string.find("png", 0, 25) >= 0:
            img += "png"

        with open(img, "wb") as fh:
            fh.write(base64_image.decode('base64'))

        isMatch, match_rate = compareImages(img, file)
        if best_match_rate < match_rate and isMatch:
            best_index = index
            best_match_rate = match_rate
            n -= 1
        if isMatch:
            number_of_matches += 1
            if img_data["player_id"] not in winning_players:
                winning_players.append(unicodedata.normalize('NFKD', img_data["player_id"]).encode('ascii', 'ignore'))
        print(n)
        index += 1
    if n <= 0:
        print("\n\n/=======================================\n|")
        print("|    Best match rate     :  " + str(round(best_match_rate,2))) + "%"
        print("|    total matches       :  " + str(number_of_matches) + " of " + str(len(image_data)))
        print("|    winning players     :  " + str(winning_players))
        print("|\n|    threshold of 33% matches reached! => uploaded picture added to the collection")
        print("|\n\=======================================\n\n")
        winning_players.append(unicodedata.normalize('NFKD', image_data[best_index]["player_id"]).encode('ascii', 'ignore')) #Player with best match gets double the points
        return winning_players
    else:
        print("\n\n/=======================================\n|")
        print("|    total matches       :  " + str(number_of_matches) + " of " + str(len(image_data)))
        print("|\n|    threshold of 33% matches NOT reached! => uploaded picture discarded")
        print("|\n\=======================================\n\n")
        return []


def createNewGroup(new_image_data, location):
    print(" -  createNewGroup() called")
    mycol = mydb["missiongroups"]
    arr = [new_image_data,]
    id = mycol.insert_one({'location': location, 'image_data': arr})
    print("\n\n/=======================================\n|")
    print("|    No targets near => let players vote for new target")
    print("|\n\=======================================\n\n")
    return str(id.inserted_id)


def setDataBaseImageInGroup(group_id, new_image_data):
    print(" -  setDataBaseImageInGroup() called      group_id:" + str(group_id))
    mycol = mydb["missiongroups"]
    mycol.update({'_id': group_id}, {'$push': {'image_data': new_image_data}})


def getDataBaseGroups():
    print(" -  getDataBaseGroups() called")
    mycol = mydb["missiongroups"]
    mydoc = mycol.find({},{"_id":1, "image_data":1, "location":1})
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


def compareImages(first, second):
    print(" -  compareImages() called")
    image_to_compare = cv2.imread(first)
    original = cv2.imread(second)

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
    print("Good matches     :  " + str(len(good_points)))
    match_rate = 0
    if len(keyp_1) != 0:
        match_rate = (float(len(good_points)) / float(len(keyp_1)) * 100)
    print("Match percentage :  " +  str(round(match_rate)) + " %")
    if match_rate >= 3:
        print("Images are similar!\n")
        return True, match_rate;
    else:
        print("Images are NOT similar.\n")
        return False, match_rate;


def degreesToRadians(degrees):
    return degrees * math.pi / 180


def distanceBetween(A, B):
    print("\n - distanceBetween() called!")
    lat1 = A[0]
    lon1 = A[1]
    lat2 = B[0]
    lon2 = B[1]
    x = degreesToRadians(lon2-lon1) * math.cos(degreesToRadians(lat2+lat1)/2)
    y = degreesToRadians(lat2-lat1)
    d = math.sqrt(x*x + y*y) * 6371
    print("(x,y):   (" + str(x) + ", " + str(y) + ")     d:    " + str(d*1000))
    return d * 1000 # * 1000 (answer in meters)


range = 50     # max distance between two images


@pyio.on('connect')
def connect(sid, environ):
    print(' ** new connection:  ' + sid)


@pyio.on('compareNewImage')
def compareNewImage(sid, jsondata):
    print("\n")
    print(" >> new image received from Node server:")
    data = json.loads(jsondata)
    player = unicodedata.normalize('NFKD', data["player_id"]).encode('ascii', 'ignore')
    minigame_image = unicodedata.normalize('NFKD', data["image"]).encode('ascii', 'ignore')
    index = minigame_image.find(",") + 1
    base64_image = minigame_image[index:len(minigame_image)]
    print((len(base64_image) % 4) == 0)
    location = data["location"]
    print("player:  " + player)
    first_img = "newImage."
    if minigame_image.find("jpeg", 0, 25) >= 0:
        first_img += "jpg"
    elif minigame_image.find("png", 0, 25) >= 0:
        first_img += "png"

    with open(first_img, "wb") as fh:
        fh.write(base64_image.decode('base64'))

    new_image_data = {"encoded_image": minigame_image, "player_id": player}

    groups = getDataBaseGroups()
    print("number of targets:  " + str(groups.count()))
    index = 0
    match_found = False
    close_to_existing_target = False
    while index < groups.count():
        current_group = groups.next()
        dist = distanceBetween(location, current_group["location"])
        print(str(index) + ": distance to target " + str(current_group["_id"]) + ":   " + str(dist))
        if dist < range:
            close_to_existing_target = True
            for img_data in current_group["image_data"]:
                index = img_data["encoded_image"].find(",") + 1
                base64_data = img_data["encoded_image"][index:len(img_data["encoded_image"])]
                second_img = "image."
                if minigame_image.find("jpeg", 0, 25) >= 0:
                    second_img += "jpg"
                elif minigame_image.find("png", 0, 25) >= 0:
                    second_img += "png"
                with open(second_img, "wb") as fh:
                    fh.write(base64_data.decode('base64'))
                is_match, match_rate = compareImages(first_img, second_img)
                if is_match:
                    match_found = True
                    winning_players = checkForBestMatch(current_group["image_data"], first_img)
                    print(winning_players)
                    if len(winning_players) > 0:
                        setDataBaseImageInGroup(current_group['_id'], new_image_data)
                        jsondata = json.dumps({'winning_players': winning_players})
                        pyio.emit('comparisonResult', jsondata)
                    else:
                        jsondata = json.dumps({'winning_players':0})
                        pyio.emit('comparisonResult', jsondata)
                    break;
        index += 1
    if not match_found and not close_to_existing_target:
        print(" ! no match found ! ")

        id = createNewGroup(new_image_data, location)

        jsondata = json.dumps({'player_id': data["player_id"], 'image': data["image"], 'location': data["location"], "group_id": id})
        pyio.emit('newGroup', jsondata)


if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', 5000)), app)
