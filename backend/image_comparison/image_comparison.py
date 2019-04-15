import numpy as np
import cv2 as cv2
import time
import socketio
import pymongo
import base64
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
	n = len(image_data)//3
	winning_players = []
	index = 0
	best_match_rate = 0
	best_index = 0
	for img_data in image_data:
		with open("image.png", "wb") as fh:
			fh.write((img_data["encoded_image"]).decode('base64')
		isMatch, match_rate = compareImages()
		if best_match_rate < match_rate && isMatch:
			best_index = index
			n -= 1
		if img_data["player_id"] not in winning_players:
			winning_players.append(img_data["player_id"])
	if n <= 0: 	
		winning_players.append(imgage_data[best_index]["player_id"]) #Player with best match gets double the points
		return winning_players	
	else:
		return [] 
		
		



def setDataBaseImageInGroup(group_id, new_image_data):
	mycol = mydb["missiongroups"]
	mycol.update({'_id': group_id}, {'$push': {'image_data': new_image_data}})
	
def getDataBaseGroups():
	mycol = mydb["missiongroups"]
	myquery = {}
	mydoc = mycol.find(myquery,{"_id":1, "images":1})
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
	image_to_compare = cv2.imread"image.jpg")
	original = cv2.imread("newImage.jpg")

	height, width, channels = original.shape
	height_2, width_2, channels_2 = image_tocompare.shape

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
		
@pyio.on('compareNewImage')
def compareNewImage(sid, data):
	print(data) 
	minigameImage = data.image
	with open("newImage.png", "wb") as fh:
		fh.write(minigameImage.decode('base64')
	
	groups = getDataBaseGroups()
	index = 0
	while index < len(groups):
		for img_data in groups[index].image_data:
			with open("image.png", "wb") as fh:
				fh.write((img_data["encoded_image"]).decode('base64')
			
			isMatch, match_rate = compareImages()
			if isMatch:
				new_image_data = {"encoded_image": minigameImage, "player_id": data.player_id}
				winning_players = checkForBestMatch(groups[index].image_data)
				if len(winning_players) != 0:
					setDataBaseImageInGroup(groups[index]._id, new_image_data)
					pyio.emit('comparisonResult', {'winning_players': winning_players})
				else:
					pyio.emit('comparisonResult', {'winning_players': 0 })
		
